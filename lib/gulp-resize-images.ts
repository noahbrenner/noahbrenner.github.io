import {Transform} from 'stream';

import sharp from 'sharp';
import type * as Vinyl from 'vinyl'; // Using gulp's dependency

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

export function resizeImages(
  {aspectRatio, widths, formats}: ResizeImagesOptions,
): Transform {
  return new Transform({
    objectMode: true,
    async transform(file: Vinyl, _encoding, callback) {
      // Outer loop: filetypes
      // eslint-disable-next-line arrow-body-style
      await Promise.all(formats.flatMap(({filetype, formatOptions}) => {
        // Inner loop: widths
        return widths.map(async (width) => {
          const newFile = file.clone();

          newFile.contents = await sharp(file.contents as Buffer)
            .resize({
              width,
              height: Math.round(width / aspectRatio),
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
    },
  });
}
