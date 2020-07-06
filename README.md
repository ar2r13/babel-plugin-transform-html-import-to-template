# babel-plugin-transform-html-import-to-template

Turn HTML imports into HTMLTemplateElement.

## Example

Given the following _template.html_.

```html
<span>html template 🌞</span>
```

#### input

```js
import template from './template.html'
import style from './style.css'
// ...
this.shadowRoot.append(template.content.cloneNode(true))
```

#### output

```js
var template = document.createElement('template');
template.innerHTML = '<span>html template 🌞</span>';

var style = new CSSStyleSheet;
style.replaceSync('span { color: dodgerblue })
// ...
this.shadowRoot.append(template.content.cloneNode(true))
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
