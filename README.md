# babel-plugin-transform-html-import-to-template

Turn HTML imports into HTMLTemplateElement.

## Example

Given the following _template.html_.

```html
<span>html template 🌞</span>
```

#### in

```js
import template from './template.html'
// ...
this.shadowRoot.append(template.content.cloneNode(true))
```

#### out

```js
var template = document.createElement(template).innerHTML = '<span>html template 🌞</span>'
```


## Installation

```sh
$ yarn add -D babel-plugin-transform-html-import-to-template
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-html-import-to-template"]
}
```

### Via CLI

```sh
$ babel --plugins transform-html-import-to-template script.js
```

### Via Node API

```javascript
import core from 'babel-core'

const plugins = [
    // ...
    'transform-html-import-to-template'
    // ...
]
core.transform(code, { plugins })
```