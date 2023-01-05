const path = require("path")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CheckRepeatHttpUrl = require("check-repeat-http-url");

const webpack = require('webpack')

/**
 * loader:
 * 
 * style-loader 就是将处理好的 css 通过 style 标签的形式添加到页面上
 * css-loader 让webpack识别css
 * postcss-loader 给css加前缀，适应不同浏览器
 * cache-loader 适用于与所有loader组合使用，在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里, 保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader
 * thread-loade 多进程打包
 */

/**
 * plugin:
 * 
 * MiniCssExtractPlugin: 将css打包为单个文件
 * HtmlWebpackPlugin: 把打包完的文件，插入到html，需要传递一个template，如果不传递，默认HtmlWebpackPlugin会创建一个新的html文件
 * CssMinimizerPlugin: 压缩css
 * TerserPlugin: webpack5 默认支持的js压缩插件
 * 
 */
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: 'images/[hash][ext][query]', // 资源模块打包
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // 尝试按顺序解析这些后缀名
    alias: {
      "@": path.resolve(__dirname, 'src'),
    },
    modules: [path.resolve('src'), 'node_modules'], // 告诉 webpack 解析模块时应该搜索的目录, 告诉 webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间
  },
  externals: { // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)
    jquery: 'jQuery',
  },
  optimization: {
    splitChunks: {
      chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
      minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
      minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
      minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 最大的按需(异步)加载次数
      maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
      enforceSizeThreshold: 50000,
      cacheGroups: { // 配置提取模块的方案
        defaultVendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    noParse: /jquery|lodash/, // 不需要解析的第三方库
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, "css-loader", {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')]
              }
            }
          }
        ]
      }, {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }, {
        // ts兼容处理
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /bower_components/],
      }, {
        test: /\.js$/i,
        include: path.resolve('src'),
        exclude: /node_modules/, // 除了node_modules以外的文件，开启多进程打包
        use: [
          {
            loader: 'thread-loader', // 开启多进程打包
            options: {
              worker: 3,
              cacheDirectory: true // 启用缓存
            }
          },
          'babel-loader',
        ]
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({})
    ],
  },
  plugins:[ // 配置插件
    new CleanWebpackPlugin(), // 每次打包完都清理上一次打包的文件
    new HtmlWebpackPlugin({
      title: "webpack-study",
      template: "index.html" // 需要指定html模版，否则HtmlWebpackPlugin插件会自动创建一个空的html文件
    }),
    new MiniCssExtractPlugin(), // css划分为单个文件
    new webpack.IgnorePlugin({ // 目的是将插件中的非中文语音排除掉，这样就可以大大节省打包的体积了
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new CheckRepeatHttpUrl({
      folderPath: path.resolve(__dirname, 'src'), // 文件夹位置
      extensions: ".js", // 解析的文件类型
    })
  ]
}