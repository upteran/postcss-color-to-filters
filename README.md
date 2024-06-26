# postcss-color-to-filters

A PostCSS plugin to transform hex and rgb colors to CSS filters.

## Example

This plugin transforms CSS colors from hex and rgb formats to CSS filters. Here's an example of how it works:

**Input CSS**

```css
body {
  filter: color-to-filter('rgb(0, 0, 0)');
}
```

Output css:

```css
body {
  filter: brightness(0) saturate(100%) invert(16%) sepia(96%) saturate(7468%) hue-rotate(0deg) brightness(98%) contrast(103%);
}
```

## Installation
```bash
npm i postcss-color-to-filters
```

## Usage

1. Add plugin
```js
// add plugin
const postcssColorToFilter = require('postcss-color-to-filters');

module.exports = {
  plugins: [
    postcssColorToFilter
  ]
```

2. Use in css

```css
body {
  filter: color-to-filter('#fff');
}
```

Can use CSS custom properties:

```css
:root {
  --main-color: #fff;
}
body {
  filter: color-to-filter(var(--main-filter));
}

/* OR */

:root {
  --main-color: #fff;
  --main-filter: color-to-filter(var(--main-filter));
}

body {
  filter: var(--main-filter);
}

```

## Options
Within plugin usage can be change `acceptanceLossPercentage` option

```js
module.exports = {
  plugins: [
    postcssColorToFilter({
      // Acceptable color percentage to be lost during wide search.
      acceptanceLossPercentage: 5 // default 1
    })
  ]
};
```

## Credits

This plugin utilizes the [hex-to-css-filter](https://github.com/willmendesneto/hex-to-css-filter) library for all transformations from color values to filters. Special thanks to this library for its contribution.


## License
MIT
