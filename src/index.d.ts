import { PluginCreator, Root } from 'postcss';

type PrepareCallback = (root: Root) => void;

type CustomPropertyMap = Map<string, string>;

type ComputeFunction = (hexColor: string) => { filterRaw: string }; // Assuming the compute function signature

interface PluginOptions {
  pluginName?: string;
}

interface PostCSSColorToFiltersPlugin {
  postcssPlugin: string;
  prepare: () => { Once: PrepareCallback };
  Declaration: (node: any) => void; // Adjust 'any' with the appropriate node type from PostCSS
}

type PostCSSColorToFiltersPluginCreator = (options?: PluginOptions) => PostCSSColorToFiltersPlugin;

declare const postCSSColorToFilters: PostCSSColorToFiltersPluginCreator;

export = postCSSColorToFilters;
