/*
 * There *is* an existing npm package named `gulp-clean-css` that could serve
 * the purpose of this wrapper, but that package has a couple flaws:
 * - There are no types defined for it.
 * - It locks dependencies at specific *patch* versions -- so a new version of
 *   `clean-css` could not be used until the wrapper package itself was updated.
 */
import CleanCSS from 'clean-css';
import * as through2 from 'through2';
// We don't depend on vinyl directly, we just use its types to interop with gulp
// eslint-disable-next-line import/no-extraneous-dependencies
import type * as Vinyl from 'vinyl';

export function cleanCss(options: CleanCSS.OptionsOutput) {
  return through2.obj((file: Vinyl, _encoding, callback) => {
    const result = new CleanCSS(options)
      .minify(file.contents as Buffer);

    const newFile = file.clone();
    newFile.contents = Buffer.from(result.styles);

    callback(null, newFile);
  });
}