'use strict';

const del = require('del');
const globby = require('globby');
const makeDir = require('make-dir');
const {run, help} = require('runjs');

const makeImgSizes = require('./make-img-sizes');

async function taskWrapper(...functions) {
    try {
        await makeDir('img-out');
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }

    const t1 = new Date;
    await Promise.all(functions.map((fn) => fn()));
    const t2 = new Date;
    console.log(`Finished in ${(t2 - t1) / 1000} seconds`);
}

// === Tasks === //

function clean() {
    return del('img-out/*');
}

function _hero() {
    /* Rendered sizes on website:
     *
     * 320-850 @ 1x (arbitrary minimum)
     * 640-1700 @ 2x
     *
     * Total Range: 320-1700
    */
    return makeImgSizes({
        files: ['img-src/code.jpg'],
        widths: [
            320, // arbitrary minimum
            475,
            600,
            850, // max @ 1x
            1000,
            1275, // max @ 1.5x
            1500,
            1700 // max @ 2x
        ],
        aspectRatio: 2 / 1,
        fileExtensions: ['jpg', 'webp'],
        destDir: 'img-out/'
    });
}

async function _featured() {
    /* Rendered sizes on website:
     *
     * Breakpoints @ 1x:
     * Small: 220-300 (arbitrary minimum, pause @ 300 for max-width)
     * Medium: 235-385
     * Large: 260 (fixed width)
     *
     * Ranges:
     * 220-385 @ 1x (w/ pauses at 300 & 260)
     * 440-770 @ 2x (w/ pauses at 600 & 520)
     *
     * Total Range: 220-770 (w/ stops at 300, 600, 260, & 520)
    */
    return makeImgSizes({
        files: await globby(['img-src/*', '!img-src/code.jpg']),
        widths: [
            260, // Large viewport @ 1x
            300, // Small viewport pause @ 1x
            390, // Large viewport @ 1.5x
            450, // Small viewport pause @ 1.5x
            520, // Large viewport @ 2x
            600, // Small viewport pause @ 2x
            700,
            770 // largest size @ 2x
        ],
        aspectRatio: 3 / 2,
        fileExtensions: ['jpg', 'webp'],
        destDir: 'img-out/'
    });
}

help(clean, 'Delete all files in img-out/');

const hero = taskWrapper.bind(null, _hero);
help(hero, 'Resize Hero image');

const featured = taskWrapper.bind(null, _featured);
help(featured, 'Resize featured images');

const images = taskWrapper.bind(null, _hero, _featured);
help(images, 'Resize all images');

module.exports = {
    clean,
    images,
    hero,
    featured
};
