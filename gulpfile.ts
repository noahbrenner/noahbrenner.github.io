import del from 'del';
import * as gulp from 'gulp';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import {rollup} from './lib/gulp-rollup';

const PATHS = {
  srcRoot: 'src/',
  src: 'src/**/*',
  dest: 'dist/',

  /** The JS source entry file (any files imported by it are *not* included) */
  js: 'src/js/scripts.ts',
} as const;

/* === Task Functions === */

/** Clean the output directory. */
export function clean() {
  return del([PATHS.dest]);
}

/**
 * Copy all source files to output directory.
 *
 * This function is a temporary stand-in before establishing separate build
 * processes for each type of resource.
 */
function allSrcFiles() {
  return gulp.src([PATHS.src, `!${PATHS.js}`])
    .pipe(gulp.dest(PATHS.dest));
}

export function js() {
  // The whole JS build process is handled via rollup, we're only piping
  // everything through gulp to make BrowserSync live-reloading simpler
  // (once it's implemented)
  return gulp.src(PATHS.js, {base: PATHS.srcRoot})
    .pipe(rollup({
      plugins: [
        typescript({
          check: false, // Faster, and we lint and type check separately
          clean: true, // A little slower, but more robust
          tsconfigOverride: {
            compilerOptions: {
              // Needed by rollup (gulpfile.ts via ts-node needs "module")
              module: 'ESNext',
            },
          },
        }),
        terser(),
      ],
    }))
    .pipe(gulp.dest(PATHS.dest));
}

/* === Exported Tasks === */

const buildTasks = [
  clean,
  gulp.parallel(allSrcFiles, js),
];

export const build = gulp.series(...buildTasks);
