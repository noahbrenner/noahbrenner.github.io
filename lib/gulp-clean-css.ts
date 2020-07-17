import {Transform} from 'stream';

/*
 * There *is* an existing npm package named `gulp-clean-css` that could serve
 * the purpose of this wrapper, but that package has a couple flaws:
 * - There are no types defined for it.
 * - It locks dependencies at specific *patch* versions -- so a new version of
 *   `clean-css` could not be used until the wrapper package itself was updated.
 */
import CleanCSS from 'clean-css';
import type * as Vinyl from 'vinyl'; // Using gulp's dependency

export function cleanCss(options: CleanCSS.OptionsOutput): Transform {
  return new Transform({
    objectMode: true,
    transform(file: Vinyl, _encoding, callback) {
      const result = new CleanCSS(options)
        .minify(file.contents as Buffer);

      const newFile = file.clone();
      newFile.contents = Buffer.from(result.styles);

      callback(null, newFile);
    },
  });
}
