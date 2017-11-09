module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// this compiles your sass into css files
		sass: {
			dist: {
				files: {
					'src/assets/css/styles.css' : 'src/assets/scss/main.scss'
				}
			}
		},
		// this takes your css file and minifies it to save weight
		cssmin: {
			target: {
				files: {
					'production/assets/css/styles.min.css': ['src/assets/css/styles.css']
				}
			}
		},
		// this takes your main js file and minifies it to save weight
		uglify: {
			my_target: {
				files: {
					'production/assets/js/main.min.js': ['src/assets/js/vendor/modernizr-2.6.2.min.js', 'src/assets/js/vendor/bootstrap.min.js', 'src/assets/js/main.js']
				}
			}
		},
		// this optimizes your images for when you are ready to release your website
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
		clean: {
			// this removes the 'production' folder that is output during grunt tasks below
			production: ['production/'],
			// this removes the "_includes" folder from being included in your 'production' folder
			includes: ['production/_includes/']
		},
		// this copies over all fonts and favicons into your 'production' folder
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
		// when making a release, this updates/removes .css and .js filepaths
		replace: {
			// updates files paths
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
			// removes global filepaths that have been minifed into the main.min.js file
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
	    // this is a local server
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
	    // syncs the above server when there is a change made to styles.css
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
		// this watches for any changes within SASS
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
	
	// These are registered task you can run within terminal
	// if you're running something like MAMP while doing edits 'default' is all you need
	grunt.registerTask('default', ['watch']);
	// to run a local php server with browserSync, run 'serve'
	grunt.registerTask('serve', ['php', 'browserSync', 'watch']);
	// this is used with the 'build' and 'release' tasks
	grunt.registerTask('copyFontsFavs', ['copy:fonts', 'copy:favicons']);
	// this is for debugging the output of php2html 
	grunt.registerTask('build', ['clean:production', 'sass', 'php2html', 'cssmin', 'uglify', 'copyFontsFavs', 'replace', 'clean:includes']);
	// this is when you are ready for relased which includes minifying HTML, CSS and JS, optimizing images and updates file paths for .min.xxx extensions
	grunt.registerTask('release', ['clean:production', 'sass', 'php2html', 'cssmin', 'imagemin', 'uglify', 'copyFontsFavs', 'replace', 'minifyHtml', 'clean:includes']);
	
}