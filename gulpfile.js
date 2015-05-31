'use strict';

var gulp = require('gulp');
var clean = require('del');
var gp = require('gulp-load-plugins')();

var path = {
	build: 'dist'
	,src: 'src/*.coffee'
	,watch: ['src/*']
	,clean: 'dist'
};


// Tasks
gulp.task('build', function () {
	gulp.src(path.src)
		.pipe(gp.rigger())
		.pipe(gp.sourcemaps.init())
		.pipe(gp.coffee())
		.pipe(gulp.dest(path.build))
		.pipe(gp.uglify())
		.pipe(gp.rename({extname:'.min.js'}))
		.pipe(gp.sourcemaps.write('/'))
		.pipe(gulp.dest(path.build))
});

// Watch
gulp.task('watch', function(){
	gp.watch(path.watch, function() {
		gulp.start('build');
	});
});

// Clean Build dir
gulp.task('clean', function() {
	clean(path.build);
});

gulp.task('default', gp.sequence('clean',['build','watch']) );