module.exports = function (config) {
  config.set({


    basePath: '',

    files: [
      'test/e2e/**/*.js'
    ],

    preprocessors: {
      'app/js/*.js': 'coverage'
    },

    autoWatch: true,

    browsers: ['Chrome'],

    frameworks: ['ng-scenario'],

    singleRun: false,

    proxies: {
      '/app/': 'http://libraryapp.cegeka.com:8000/'
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-ng-scenario',
      'karma-coverage'
    ],

    reporters: ['coverage','progress'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      file: 'coverage.info'
    }

  })
}

