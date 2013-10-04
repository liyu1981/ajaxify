module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    preprocess: {
      options: {
      },
      all: {
        files: {
          './dist/<%= pkg.name %>.js': './src/<%= pkg.name %>.in.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'min'
      },
      js: {
        src: ['./dist/<%= pkg.name %>.js'],
        dest: './dist/<%= pkg.name %>.min.js'
      }
    },
    clean: {
      all: [ './dist/<%= pkg.name %>.js', './dist/<%= pkg.name %>.min.js' ]
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-preprocess');

  // Default task(s).
  grunt.registerTask('default', ['preprocess', 'uglify']);
  grunt.registerTask('cleandist', ['clean']);
};
