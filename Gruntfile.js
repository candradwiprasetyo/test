module.exports = function (grunt) {
	'use strict';
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});
	grunt.initConfig({
		sass: {
			ciayo: {
				options: {
					sourceMap: false,
					outputStyle: "compressed"
				},
				cwd: 'assets/css/scss',
				src: 'ciayo.scss',
				dest: 'assets/css',
				ext: '.min.css',
				expand: true
			},
			wellcome: {
				options: {
					sourceMap: false,
					outputStyle: "compressed"
				},
				cwd: 'assets/css/scss',
				src: 'welcome.scss',
				dest: 'assets/css',
				ext: '.min.css',
				expand: true
			}
		},
		babel: {
			options: {
				sourceMap: false,
				presets: ['react'],
				minified: false
			},
			dist: {
				files:
				// {
				// 	'app/components/tes.js': 'app/components/jsx/tes.jsx'
				// }
				[{
					cwd: 'app/components/jsx',
					src: '*.jsx',
					dest: 'app/components',
					ext: '.js',
					expand: true
					}]
			}
		},
		concat: {
			options: {
				separator: ';\n',
			},
			basic_and_extras: {
				files: {
					
					'build.angular.js': [
						'assets/libs/angular.js', 'assets/libs/angular-material.min.js',
						'assets/libs/angular-aria.js', 'assets/libs/angular-animate.js',
						'assets/libs/angular-sanitize.js', 'assets/libs/angular-messages.js',
						'assets/libs/angular-cookies.js', 'assets/libs/angular-css.js',
						'assets/libs/angular-ui-router.js', 'assets/libs/angular-translate.min.js',
						'assets/libs/angular-flickity.min.js',
						'assets/libs/angulartics.min.js','assets/libs/angulartics-ga.min.js'
					],
					'build.jquery.js':[
						'assets/libs/jquery.js','assets/libs/jquery-ui.js',
						'assets/libs/dropdown.js','assets/libs/jquery.parallax.min.js',
						'assets/libs/flickity.pkgd.min.js','assets/libs/jquery.cycle2.min.js',
						'assets/libs/jquery.itour.min.js'
					],
					'build.react.js':[
						'assets/libs/react.min.js','assets/libs/react-dom.min.js'
					],
					'ciayo.js': [ 
						'assets/libs/language.js','app/app.js',
						'app/controllers/**.js', 'app/directives/**.js', 'app/factories/**.js', 'app/services/**.js'
					]
				},
			},
		},
		uglify:{
			options:{
				sourceMap:false
			},
			my_target:{
				files:{
					'ciayo.js': [ 'app/controllers/**.js', 'app/directives/**.js', 'app/factories/**.js', 'app/services/**.js','app/components/**.js' ]
				}
			}
		},
		watch: {
			static: {
				options: {
					livereload: 9030,
					mangle:false
				},
				files: [
					'index.html',
					'views/*.html',
					'app/directives/views/*.html',
					'assets/css/*.css',
					'ciayo.js'
				]
			},
			sass: {
				files: 'assets/css/scss/*.scss',
				tasks: ['sass']
			},
			babel: {
				files: 'app/components/jsx/*.jsx',
				tasks: 'babel'
			},
			concat: {
				files: ['assets/libs/language.js','app/**/*.js', ],
				tasks: ['concat']
			},
		},
		connect: {
			server: {
				options: {
					livereload: 9030,
					hostname: '0.0.0.0',
					port: 9000,
					open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>'
				}
			}
		}
	});
	grunt.registerTask('default', function () {
		grunt.task.run(['connect', 'watch']);
	});
};