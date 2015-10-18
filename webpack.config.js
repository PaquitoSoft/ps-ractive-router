/* global module, require */
var webpack = require('webpack');

var isBundleForProduction = typeof process.env.BUNDLE_TARGET !== 'undefined';

var plugins = [],
	outputFileName = './dist/ps-ractive-router';

if (isBundleForProduction) {
	plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
	outputFileName += '.min.js';
} else {
	outputFileName += '.js';
}

module.exports = {
	entry: './src/index.js',
	output: {
		filename: outputFileName,
		libraryTarget: 'umd',
		library: 'PSRR'
	},
	externals: {
		ractive: 'Ractive'
	},
	plugins: plugins
};
