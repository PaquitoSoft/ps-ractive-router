/* global module, require */
var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: './dist/ps-ractive-router.js',
		libraryTarget: 'umd',
		library: 'PSRR'
	},
	externals: {
		ractive: 'Ractive'
	}
};