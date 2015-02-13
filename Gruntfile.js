module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-istanbul');
	grunt.initConfig({
		env: {
			coverage: {
				APP_DIR_FOR_CODE_COVERAGE: './build/instrument/app/'
			}
		},
		instrument: {
			files: 'app/*.js',
			options: {
				//lazy: true,
				basePath: 'build/instrument'
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					quiet: false,
					clearRequireCache: false
				},
				src: ['test/**/*.js']
			}
		},
		storeCoverage: {
			options: {
				dir: './build/reports/'
			}
		},
		makeReport: {
			src: 'build/reports/**/*.json',
			options: {
				type: 'lcov',
				dir: 'build/reports',
				print: 'detail'
			}
		}
	});
	// run all mocha tests (unit,acceptance,functional)
	grunt.registerTask('test', 'mochaTest')
	//run the 'test' target wrapped with coverage metrics collection and reporting
	grunt.registerTask('coverage', ['env:coverage','instrument','test','storeCoverage', 'makeReport']),
	//default behavior runs coverage and unit tests
	grunt.registerTask('default', 'coverage')
};