/* global module, require */
var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: './dist/js/psrr-bundle.js',
		libraryTarget: 'umd',
		library: 'PSRR'
	},
	externals: {
		ractive: 'Ractive'
	}
	/*,
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel'
			},
			{
				test: /\.html$/,
				loader: 'raw'
			}
		]
	},
	// This is to load polyfills (http://mts.io/2015/04/08/webpack-shims-polyfills/)
	plugins: [
		new webpack.ProvidePlugin({
			fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
			'es6-promise': 'es6-promise'
		})
	]*/
};