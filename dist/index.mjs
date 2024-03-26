import { hexToCSSFilter } from 'hex-to-css-filter';

function isHEXValid(color) {
    const HEXColorRegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return !!HEXColorRegExp.test(color);
}

function isRGBValid(color) {
    const RGBColorRegExp = /^(rgb\()?\d{1,3}, ?\d{1,3}, ?\d{1,3}(\))?$/i;
    if (!RGBColorRegExp.test(color))
        return false;
    color = color.toLowerCase();
    const startCheck = color.startsWith('rgb');
    const endCheck = color.endsWith(')');
    if ((startCheck && !endCheck) || (!startCheck && endCheck))
        return false;
    const [r, g, b] = color
        .replace(/^rgb\(|\)| /, '')
        .split(',')
        .map((x) => parseInt(x));
    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}

function rgbToHex(rgb) {
    const componentToHex = (c) => c.toString(16).padStart(2, '0');
    const values = rgb.match(/\d+/g);
    if (!values) {
        throw new Error('Invalid format!');
    }
    const [r, g, b] = values.map(Number);
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

const config = {
    maxChecks: 5,
};
function compute(input, acceptanceLossPercentage) {
    if (isHEXValid(input)) {
        return hexToCSSFilter(input, config);
    }
    else if (isRGBValid(input)) {
        return hexToCSSFilter(rgbToHex(input), { ...config, acceptanceLossPercentage: acceptanceLossPercentage || 1 });
    }
    else {
        return { filter: input };
    }
}

const TRANSFORM_FN_NAME = "color-to-filter";
const PLUGIN_NAME = "postcss-color-to-filters";
const customPropertyPtrn = /^--[A-z][\w-]*$/;
const customPropsMap = new Map();
const getCustomPropValue = (value, prepared) => {
    let changed = true;
    while (changed && value.includes("--")) {
        changed = false; // Reset the changed flag for each iteration
        const t = value.split("--")[1].replaceAll(")", "");
        const newValue = prepared.get(`--${t}`);
        if (newValue !== undefined) {
            value = newValue;
            changed = true;
        }
    }
    return value;
};
const getColorValueFromTransformFn = (value) => {
    const transformFnRegex = /color-to-filter\((.*?)\)/;
    const match = value.match(transformFnRegex);
    if (match && match[1]) {
        return match[1];
    }
    return value;
};
function getCustomPropertiesFromRoot(root) {
    root.walkDecls((decl) => {
        if (customPropertyPtrn.test(decl.prop)) {
            customPropsMap.set(decl.prop, decl.value);
        }
    });
    return customPropsMap;
}
const plugin = (opts = {}) => {
    // Work with options here
    const pluginName = opts.pluginName || PLUGIN_NAME;
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
            if (node.value.includes(TRANSFORM_FN_NAME)) {
                const nodeValue = getCustomPropValue(node.value, prepared);
                const colorValue = getColorValueFromTransformFn(nodeValue);
                // todo: add error value handler
                node.value = compute(colorValue, opts.acceptanceLossPercentage).filter;
            }
        },
    };
};
plugin.postcss = true;

export { plugin as default };
