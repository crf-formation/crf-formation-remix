import loadable from "@loadable/component";
// https://github.com/mac-s-g/react-json-view/issues/296
export const ReactJson = loadable(() => new Promise((r, c) => import("react-json-view").then(result => r(result.default), c)));
