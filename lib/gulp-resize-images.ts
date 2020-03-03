import sharp from 'sharp';
import * as through2 from 'through2';
// We don't depend on vinyl directly, we just use its types to interop with gulp
// eslint-disable-next-line import/no-extraneous-dependencies
import type * as Vinyl from 'vinyl';

interface FormatSpecifier {
  filetype: keyof sharp.FormatEnum;
  formatOptions: Parameters<sharp.Sharp['toFormat']>[1];
}

export interface ResizeImagesOptions {
  /**
   * The aspect ratio for the output (which can be different from the input),
   * written as a fraction: `width / height`
   */
  aspectRatio: number;
  widths: number[];
  formats: FormatSpecifier[];
}

export function resizeImages(options: ResizeImagesOptions) {
  return through2.obj(async function _transform(file: Vinyl, _encoding, callback) {
    // Outer loop: filetypes
    // eslint-disable-next-line arrow-body-style
    await Promise.all(options.formats.flatMap(({filetype, formatOptions}) => {
      // Inner loop: widths
      return options.widths.map(async (width) => {
        const newFile = file.clone();

        newFile.contents = await sharp(file.contents as Buffer)
          .resize({
            width,
            height: Math.round(width / options.aspectRatio),
            fit: 'cover',
            position: 'north',
            kernel: 'lanczos3',
          })
          .toFormat(filetype, formatOptions)
          .toBuffer();

        newFile.basename = `${file.stem}-${width}.${filetype}`;

        this.push(newFile);
      });
    }));

    callback();
  });
}
