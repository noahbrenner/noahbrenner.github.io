import type GulpAutoprefixer from 'gulp-autoprefixer';
import type GulpPug from 'gulp-pug';
import type GulpSass from 'gulp-sass';
import type RollupTypescript from 'rollup-plugin-typescript2';

import type {cleanCss as GulpCleanCss} from './lib/gulp-clean-css';
import type {ResizeImagesOptions} from './lib/gulp-resize-images';

export const PATHS = {
  srcRoot: 'src/' as const,
  src: 'src/**/*' as const,
  dest: 'dist/' as const,

  static: ['src/*.{png,ico}' as const, 'src/**/*.svg' as const],
  /** The HTML entry file (any template and mixin files are *not* included) */
  html: 'src/html/index.pug' as const,
  css: 'src/css/styles.scss' as const,
  /** The JS source entry file (any files imported by it are *not* included) */
  js: 'src/js/scripts.ts' as const,
  heroImage: 'src/img/code.jpg' as const,
  featuredImages: ['src/img/*.{jpg,png}' as const, '!src/img/code.jpg' as const],
};

/* === Plugin options === */

const resizeImagesBase: Pick<ResizeImagesOptions, 'formats'> = {
  formats: [{
    filetype: 'jpeg',
    formatOptions: {
      quality: 77,
      progressive: true,
    },
  }, {
    filetype: 'webp',
    formatOptions: {
      quality: 76,
      alphaQuality: 0,
      lossless: false,
      reductionEffort: 6,
    },
  }],
};

const resizeImagesHero: ResizeImagesOptions = {
  ...resizeImagesBase,
  aspectRatio: 2 / 1,
  widths: [
    /* Rendered sizes on website:
     * - 320-850 @ 1x (arbitrary minimum)
     * - 640-1700 @ 2x
     *
     * Total Range: 320-1700
     */
    320, // arbitrary minimum
    500,
    850, // max @ 1x
    1275, // max @ 1.5x
    1500,
    1700, // max @ 2x
  ],
};

const resizeImagesFeatured: ResizeImagesOptions = {
  ...resizeImagesBase,
  aspectRatio: 3 / 2,
  widths: [
    /* Rendered sizes on website:
     * Breakpoints @ 1x:
     * - Small: 220-300 (arbitrary minimum, pause @ 300 for max-width)
     * - Medium: 235-385
     * - Large: 260 (fixed width)
     *
     * Ranges:
     * - 220-385 @ 1x (w/ pauses at 300 & 260)
     * - 440-770 @ 2x (w/ pauses at 600 & 520)
     *
     * Total Range: 220-770 (w/ stops at 300, 600, 260, & 520)
     */
    260, // Large viewport @ 1x
    390, // Large viewport @ 1.5x
    520, // Large viewport @ 2x
    650,
    770, // largest size @ 2x
  ],
};

// These pug options must be defined after the image resizing options
const gulpPug: GulpPug.Options = {
  // Use a namespace ("self") for template locals
  self: true,
  locals: {
    img: {
      hero: {
        filetypes: ['webp', 'jpeg'],
        widths: resizeImagesHero.widths,
      },
      featured: {
        filetypes: ['webp', 'jpeg'],
        widths: resizeImagesFeatured.widths,
      },
    },
  },
};

const gulpSass: Parameters<typeof GulpSass>[0] = {
  outputStyle: 'expanded',
};

const autoprefixer: Parameters<typeof GulpAutoprefixer>[0] = {
  cascade: false,
  // We haven't defined a browserslist, so the default query will apply:
  // > 0.5%, last 2 versions, Firefox ESR, not dead
};

const cleanCss: Parameters<typeof GulpCleanCss>[0] = {
  level: 2,
};

const rollupTypescript: Parameters<typeof RollupTypescript>[0] = {
  check: false, // Faster (we lint and type check separately)
  clean: true, // Don't cache -- a little slower, but more robust
  tsconfigOverride: {
    compilerOptions: {
      // Needed by rollup (gulpfile.ts via ts-node needs `module: "commonjs"`)
      module: 'ESNext',
    },
  },
};

export const OPTIONS = {
  autoprefixer,
  cleanCss,
  gulpPug,
  gulpSass,
  resizeImagesHero,
  resizeImagesFeatured,
  rollupTypescript,
} as const;
