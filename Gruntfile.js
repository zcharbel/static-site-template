module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// this compiles your sass into css files
		// to run this alone use "grunt sass" within terminal
		sass: {
			dist: {
				files: {
					'src/assets/css/styles.css' : 'src/assets/scss/main.scss',
				}
			}
		},
		// this takes your css file and minifies it to save weight
		// to run this alone use "grunt cssmin" within terminal
		cssmin: {
			target: {
				files: {
					'src/assets/css/styles.min.css': ['**/assets/css/styles.css']
				}
			}
		},
		// this takes your main js file and minifies it to save weight
		// to run this alone use "grunt uglify" within terminal
		uglify: {
			my_target: {
				files: {
					'src/assets/js/main.min.js': ['**/assets/js/main.js']
				}
			}
		},
		// this optimizes your images for when you are ready to release your website
		// to run this alone use "grunt imagemin" within terminal
	    imagemin: {                          
			dynamic: {
				options: {
					optimizationLevel: 7
				},                    
				files: [{
					expand: true,                  
					cwd: 'src/assets/img/',                   
					src: ['**/*.{png,jpg,gif}'],   
					dest: 'src/assets/_optimized-imgs/'
				}]
			}
		},
		// this compiles your .php and "_includes" .php files into singular .html files
		// to run this alone use "grunt php2html" within terminal
	    php2html: {
			default: {
				options: {
					// relative links should be renamed from .php to .html
					processLinks: true,
					htmlhint: false
				},
				files: [
					{expand: true, cwd: 'src/', src: ['**/*.php'], dest: 'build', ext: '.html' }
				]
			}
		},
		// this removes the _includes folder when you run either "grunt dev" or
		// "grunt release" since they are not needed in the "build" or "release" folders
		// to run this alone use "grunt clean" within terminal
		//clean: ['build/production/','build/production/','build/_includes/'],
		clean: {
		  general: ['build/','production/'],
		  includes: ['build/_includes/']
		},
		// this is for use when you are developing your website so you do not have to run
		// individual commands every time you make an edit. Before making edits you have to
		// run either "grunt" or "grunt watch". "grunt" builds all files before watch is used, 
		// "grunt watch" does not.
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass', 'copy:css']
			},
			scripts: {
				files: ['src/assets/js/main.js'],
				tasks: ['copy:js']
			},
			files: {
				files: ['src/*'],
				tasks: ['php2html']
			},
			img: {
				files: ['src/assets/img/*'],
				tasks: ['copy:img']
			}
		},
		// This is to copy any files needed in your dev build or release build.
		// To run this alone use "grunt copy" within terminal. To target specific files
		// run "grunt copy:FILESTOCOPY". Change "FILESTOCOPY" to any of the tasks listed below
		// (i.e. copy:css, copy:js, etc.)
		copy: {
		  css: {
		    expand: true,
		    cwd: 'src/assets/',
		    src: 'css/styles.css',
		    dest: 'build/assets/'
		  },
		  cssminified: {
		    expand: true,
		    cwd: 'src/assets/',
		    src: 'css/styles.min.css',
		    dest: 'production/assets/'
		  },
		  js: {
		    expand: true,
		    cwd: 'src/assets/',
		    src: ['js/main.js', 'js/vendor/*'],
		    dest: 'build/assets/'
		  },
		  jsminified: {
		    expand: true,
		    cwd: 'src/assets/',
		    src: ['js/main.min.js', 'js/vendor/*'],
		    dest: 'production/assets/'
		  },
		  img: {
		    expand: true,
		    cwd: 'src/assets/img/',
		    src: ['**/*.{png,jpg,gif}'],
		    dest: 'build/assets/img/'
		  },
		  imgoptimized: {
		    expand: true,
		    cwd: 'src/assets/_optimized-imgs',
		    src: ['**/*.{png,jpg,gif}'],
		    dest: 'production/assets/img/'
		  },
		  fonts: {
		    expand: true,
		    cwd: 'src/assets/fonts',
		    src: ['*.{svg,eot,ttf,woff,woff2,otf}'],
		    dest: 'build/assets/fonts'
		  },
		  fontsprod: {
		    expand: true,
		    cwd: 'src/assets/fonts',
		    src: ['*.{svg,eot,ttf,woff,woff2,otf}'],
		    dest: 'production/assets/fonts'
		  },
		  favicons: {
		    expand: true,
		    cwd: 'src/',
		    src: ['*.{png,ico}'],
		    dest: 'build'
		  },
		  faviconsprod: {
		    expand: true,
		    cwd: 'src/',
		    src: ['*.{png,ico}'],
		    dest: 'production'
		  },
		  prodhtml: {
		    expand: true,
		    cwd: 'build/',
		    src: ['**/*.html'],
		    dest: 'production',
		    options: {
		      process: function (content, srcpath) {
		        return content.replace(/styles.css/g, 'styles.min.css').replace(/main.js/g, 'main.min.js');
		      },
		    }
		  }
		}
	});
	// loadNpmTasks bring in required grunt modules for use within this file
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-rename');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-php2html');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	// Within "registerTask"s you are able to build tasks that contain multiple tasks from above
	// "registerTask('default')" can be run by just running "grunt" within terminal
	// If you want to run any of the others run "grunt TASKNAME", replace "TASKNAME" with any 
	// of the names below within terminal
	grunt.registerTask('default', ['dev', 'watch']);
	grunt.registerTask('devcopy', ['copy:css', 'copy:js', 'copy:img', 'copy:fonts', 'copy:favicons']);
	grunt.registerTask('dev', ['clean:general', 'sass', 'php2html', 'devcopy', 'clean:includes']);
	grunt.registerTask('releasecopy', ['copy:cssminified', 'copy:jsminified', 'copy:imgoptimized', 'copy:fontsprod', 'copy:faviconsprod', 'copy:prodhtml']);
	grunt.registerTask('release', ['dev', 'cssmin', 'imagemin', 'uglify', 'sass', 'releasecopy']);
	
}