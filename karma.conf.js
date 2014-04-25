module.exports = function (config) {
  config.set({
    basePath: '',

    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-ui-bootstrap-bower/ui-bootstrap.min.js',
      'app/bower_components/angular-ui-utils/modules/utils.js',
      'app/bower_components/jquery/jquery.min.js',
      'app/bower_components/lodash/dist/lodash.min.js',
      'app/js/**/*.js',
      'test/unit/**/*.js',

      //include directives templates
      'app/directive/**/*.html'
    ],

    preprocessors: {
      'app/directive/**/*.html': ['ng-html2js'],
      'app/js/*.js': 'coverage'
    },

    autoWatch: true,

    port: 9999,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ],

    reporters: ['coverage','progress'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    }
  })
}
