'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const gm = require('gm');

gm.prototype.writeAsync = util.promisify(gm.prototype.write);

/** Return a Promise for resizing an image, saving it in several formats
 *
 * Some inspiration for transformation settings taken from:
 * https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/
 */
async function resize(opts) {
  const {
    src, // Stream, string (path), or buffer - the image source
    width, // Integer - output image width
    height, // Integer or undefined - output image height
    fileExtensions, // Array of strings - output extensions (no leading '.')
    destTemplate // String - `util.format()` template for output path
  } = opts;

  let resizedStream = gm(src)
    .strip() // remove EXIF data
    .filter('Triangle') // fast resize filter

  if (height) {
    resizedStream = resizedStream
      .thumbnail(width, height, '^') // Fast resize, allow x or y overflow
      .gravity('center') // When cropping, center the cropped area
      .extent(width, height); // Crop to remove any overflow
  } else {
    resizedStream = resizedStream
      .thumbnail(width); // Keep aspect ratio when resizing
  }

  resizedStream = resizedStream
    .unsharp(0.25, 0.25, 8, 0.065) // Sharpen the image
    .dither(false)
    .stream('miff'); // keep data in Graphics-/ImageMagick's internal format

  return Promise.all(fileExtensions.map(function (extension) {
    const destPath = util.format(destTemplate, width, extension);
    // e.g. images/bird-800.jpg

    const qualityDefaults = {
      jpg: 80,
      webp: 80
    };
    const quality = qualityDefaults[extension] || 100;

    return gm(resizedStream)
      .define('png:compression-filter=5')
      .define('png:compression-level=9')
      .define('png:compression-strategy=1')
      .define('png:exclude-chunk=all')
      // .define('webp:lossless=true') // TODO If input (or an output) is png
      .define('webp:method=6') // compress more (1-6)
      .define('webp:pass=6') // TODO make an option for this (1-10)
      .define('webp:thread-level=1') // Use threading if possible
      .quality(quality)
      .interlace('Line') // TODO only do this for jpg files
      .writeAsync(destPath)
      .then(() => console.log(`Resized: ${destPath}`))
      .catch((err) => {
        console.log(`ERROR RESIZING: ${destPath}`);
        console.log(err);
        process.exit(1);
      });
  }));
}

/** Return a promise for resizing multiple files to multiple widths and formats */
function makeImgSizes(opts) {
  const {
    files, // Array of strings - source files to resize
    widths, // Array of integers - desired sizes for each input file
    aspectRatio, // Number - width divided by height
    fileExtensions, // Array of strings - output extensions (no leading '.')
    destDir='.' // String - directory to write the resized files
  } = opts;

  const resizeArgs = [];

  files.forEach((file) => {
    const fileBasename = path.basename(file, path.extname(file));

    widths.forEach((width) => resizeArgs.push({
      src: fs.createReadStream(file),
      width: width,
      height: aspectRatio && Math.round(width / aspectRatio),
      fileExtensions: fileExtensions,
      destTemplate: path.join(destDir, `${fileBasename}-%s.%s`)
    }));
  });

  return Promise.all(resizeArgs.map(resize));
}

module.exports = makeImgSizes;
