const path = require("path");

module.exports = {
  // 入口
  entry: "./src/index.js",
  // 出口
  output: {
    // 虚拟打包路径,就是说文件夹不会真正生成,二十在8080端口虚拟生成
    publicPath: "xuni", // path.resolve(__dirname, "dist"),
    // 打包出来的文件名
    filename: "bundle.js",
  },
  devServer: {
    port: 8080,
    // 静态资源文件夹
    contentBase: "www",
    hot: true,
  },
};
