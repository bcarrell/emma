module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'lib/**/*.js'
      ]
    },

    browserify: {
      main: {
        files: {
          'dist/emma.js': ['lib/index.js']
        },
        options: {
          standalone: 'emma'
        }
      }
    },

    nodeunit: {
      all: ['test/test.js']
    },

    watch: {
      all: {
        files: [
          'lib/index.js',
          'test/test.js'
        ],
        tasks: [
          'browserify:main',
          'test'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('test', ['jshint:all', 'nodeunit:all']);
  grunt.registerTask('default', ['browserify:main', 'test', 'watch']);
};
