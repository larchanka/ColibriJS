
var fs = require('fs');

module.exports = (function (grunt) {

    grunt.registerTask('build', "SmallFramework build", function () {
        

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            concat: {
                options: {
                    separator: '\n',
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                dist: {
                    src: ['js/smallframework.js'],
                    dest: 'js/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.js'
                }
            },
            recess: {
                dist : {
                    options: {
                        compile: true,
                        compress: true,
                        zeroUnits: true
                    },
                    files: {
                      'css/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.min.css' : ['css/smallframework.css']
                    }
                }
            },
            uglify: {
                dist: {
                    files: {
                        'js/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
                    }
                }
            }
        });
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-recess');
        grunt.task.run(['concat', 'uglify', 'recess']);
    });

    grunt.registerTask('default', ['build']);

});