import fs from 'fs'
import p from 'path'

const regexp = /\.(\w+$)/

function ext (path) {
    const match = path.match(regexp) || []
    return match[0]
}

export default ({ types: t }) => ({
    visitor: {
        ImportDefaultSpecifier({ parentPath }, { file }) {
            const { value } = parentPath.node.source
            const extension = ext(value)

            if (!['.css', '.html'].includes(extension)) return
            
            const dir = p.dirname(p.resolve(file.opts.filename))
            const absolutePath = p.resolve(dir, value)
            const content = fs.readFileSync(absolutePath, 'utf8') || ''

            if (extension === '.html') 
                parentPath.replaceWithMultiple([
                    t.variableDeclaration('var', [
                        t.variableDeclarator(
                            t.identifier(parentPath.node.specifiers[0].local.name),
                            t.callExpression(
                                t.memberExpression(
                                    t.identifier('document'),
                                    t.identifier('createElement')
                                ),
                                [t.stringLiteral('template')]
                            )
                        )]),
                    t.expressionStatement(t.assignmentExpression(
                        '=',
                        t.memberExpression(
                            t.identifier('template'),
                            t.identifier('innerHTML')
                        ),
                        t.stringLiteral(content)
                    ))
                ])

            if (extension === '.css') 
                parentPath.replaceWith(t.variableDeclaration('var', [
                    t.variableDeclarator(
                        t.identifier(parentPath.node.specifiers[0].local.name),
                        t.callExpression(
                            t.memberExpression(
                                t.newExpression(t.identifier('CSSStyleSheet'), []),
                                t.identifier('replaceSync')
                            ),
                            [t.stringLiteral(content)]
                        )
                    )
                ]))
        }
    }
})