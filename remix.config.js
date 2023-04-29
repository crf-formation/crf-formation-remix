/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}", "**/fence.json"],
  devServerPort: 8002,
  future: {
    // enable the new dev server with all defaults
    unstable_dev: false,
    // formMethod is now uppercase
    // https://remix.run/docs/en/1.15.0/pages/v2#formmethod
    v2_normalizeFormMethod: false,
    // metha functions is changing
    // https://remix.run/docs/en/1.15.0/pages/v2#route-meta
    v2_meta: false,
    // route convention is changing
    // https://remix.run/docs/en/1.15.0/pages/v2#file-system-route-convention
    v2_routeConvention: true,
    //
    // https://remix.run/docs/en/1.15.0/pages/v2#catchboundary-and-errorboundary
    v2_errorBoundary: true,
  },
  // fix the "Error [ERR_REQUIRE_ESM]: require() of ES Module" errror
  // https://remix.run/docs/en/v1/pages/gotchas#importing-esm-packages
  serverDependenciesToBundle: [
     // begin: markdown libraries
    // https://andre-landgraf.dev/blog/2022-05-29_how-to-integrate-markdown-content-with-syntax-highlighting-in-remix/
    // there is a lot of dependencies just for markdown, welcome to javascript ecosystem.
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    /^unist.*/,
    /^hast.*/,
    /^bail.*/,
    /^trough.*/,
    /^mdast.*/,
    /^micromark.*/,
    /^decode.*/,
    /^character.*/,
    /^property.*/,
    /^space.*/,
    /^comma.*/,
    /^react-markdown$/,
    /^vfile.*/,
    /^ccount.*/,
    /^zwitch.*/,
    /^html-void-elements.*/,
    /^markdown-table.*/,
    /^trim-lines.*/,
    /^web-namespaces.*/,
    // end: markdown libraries
  ]
};
