import { Declaration, Root } from "postcss";
type ModuleOpt = {
    pluginName?: string;
    /** The acceptanceLossPercentage parameter in the ModuleOpt type represents the acceptable loss
     * percentage for the color-to-filter transformation. This value is used to determine
     * the tolerance range for the transformation */
    acceptanceLossPercentage?: number;
};
declare const plugin: {
    (opts?: ModuleOpt): {
        postcssPlugin: string;
        prepare(): {
            Once(root: Root): void;
        };
        Declaration(node: Declaration): void;
    };
    postcss: boolean;
};
export default plugin;
