module.exports={
    lintOnSave:false,
    publicPath:"./",  //打包的时候一定要打开这个
    //代理跨域
    devServer:{
        host:"localhost",  //配置本地服务器
        port:8088,          //本地端口号
        proxy:{  // 重写的方式，把请求代理到express服务器上
            '/':{                                        //向本地发起的请求，且url路径以/api开头的向target服务器请求
                target:'http://127.0.0.1:3000',  //目标服务器
                changeOrigin:true,                          //开启跨域
                // pathRewrite:{'/':''} // 把/api 替换为空  不需要重写路径
            },
            // '/jiandaoyun':{
            //     target:'https://api.jiandaoyun.com',  //目标服务器
            //     changeOrigin:true,                          //开启跨域
            //     pathRewrite:{'/jiandaoyun':''}
            // }
        }
    },

    
    // 配置加载PDF
    // configureWebpack: {
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.(png|jpe?g|gif|pdf)$/i,
    //                 loader: 'file-loader',
    //                 options: {
    //                     name: '[path][name].[ext]',
    //                 },
    //             },
    //         ],
    //     }
    // }

}
