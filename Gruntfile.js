module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: "\n\n/* Sangar Slider Class */\n", //add a new line after each file
				banner: "",
				footer: "" 
			},
			dist: {
				// the files to concatenate
				src: [
					//include libs
					'assets/js/jquery.sangarSlider.js',
					'assets/js/sangarSlider/*.js'
				],
				// the location of the resulting JS file
					dest: 'dist/<%= pkg.name %>.js'
			}
		},
		removelogging: {
			dist: {
				src: "dist/<%= pkg.name %>.js",
				dest: "dist/<%= pkg.name %>.no-logging.js"
			}
		},
		uglify: {
			options: {
				banner: "// Sangar Slider - 2014 Tonjoo \n"
			},
			build: {
				src: "dist/<%= pkg.name %>.js",
				dest: "dist/<%= pkg.name %>.min.js"
			}
		},
		watch: {
			scripts: {
				files: [
						//include libs
						'assets/js/sangarSlider/*.js',
						'assets/js/jquery.sangarSlider.js'
				],
				tasks: ['dev-watch'],
				options: {
					interrupt: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-contrib-uglify');
  	grunt.loadNpmTasks('grunt-contrib-watch');

	// When developing the plugin, use the concat version. So all code are readable
  	grunt.registerTask('dev-watch', ['concat']);

  	// Distribution version
  	grunt.registerTask('build', ['concat', 'uglify']);
};