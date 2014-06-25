/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    target: 'static',
    banner: '/**\n' +
              '* <%= pkg.name %> v<%= pkg.version %>\n' +
              '* by <%= pkg.author %>\n' +
              '*/\n',

    // Before generating any new files,
    // remove any previously-created files.
    clean: {
      static: ['<%= target %>']
    },

    jshint: {
      options: {
        jshintrc: './.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },

    bowerInstall: {
      target: {
        src: './casstatic/index.html',
        dependencies: true,
        devDependencies: false,
        exclude: ['es5-shim', 'json3'],
        fileTypes: {},
        ignorePath: '../static',
        overrides: {}
      }
    },

    uglify: {
      options: {
        expand: true,
        flatten: true,
        sourceMap: true,
        ext: '.min.js'
      }
    },

    less: {
      options: {
        compile: true
      },
      bootstrap: {
        files: {
          '<%= target %>/css/bootstrap.css' : './less/bootstrap/bootstrap.less'
        }
      },
      bs_min: {
        options: {
          compress: true
        },
        files: {
          '<%= target %>/css/bootstrap.min.css' : './less/bootstrap/bootstrap.less',
        }
      },
      style: {
        files: {
          '<%= target %>/css/style.css' : './less/style.less'
        }
      },
      style_min: {
        options: {
          compress: true
        },
        files: {
          '<%= target %>/css/style.min.css' : 'less/style.less'
        }
      }
    },

    copy: {
      static: {
        expand: true,
        cwd: './static',
        src: '**',
        dest: '<%= target %>'
      },
      application: {
        src: './lib/application/application.js',
        dest: '<%= target %>/js/application.js'
      }
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '/* Angular contollers for \n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> \n */\n',
      },
      controllers: {
        src: ['./lib/application/controllers/*.js'],
        dest: '<%= target %>/js/controllers.js'
      }
    },

    watch: {
      less: {
        files: ['./less/**/*.less'],
        tasks: ['less']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-install');

  grunt.registerTask('build', ['less', 'bowerInstall']);

  grunt.registerTask('default', ['test']);

  grunt.registerTask('dev', ['default', 'watch']);

  grunt.registerTask('test', ['jshint', 'build']);

  grunt.registerTask('make', ['test']);
};