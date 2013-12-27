
var fs = require('fs');

module.exports = (function (grunt) {

    grunt.registerTask('build', "CalibriJS build", function () {
        

        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            recess: {
                dist : {
                    options: {
                        compile: true,
                        compress: true,
                        zeroUnits: true
                    },
                    files: {
                      'css/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.min.css' : ['css/<%= pkg.name.toLowerCase() %>.css']
                    }
                }
            },
            uglify: {
                dist: {
                    files: {
                        'js/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.min.js': ['js/<%= pkg.name.toLowerCase() %>-<%= pkg.version %>.js']
                    }
                }
            }
        });
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-recess');
        grunt.task.run(['uglify', 'recess']);
    });

    grunt.registerTask('default', ['build']);

});