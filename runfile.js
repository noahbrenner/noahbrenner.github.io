'use strict';

const globby = require('globby');
const {run, help} = require('runjs');

const makeImgSizes = require('./make-img-sizes');

async function timePromiseFunctions(...functions) {
    const t1 = new Date;
    await Promise.all(functions.map((fn) => fn()));
    const t2 = new Date;
    console.log(`Finished in ${(t2 - t1) / 1000} seconds`);
}

// === Tasks === //

function _hero() {
    return makeImgSizes({
        files: ['img-src/code.jpg'],
        widths: [800, 400],
        aspectRatio: 800 / 500,
        fileExtensions: ['jpg', 'webp'],
        destDir: 'img-out/'
    });
}

async function _featured() {
    return makeImgSizes({
        files: await globby(['img-src/*', '!img-src/code.jpg']),
        widths: [500, 300],
        aspectRatio: 300 / 200,
        fileExtensions: ['jpg', 'webp'],
        destDir: 'img-out/'
    });
}

const hero = timePromiseFunctions.bind(null, _hero);
help(hero, 'Resize Hero image');

const featured = timePromiseFunctions.bind(null, _featured);
help(featured, 'Resize featured images');

const images = timePromiseFunctions.bind(null, _hero, _featured);
help(images, 'Resize all images');

module.exports = {
    images,
    hero,
    featured
};
