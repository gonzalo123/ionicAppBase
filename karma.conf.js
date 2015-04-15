module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        files: [
            'www/assets/ionic/release/js/ionic.bundle.js',
            'www/assets/angular-locker/dist/angular-locker.js',
            'www/assets/angular-mocks/angular-mocks.js',
            'src/main.js',
            'test/*.js'
        ],

        reporters: ['progress'],

        autoWatch: true,

        browsers: ['PhantomJS']
    });
};