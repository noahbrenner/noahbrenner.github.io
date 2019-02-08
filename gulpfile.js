const del = require('del');
const gulp = require('gulp');

const PATHS = {
    src: 'src/**/*',
    dest: 'dist/'
};

/* === Task Functions === */

/** Clean the output directory. */
function clean() {
    return del([PATHS.dest]);
}

/** Copy all source files.
 *
 * We're doing a proof-of-concept for deploying to GitHub Pages Travis CI.
 * For this initial test, we're not performing any transformations, so all
 * files are handled in this single task.
 */
function allSrcFiles() {
    return gulp.src(PATHS.src)
        .pipe(gulp.dest(PATHS.dest));
}

/* === Exported Tasks === */

exports.build = gulp.series(clean, allSrcFiles);
