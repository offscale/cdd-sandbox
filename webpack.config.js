const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const distFolder = path.resolve(__dirname, "public");
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    app: "./src/app.ts", slim: "./src/index.slim",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "json.worker": "monaco-editor/esm/vs/language/json/json.worker",
    "css.worker": "monaco-editor/esm/vs/language/css/css.worker",
    "html.worker": "monaco-editor/esm/vs/language/html/html.worker",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker"
  },
  resolve: {
    extensions: [".ts", ".js", ".css"]
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: distFolder
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
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
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
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
