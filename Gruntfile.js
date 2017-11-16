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
		// this takes your css file and minifies
		cssmin: {
			target: {
				files: {
					'production/assets/css/styles.min.css': ['src/assets/css/styles.css']
				}
			}
		},
		// Remove unused CSS from URLs (php, node, etc.)
		// (Note that`nonull` must be true, or else Grunt
		// removes remote paths that it can't find locally)
		uncss: {
		    dist: {
			    options: {
		            ignore: [
						/(#|\.)baguetteBox(-[a-zA-Z]+)?/,
						/\w\.in/,
						'.fade',
						'.collapse',
						'.collapsed',
						'.collapsing',
						/(#|\.)navbar(-[a-zA-Z]+)?/,
						/(#|\.)dropdown(-[a-zA-Z]+)?/,
						/(#|\.)(open)/,
						/disabled/,
						/\.no-js/,
						/\.defer/
					]
			    },
		        files: [{
		            src: ['production/index.html', 'production/folder/folder-test.html'],
		            dest: 'production/assets/css/styles.min.css'
		        }]
		    }
		},
		// this takes your main js file and minifies it to save weight
		uglify: {
			my_target: {
				files: {
					'production/assets/js/main.min.js': ['src/assets/js/vendor/*.js', 'src/assets/js/main.js']
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
			includes: ['production/_includes/'],
			// this removes the "scss" folder from 'production/assets/' after 'grunt dev' is run
			scss: ['production/assets/scss/']
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
			},
			devAssets: {
				expand: true,
				cwd: 'src/assets/',
				src: ['**/*'],
				dest: 'production/assets/'
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
		// this minifies the html 
		minifyHtml: {
	        dist: {
		        options: {
					removeComments: true,
					collapseWhitespace: true
				},
	            files: [{
					expand: true,   
					cwd: 'production/',
					src: ['**/*.html'],
					dest: 'production/'	
				}]
	        }
	    },
	    // this is a local server for development purposes
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
	grunt.loadNpmTasks('grunt-uncss');
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
	// 'Default' grunt task runs 'serve' task
	grunt.registerTask('default', ['dev']);
	// Runs a local php server with browserSync
	grunt.registerTask('dev', ['php', 'browserSync', 'watch']);
	// Used with the 'build' and 'release' tasks to copy fonts and favicons
	grunt.registerTask('copyFontsFavs', ['copy:fonts', 'copy:favicons']);
	// This is for debugging output code from PHP
	grunt.registerTask('build', ['clean:production', 'sass', 'php2html', 'copy', 'clean:includes', 'clean:scss']);
	// This is when you are ready to push to production. Includes minifying HTML, CSS and JS, optimizing images and updates file paths for .min.xxx extensions
	grunt.registerTask('release', ['clean:production', 'sass',  'php2html', 'cssmin', 'imagemin', 'uglify', 'copyFontsFavs', 'replace', 'minifyHtml', 'clean:includes', 'uncss']);
	
}