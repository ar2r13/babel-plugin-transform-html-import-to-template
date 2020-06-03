import fs from 'fs'
import p from 'path'

const regexp = /\.(\w+$)/

function ext (path) {
    const match = path.match(regexp) || []
    return match[0]
}

export default ({ types: t }) => ({
    visitor: {
        ImportDefaultSpecifier({ parentPath }, { file, opts }) {
            const { value } = parentPath.node.source
            const { src, dist } = opts
            const extension = ext(value)

            if (!['.css', '.html'].includes(extension)) return
            
            const dir = p.dirname(p.resolve(file.opts.filename))
            const absolutePath = p.resolve(dir, value)

            try {  
                const optionalPath = p.resolve(
                    dist,
                    p.relative(p.resolve(file.opts.root, src), dir),
                    value
                )

                var content = fs.readFileSync(optionalPath, 'utf8') || ''
            } catch (error) {
                var content = fs.readFileSync(absolutePath, 'utf8') || ''
            }

            const name = parentPath.node.specifiers[0].local.name

            if (extension === '.html') 
                parentPath.replaceWithMultiple([
                    t.variableDeclaration('var', [
                        t.variableDeclarator(
                            t.identifier(name),
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
                            t.identifier(name),
                            t.identifier('innerHTML')
                        ),
                        t.stringLiteral(content)
                    ))
                ])

            if (extension === '.css') 
                parentPath.replaceWithMultiple([
                    t.variableDeclaration('var', [
                        t.variableDeclarator(
                            t.identifier(name),
                            t.newExpression(t.identifier('CSSStyleSheet'), [])
                        )
                    ]),
                    t.expressionStatement(t.callExpression(
                        t.memberExpression(
                            t.identifier(name),
                            t.identifier('replaceSync')
                        ),
                        [t.stringLiteral(content)]
                    ))
                ])
        }
    }
})