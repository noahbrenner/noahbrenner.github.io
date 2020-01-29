import typescript from 'rollup-plugin-typescript2';

export const PATHS = {
  srcRoot: 'src/',
  src: 'src/**/*',
  dest: 'dist/',

  /** The JS source entry file (any files imported by it are *not* included) */
  js: 'src/js/scripts.ts',
} as const;

/* === Plugin options === */

const rollupTypescript: Parameters<typeof typescript>[0] = {
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
  rollupTypescript,
} as const;
