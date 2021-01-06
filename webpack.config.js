const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const POPUP_HTML = "popup.html";
const LOGO_OUTPUT_PATH = "assets/logo.png";
const ICON_SET = {
  16: LOGO_OUTPUT_PATH,
  32: LOGO_OUTPUT_PATH,
  48: LOGO_OUTPUT_PATH,
  128: LOGO_OUTPUT_PATH,
};
const options = {
  entry: {
    jQuery: "jquery",
    popup: path.join(__dirname, "src", "popup", "popup.js"),
  },
  output: {
    //  path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
    new HtmlWebpackPlugin({
      filename: POPUP_HTML,
      template: "./src/popup/popup.html",
      inject: true,
      chunks: ["jQuery", "popup"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/assets/",
          to: "assets",
        },
      ],
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: "manifest.json",
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                ...JSON.parse(content.toString()),
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                browser_action: {
                  default_popup: POPUP_HTML,
                  default_icon: ICON_SET,
                },
                icons: ICON_SET,
              })
            );
          },
        },
      ],
    }),
    new WriteFilePlugin(),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    options.devtool = "source-map";
  }
  return options;
};
