module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// this compiles your sass into css files
		// to run this alone use "grunt sass" within terminal
		sass: {
			dist: {
				files: {
					'src/assets/css/styles.css' : 'src/assets/scss/main.scss'
				}
			}
		},
		// this takes your css file and minifies it to save weight
		// to run this alone use "grunt cssmin" within terminal
		cssmin: {
			target: {
				files: {
					'production/assets/css/styles.min.css': ['src/assets/css/styles.css']
				}
			}
		},
		// this takes your main js file and minifies it to save weight
		// to run this alone use "grunt uglify" within terminal
		uglify: {
			my_target: {
				files: {
					'production/assets/js/main.min.js': ['src/assets/js/vendor/modernizr-2.6.2.min.js', 'src/assets/js/vendor/bootstrap.min.js', 'src/assets/js/main.js']
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
					cwd: 'src/assets/imgs/',                   
					src: ['**/*.{png,jpg,gif}'],   
					dest: 'production/assets/imgs/'
				}]
			}
		},
		// this compiles your .php and "_includes" .php files into singular .html files
		// to run this alone use "grunt php2html" within terminal
	    php2html: {
			default: {
				options: {
					processLinks: true,
					htmlhint: false
				},
				files: [{
					expand: true, 
					cwd: 'src/', 
					src: ['**/*.php'], 
					dest: 'production/', 
					ext: '.html' 
				}]
			}
		},
		// this removes the _includes folder when you run either "grunt dev" or
		// "grunt release" since they are not needed in the "build" or "release" folders
		// to run this alone use "grunt clean" within terminal
		//clean: ['build/production/','build/production/','build/_includes/'],
		clean: {
		  production: ['production/'],
		  includes: ['production/_includes/']
		},
		// This is to copy any files needed in your dev build or release build.
		// To run this alone use "grunt copy" within terminal. To target specific files
		// run "grunt copy:FILESTOCOPY". Change "FILESTOCOPY" to any of the tasks listed below
		// (i.e. copy:css, copy:js, etc.)
		copy: {
			fonts: {
				expand: true,
				cwd: 'src/assets/fonts',
				src: ['*.{svg,eot,ttf,woff,woff2,otf}'],
				dest: 'production/assets/fonts'
			},
			favicons: {
				expand: true,
				cwd: 'src/',
				src: ['*.{png,ico}'],
				dest: 'production'
			}
		},
		replace: {
			updatePaths: {
				src: ['production/**/*.html'],
				overwrite: true,
				replacements: [{
					from: /styles.css/g,
					to: 'styles.min.css'
				},
				{
					from: /main.js/g,
					to: 'main.min.js'
				},
				{
					from: /<script src="..\/assets\/js\/vendor/g,
					to: '<script src="assets/js/vendor'
				},
				{
					from: /<script src="..\/..\/assets\/js\/vendor/g,
					to: '<script src="assets/js/vendor'
				}]
			},
			removeVendorPaths: {
				src: ['production/**/*.html'],
				overwrite: true,
				replacements: [{
					from: /<script src="assets\/js\/vendor\/modernizr-2.6.2.min.js"><\/script>/g,
					to: ''
				},
				{
					from: /<script src="assets\/js\/vendor\/bootstrap.min.js"><\/script>/g,
					to: ''
				}]
			}
		},
		// this minifies the html once paths and file extensions are updated 
		minifyHtml: {
	        dist: {
	            files: [{
					expand: true,   
					cwd: 'production/',
					src: ['**/*.html'],
					dest: 'production/'	
				}]
	        }
	    },
	    php: {
	        dist: {
	            options: {
	                hostname: '127.0.0.1',
	                port: 9000,
	                base: 'src', // Project root 
	                keepalive: false,
	                open: false
	            }
	        }
	    },
		browserSync: {
			dist: {
				bsFiles: {
					src: [
						'./src/assets/css/styles.css'
					]
				},
				options: {
					proxy: '<%= php.dist.options.hostname %>:<%= php.dist.options.port %>',
	                watchTask: true,
	                open: true
				}
			}
		},
		// this is for use when you are developing your website so you do not have to run
		// individual commands every time you make an edit. Before making edits you have to
		// run either "grunt" or "grunt watch". "grunt" builds all files before watch is used, 
		// "grunt watch" does not.
		watch: {
			css: {
				files: 'src/assets/scss/**/*.scss',
				tasks: ['sass']
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
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-minify-html');
	grunt.loadNpmTasks('grunt-php');
	grunt.loadNpmTasks('grunt-browser-sync');
	
	// Within "registerTask"s you are able to build tasks that contain multiple tasks from above
	// "registerTask('default')" can be run by just running "grunt" within terminal
	// If you want to run any of the others run "grunt TASKNAME", replace "TASKNAME" with any 
	// of the names below within terminal
	grunt.registerTask('default', ['watch']);
	// when working in dev run 'grunt watch' to watch sass as you edit
	grunt.registerTask('serve', ['php', 'browserSync', 'watch']);
	grunt.registerTask('releasecopy', ['copy:fonts', 'copy:favicons']);
	grunt.registerTask('build', ['clean:production', 'sass', 'php2html', 'cssmin', 'uglify', 'releasecopy', 'replace', 'clean:includes']);
	grunt.registerTask('release', ['clean:production', 'sass', 'php2html', 'cssmin', 'imagemin', 'uglify', 'releasecopy', 'replacePaths', 'minifyHtml', 'clean:includes']);
	
}