const webpack=require('webpack');
const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');//自动生成html插件
const ExtractTextWebpackPlugin=require('extract-text-webpack-plugin');//css分离插件
const OpenBrowserPlugin = require('open-browser-webpack-plugin');//自动打开浏览器插件
// const BabiliWebpackPlugin=require('babili-webpack-plugin');//压缩代码插件
const Less = require('less');


module.exports={
	devServer: {
        contentBase: './',  //本地服务器所加载的页面所在的目录
        host: 'localhost',
        port: 8083,
        historyApiFallback: true,  //不跳转
        hot: true,//热加载
        inline: true,//
        proxy: {//请求接口配置
            '/api': {
                target: '',
                secure: false,
                changeOrigin: true,
                host: ''
            }
        },
        overlay:{//eslint配置下把错误信息抛出到浏览器
        	errors:true,
        	warnings:true
        }
    },
	context:path.join(__dirname,"src"),
	entry:{
		"index":"./index.js",
		vendor:["less","babel-preset-es2015","react","react-dom"]
	},
	output:{
		path:path.join(__dirname,"dist"),
		// publicPath:'/dist/',
		filename:"./[name].js"
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/(node_modules)/,
				use:{
					loader:'babel-loader',
					query:{
						presets: ['react']
					}
				}
			},
			{
				test:/\.jsx$/,
				loader:'jsx-loader'
			},
			{
				test:/\.css$/,
				exclude:/(node_modules)/,
				use:ExtractTextWebpackPlugin.extract({
					fallback:"style-loader",
					use:{
						loader:"css-loader"
					}
				})
			},
			{
				test:/\.less$/,
				use:ExtractTextWebpackPlugin.extract(
					['css-loader','less-loader']
				)
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options:{
					limit:8192,
					name:'images/[name].[hash:2].[ext]',
					outputPath:'../'
				}
			}
		]
	},
	// performance:{
	// 	// hints:'warning',
	// 	maxEntrypointSize:10000,
	// 	maxAssetSize:45000
	// },
	plugins:[
		// new HtmlWebpackPlugin(),
		// new HtmlWebpackPlugin({
        //     title: '测试',//生成HTML文件的title，设置template没用
        //     filename: './index.html',//打包后html文件名
        //     template: './src/template/index.html',//生成的模板文件
        //     inject: 'head',
        //     favicon: '',// html 文件生成一个 favicon
        //     hash: true,//给生成的js文件hash 值
        //     minify: {    //压缩HTML文件
        //         removeComments: true,    //移除HTML中的注释
        //         collapseWhitespace: true,    //删除空白符与换行符
        //         conservativeCollapse: true,
        //         minifyJS: true //js也在一行
        //     }
        // }),
		new webpack.optimize.CommonsChunkPlugin({
			name:'vendor',
			filename:"vendor/[name].dll.js",
			chunks:['vendor']
		}),
		new ExtractTextWebpackPlugin({
			filename:'css/[name].css'
		}),
		new OpenBrowserPlugin({//自动打开浏览器
            url: 'http://localhost:8083'
        }),
        new webpack.HotModuleReplacementPlugin(),//热加载插件
		new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [
                        require('autoprefixer')
                    ];
                }
            }
        }),
		// new BabiliWebpackPlugin()
	]
}