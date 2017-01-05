var gulp = require('gulp');
var minify = require('gulp-minify');
 
gulp.task('default', function() {
  gulp.src('src/*.js')
    .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        },
    }))
    .pipe(gulp.dest('dist'));
});