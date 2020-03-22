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

            if (ext(value) != '.html') return

            const dir = p.dirname(p.resolve(file.opts.filename))
            const absolutePath = p.resolve(dir, value)
            const html = fs.readFileSync(absolutePath, 'utf8') || ''

            parentPath.replaceWith(t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(parentPath.node.specifiers[0].local.name),
                    t.assignmentExpression(
                        '=',
                        t.memberExpression(
                            t.callExpression(
                                t.memberExpression(
                                    t.identifier('document'),
                                    t.identifier('createElement')
                                ),
                                [t.stringLiteral('template')]
                            ),
                            t.identifier('innerHTML')
                        ),
                        t.stringLiteral(html)
                    )
                )
            ]))
        }
    }
})