import del from 'del';
import * as gulp from 'gulp';
import pug from 'gulp-pug';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import {PATHS, OPTIONS} from './config';
import {resizeImages} from './lib/gulp-resize-images';
import {rollup} from './lib/gulp-rollup';

/** Clean the output directory. */
export function clean() {
  return del([PATHS.dest]);
}

/** Copy static files */
export function staticFiles() {
  return gulp.src(PATHS.static)
    .pipe(gulp.dest(PATHS.dest));
}

/** Compile HTML */
export function html() {
  return gulp.src(PATHS.html)
    .pipe(pug(OPTIONS.gulpPug))
    .pipe(gulp.dest(PATHS.dest));
}

// TODO Compile from SCSS and minify
/** Copy CSS */
export function css() {
  return gulp.src(PATHS.css)
    .pipe(gulp.dest(PATHS.dest));
}

/** Compile and minify JavaScript */
export function js() {
  /*
   * All of the JS build steps are handled via rollup.  The only reason we're
   * piping through gulp (instead of just returnin a promise) is to simplify
   * the configuration for BrowserSync live-reloading (once it's implemented).
   */
  return gulp.src(PATHS.js, {base: PATHS.srcRoot})
    .pipe(rollup({
      plugins: [
        typescript(OPTIONS.rollupTypescript),
        terser(),
      ],
    }))
    .pipe(gulp.dest(PATHS.dest));
}

/** Process hero image */
export function hero() {
  return gulp.src(PATHS.heroImage, {base: PATHS.srcRoot})
    .pipe(resizeImages(OPTIONS.resizeImagesHero))
    .pipe(gulp.dest(PATHS.dest));
}

/** Process featured project images */
export function featured() {
  return gulp.src(PATHS.featuredImages, {base: PATHS.srcRoot})
    .pipe(resizeImages(OPTIONS.resizeImagesFeatured))
    .pipe(gulp.dest(PATHS.dest));
}

/** Process all images */
export const images = gulp.parallel(hero, featured);

const buildTasks = [
  clean,
  gulp.parallel(staticFiles, html, css, js, images),
];

export const build = gulp.series(...buildTasks);
