/* eslint @typescript-eslint/explicit-module-boundary-types: "off"
   -- Functions are only exported from this file to enable them as gulp tasks */

import path from 'path';

import browserSync from 'browser-sync';
import del from 'del';
import * as gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import nodeSass from 'node-sass';
import {rollup} from 'rollup';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import {PATHS, OPTIONS} from './config';
import {cleanCss} from './lib/gulp-clean-css';
import {resizeImages} from './lib/gulp-resize-images';

// The node-sass docs recommend setting the `compiler` property explicitly, but
// the types defined for the package don't define that property.
// See: https://github.com/dlmanning/gulp-sass#basic-usage
type GulpSass = typeof sass & {compiler: typeof nodeSass};
(sass as GulpSass).compiler = nodeSass;

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

/** Compile CSS */
export function css() {
  return gulp.src(PATHS.css, {base: PATHS.srcRoot})
    .pipe(sass(OPTIONS.gulpSass).on('error', sass.logError.bind(sass)))
    .pipe(autoprefixer(OPTIONS.autoprefixer))
    .pipe(cleanCss(OPTIONS.cleanCss))
    .pipe(gulp.dest(PATHS.dest));
}

/** Compile JavaScript */
export function js() {
  return rollup({
    input: PATHS.js,
    plugins: [
      typescript(OPTIONS.rollupTypescript),
      terser(),
    ],
  }).then((bundle) => bundle.write({
    dir: path.join(PATHS.dest, 'js'),
    format: 'iife',
  }));
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

const imageTasks = [
  hero,
  featured,
];

const allBuildTasks = [
  clean,
  gulp.parallel(staticFiles, html, css, js, ...imageTasks),
];

function startBrowserSync() {
  const server = browserSync.create();

  server.init({
    server: `./${PATHS.dest}`,
    open: false,
  });

  server.watch(PATHS.dest, {}, (_event, filePath) => {
    // `filePath` is incorrectly typed as `fs.Stats`
    server.reload(filePath as unknown as string);
  });

  gulp.watch(PATHS.srcRoot).on('all', (_event, filePath: string) => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pug') {
      html();
    } else if (ext === '.scss') {
      css();
    } else if (ext === '.ts') {
      js(); // eslint-disable-line @typescript-eslint/no-floating-promises
    } else {
      staticFiles();
      imageTasks.forEach((task) => task());
    }
  });
}

export const images = gulp.parallel(...imageTasks);
export const build = gulp.series(...allBuildTasks);
export const watch = gulp.series(...allBuildTasks, startBrowserSync);
