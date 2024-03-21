const { compute } = require('./lib/compute');

/**
 * @type {import('postcss').PluginCreator}
 */

const customPropertyPtrn = /^--[A-z][\w-]*$/;
const hexRegex = /#[0-9a-fA-F]{6}/g;
const transformerFnName = 'color-to-filter';

const customPropsMap = new Map();

const getCustomPropValue = (value, prepared) => {
  let changed = true;

  while (changed && value.includes('--')) {
    changed = false; // Reset the changed flag for each iteration
    const t = value.split('--')[1].replace(')', '');
    const newValue = prepared.get(`--${t}`);
    if (newValue !== undefined) {
      value = newValue;
      changed = true; // Set the changed flag if a new value is found
    }
  }

  return value;
};

function getCustomPropertiesFromRoot(root) {
  root.walkDecls((decl) => {
    // Custom property declaration
    if (customPropertyPtrn.test(decl.prop)) {
      customPropsMap.set(decl.prop, decl.value);
    }
  });
  return customPropsMap;
}

module.exports = (opts = {}) => {
  // Work with options here
  const pluginName = opts.pluginName || 'postcss-color-to-filters';
  let prepared = null;

  return {
    postcssPlugin: pluginName,
    prepare() {
      return {
        Once(root) {
          prepared = getCustomPropertiesFromRoot(root);
        },
      };
    },
    Declaration(node) {
      if (node.variable && node.value.includes(transformerFnName)) {
        // Extract the hex color value from the variable value
        let otherVariableDeclaration = null;
        const nodeValue = getCustomPropValue(node.value, prepared);
        const hexColorsMatch = nodeValue.match(hexRegex);

        const hexColors = hexColorsMatch || otherVariableDeclaration || null;

        // Modify the hex color value using your logic
        if (hexColors) {
          hexColors.forEach((hexColor) => {
            const filterValue = compute(hexColor); // Assuming hexToFilter is defined elsewhere
            // Replace the hex color value with the modified filter value in the variable value
            node.value = filterValue.filterRaw;
          });
        }
      }
    },
  };
};

module.exports.postcss = true;
