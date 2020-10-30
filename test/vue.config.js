module.exports = {
    publicPath: "./", //部署应用包时的基本 URL
    productionSourceMap: false, //如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    outputDir: "dist", //出口：当运行 vue-cli-service build 时生成的生产环境构建文件的目录
    css: {
      loaderOptions: { //向css相关的loader传递选项
        less: {
          javascriptEnabled: true
        }
      }
    },
    configureWebpack: { //如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
      externals: {
        AMap: "AMap"
      }
    },
    devServer: {
      // 设置默认端口
      port: 8088,
      // 设置代理
      proxy: {
        "/api": {
          // 目标 API 地址
          target: "http://192.168.1.103:8009",
          changeOrigin: true
        },
        "/open": {
          // 目标 API 地址
          target: "http://192.168.1.103:8009",
          changeOrigin: true
        },
        "/oauth": {
          // 目标 API 地址
          target: "http://192.168.1.103:8009",
          changeOrigin: true
        }
      }
    }
  };
  