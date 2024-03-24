import {Declaration, Postcss, Root} from "postcss";

import { compute } from './lib/compute';

const TRANSFORM_FN_NAME = 'color-to-filter';
const PLUGIN_NAME = 'postcss-color-to-filters';

const customPropertyPtrn = /^--[A-z][\w-]*$/;
const hexRegex = /#[0-9a-fA-F]{6}/g;

type CustomPropsMap = Map<string, string>

const customPropsMap: CustomPropsMap = new Map();

const getCustomPropValue = (value: string, prepared: CustomPropsMap) => {
  let changed = true;

  while (changed && value.includes('--')) {
    changed = false; // Reset the changed flag for each iteration
    const t = value.split('--')[1].replace(')', '');
    const newValue = prepared.get(`--${t}`);
    if (newValue !== undefined) {
      value = newValue;
      changed = true;
    }
  }

  return value;
};

function getCustomPropertiesFromRoot(root: Root) {
  root.walkDecls((decl) => {
    if (customPropertyPtrn.test(decl.prop)) {
      customPropsMap.set(decl.prop, decl.value);
    }
  });
  return customPropsMap;
}

type ModuleOpt = {
  pluginName?: string
}

module.exports = (opts: ModuleOpt = {}) => {
  // Work with options here
  const pluginName = opts.pluginName || PLUGIN_NAME;
  let prepared = null;

  return {
    postcssPlugin: pluginName,
    prepare() {
      return {
        Once(root: Root) {
          prepared = getCustomPropertiesFromRoot(root);
        },
      };
    },
    Declaration(node: Declaration) {
      if (node.variable && node.value.includes(TRANSFORM_FN_NAME)) {
        // Extract the hex color value from the variable value
        let otherVariableDeclaration = null;
        const nodeValue = getCustomPropValue(node.value, prepared);
        const hexColorsMatch = nodeValue.match(hexRegex);

        const hexColors = hexColorsMatch || otherVariableDeclaration || null;

        // Modify the hex color value using your logic
        if (hexColors) {
          hexColors.forEach((hexColor: string) => {
            const filterValue = compute(hexColor);
            // Replace the hex color value with the modified filter value in the variable value
            node.value = filterValue.filterRaw;
          });
        }
      }
    },
  };
};

module.exports.postcss = true;
