const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const htmlPlugin = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
});

module.exports = function (_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    entry: "./src/index.tsx",
    mode: "development",
    output: {
      path: path.resolve(__dirname, "../server/dist"),
      filename: "bundle.js",
    },
    devtool: "source-map",
    resolve: {
      extensions: [".go", ".jsx", ".js", ".json", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "GoWasm!",
        template: "./src/index.html",
        filename: "./index.html",
        inject: true,
        minify: {
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          minifyCSS: true,
          minifyURLs: true,
          minifyJS: true,
          removeComments: true,
          removeRedundantAttributes: true,
        },
      }),
      new AddAssetHtmlPlugin([
        { publicPath: "", filepath: require.resolve("./src/wasm_exec.js") },
        { publicPath: "", filepath: require.resolve("./src/init_go.js") },
      ]),
    ],
  };
};
