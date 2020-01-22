const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const distFolder = path.resolve(__dirname, "public");

module.exports = {
  entry: ["./src/app.ts", "./src/index.slim"],
  mode: "production",
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: path.resolve(__dirname, "node_modules")
      },
      {
        test: /\.(slm|slim)/,
        use: [
          {
            loader: "file-loader",
            query: {
              name: "[name].html"
            }
          },
          { loader: "slm-loader" }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: distFolder,
    filename: "app.js"
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "assets",
        to: distFolder
      }
    ])
  ]
};
