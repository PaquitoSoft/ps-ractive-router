// Karma configuration
// Generated on Sat Sep 05 2015 01:13:06 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['phantomjs-shim', 'jasmine', 'commonjs'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/ractive/ractive.js',
      'node_modules/ractive/package.json',
      'node_modules/object-assign/index.js',
      'node_modules/object-assign/package.json',
      'node_modules/page/**/*.js',
      'node_modules/page/**/*.json',
      'src/**/*.js',
      'spec/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    commonjsPreprocessor: {
      modulesRoot: 'node_modules'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'node_modules/ractive/ractive.js': ['commonjs'],
      'node_modules/ractive/package.json': ['commonjs'],
      'node_modules/object-assign/index.js': ['commonjs'],
      'node_modules/object-assign/package.json': ['commonjs'],
      'node_modules/page/**/*.js': ['commonjs'],
      'node_modules/page/**/*.json': ['commonjs'],
      'src/**/*.js': ['commonjs', 'coverage'],
      'spec/**/*.spec.js': ['commonjs']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],

    specReporter: {
      maxLogLines: 5
    },

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome'],
    // browsers: ['PhantomJS2'],
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
