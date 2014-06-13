// Karma configuration
// Generated on Thu Jun 05 2014 20:51:32 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['mocha'],
    // possible values: 'dots', 'progress'  https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    // start these browsers https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    autoWatch: true,
    // Continuous Integration mode
    singleRun: false,
    colors: true,

    files: [
      // setup
      { pattern: 'browser/vendor/angular/angular.js' },
      { pattern: 'browser/vendor/angular-mocks/angular-mocks.js' },
      { pattern: 'browser/vendor/chai/chai.js' },

      // application files, everything but spec
      { pattern: 'browser/views/*!(spec).js'},

      // test files
      { pattern: 'browser/**/*.spec.js' }
    ],

    // list of files to exclude
    exclude: [],
    preprocessors: {},
    port: 9876,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO
  });
};
