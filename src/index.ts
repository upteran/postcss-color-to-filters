import { Declaration, Root } from "postcss";

import { compute } from './lib/compute';

const TRANSFORM_FN_NAME = 'color-to-filter';
const PLUGIN_NAME = 'postcss-color-to-filters';

const customPropertyPtrn = /^--[A-z][\w-]*$/;

type CustomPropsMap = Map<string, string>

const customPropsMap: CustomPropsMap = new Map();

const getCustomPropValue = (value: string, prepared: CustomPropsMap) => {
  let changed = true;

  while (changed && value.includes('--')) {
    changed = false; // Reset the changed flag for each iteration
    const t = value.split('--')[1].replaceAll(')', '');
    const newValue = prepared.get(`--${t}`);
    if (newValue !== undefined) {
      value = newValue;
      changed = true;
    }
  }
  return value;
};

const getColorValueFromTransformFn = (value: string) => {
  const transformFnRegex = /color-to-filter\((.*?)\)/;
  const match = value.match(transformFnRegex);
  if (match && match[1]) {
    return match[1];
  }
  return value;
}

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
  /** The acceptanceLossPercentage parameter in the ModuleOpt type represents the acceptable loss
   * percentage for the color-to-filter transformation. This value is used to determine
   * the tolerance range for the transformation */
  acceptanceLossPercentage?: number
}

export default (opts: ModuleOpt = {}) => {
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
      if (node.value.includes(TRANSFORM_FN_NAME)) {
        const nodeValue = getCustomPropValue(node.value, prepared);
        const colorValue = getColorValueFromTransformFn(nodeValue);
        // todo: add error value handler
        node.value = compute(colorValue, opts.acceptanceLossPercentage).filter;
      }
    },
  };
};

export const postcss = true;
