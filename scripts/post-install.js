/*
	In order to use karma-commonjs plugin so we can use node
	require style in karma, we need to fix some package.json
	files to have the 'main' property.
*/

var fs = require('fs'),
	path = require('path');

function updatePackageJson(path, mainFile) {
	var packageInfoData = require(path);
	console.log('PostInstall# package.json file read:', packageInfoData.name);

	packageInfoData.main = mainFile;
	console.log('PostInstall# package.json file updated');

	console.log('PostInstall# writing updated package.json:', path);
	fs.writeFileSync(path, JSON.stringify(packageInfoData, null, 4));
	console.log('PostInstall# package.json updated!!!');
}

var pathToRegexpPackageInfo = path.join(__dirname, '..', 'node_modules', 'page',
	'node_modules', 'path-to-regexp', 'package.json'),
	pathToObjectAssignInfo = path.join(__dirname, '..', 'node_modules', 'object-assign', 'package.json'),
	pathToPageJsInfo = path.join(__dirname, '..', 'node_modules', 'page', 'package.json');

updatePackageJson(pathToPageJsInfo, 'index.js');
updatePackageJson(pathToRegexpPackageInfo, 'index.js');
updatePackageJson(pathToObjectAssignInfo, 'index.js');
