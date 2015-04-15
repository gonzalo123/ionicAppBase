module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var jshintrc = grunt.file.readJSON('.jshintrc');

    grunt.initConfig({
        cmpnt: grunt.file.readJSON('bower.json'),

        banner: '/*! ionic App base v<%= cmpnt.version %> by Gonzalo Ayuso(gonzalo123@gmail.com) - ' +
        'http://github.com/gonzalo123/ionicAppBase - MIT License */\n',

        jshint: {
            files: ['Gruntfile.js', 'karma.conf.js', 'src/**.js', 'test/**.js'],
            options: {
                globals: jshintrc
            }
        },

        clean: ["dest/"],

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['PhantomJS'],
                logLevel: 'ERROR'
            }
        },

        copy: {
            js: {
                src: 'src/main.js',
                dest: 'dist/main.js',
                options: {
                    banner: '<%= banner %>'
                }
            }
        }
    });
    grunt.registerTask('build', ['clean', 'jshint', 'karma', 'copy']);
};