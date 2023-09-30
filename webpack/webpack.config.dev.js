const Path = require("path");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  target: "web",
  mode: "development",
  devtool: "eval-cheap-source-map",
  output: {
    chunkFilename: "js/[name].chunk.js",
  },
  devServer: {
    client: {
      logging: "error",
    },
    hot: true,
  },
  plugins: [new Webpack.DefinePlugin({})],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, "../src"),
        loader: "babel-loader",
      },
      {
        test: /\.s?css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
});