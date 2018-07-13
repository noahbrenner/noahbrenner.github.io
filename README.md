noahbrenner.github.io
=====================

Repo for Noah Brenner's portfolio page.

View Noah's portfolio at: https://noahbrenner.github.io

Building
--------

Currently, only images are generated programmatically, though this is likely to change.

The generated images are several different sizes (8 as of this writing) of several different filetypes (`.webp` and `.jpg`) of several different images (4 as of this writing). That adds up to (or multiplies up to?) a lot of generated files, so it can take a while and can eat up a lot of resources in the process. I plan to improve this soon by using [Bluebird](https://github.com/petkaantonov/bluebird/) Promises with their built-in concurrency limiting.

### Install dependencies

To generate the images, you'll first need to install:

* [Node.js](https://nodejs.org/) >= 7.6
* [GraphicsMagick](http://www.graphicsmagick.org/README.html#installation)

With Node installed (and thus [npm](https://www.npmjs.com/), which comes with it), you can locally install the other project dependencies. After cloning this repo, just run:

```bash
cd path/to/local/repo
npm install
```

Optionally, you might install [runjs](https://github.com/pawelgalazka/runjs) globally. This is a lightweight task runner with less overhead than gulp but more versatility than raw npm scripts:

```bash
npm install --global npmjs
```

### Generate images

If you've installed `runjs` globally, just run this in your terminal:

```bash
run images
```

If you didn't install `runjs` but you have [npx](https://github.com/zkat/npx) installed (which comes with npm v5.2.0 and later, so you probably have it if you've installed Node.js 8.2.0 or later):

```bash
npx run images
```

Or you can always run it directly from the `node_modules` directory:

```bash
./node_modules/.bin/run images
```

* * *

To see a full list of the defined tasks, you can simply run the following (or one of the variants shown above for calling `runjs`):

```bash
run
```
