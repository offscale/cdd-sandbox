const path = require("path");
// const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
    path: path.resolve(__dirname, "public")
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.html?$/,
        loader: 'html-loader'
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
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loaders: [
            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "assets",
        to: path.resolve(__dirname, "public")
      }
    ]),
    // new HtmlWebPackPlugin({
    //   title: "CDD Sandbox",
    //   template: './public/index.html'
    // })
  ]
};
