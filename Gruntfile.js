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
			js: {
				// the files to concatenate
				src: [
					//include libs
					'assets/js/sangarSlider.js',
					'assets/js/sangarSlider/*.js'
				],
					// the location of the resulting JS file
					dest: 'dist/js/<%= pkg.name %>.js'
			}
		},
		copy: {
			css: {
				files: [{
				    expand: true,
				    cwd: 'assets/css/',
				    src: ['sangarSlider.css','responsive.css','loading.gif'],
				    dest: 'dist/css/'
			  	}]
			},
			themes: {
				files: [{
				    expand: true,
				    cwd: 'assets/themes/',
				    src: ['**'],
				    dest: 'dist/themes/'
			  	}]
			}					  	
		},
		uglify: {
			options: {
				banner: "// Sangar Slider - 2014 Tonjoo \n"
			},
			build: {
				src: "dist/js/<%= pkg.name %>.js",
				dest: "dist/js/<%= pkg.name %>.min.js"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// When developing the plugin, use the concat version. So all code are readable
  	grunt.registerTask('dev-watch', ['concat']);

  	// Distribution version
  	grunt.registerTask('build', ['concat', 'copy', 'uglify']);
};