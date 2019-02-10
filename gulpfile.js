var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

gulp.task('css-run', function() {
    return gulp.src('src/style.css') 
    	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano()) 
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public'));
});