noahbrenner.github.io
=====================

> Repo for Noah Brenner's portfolio page

View Noah's portfolio at: https://noahbrenner.github.io

Building
--------

### Install dependencies

First make sure you have [Node.js](https://nodejs.org/) installed (and [npm](https://www.npmjs.com/), which is bundled with it). Then clone this repo and install the project's npm dependencies:

```bash
$ git clone $repo_url
$ cd path/to/repo
$ npm install
```

### Build it!

Build the website in the `dist/` directory:

```bash
$ npm run build
```

You can run a smaller portion of the build by running the appropriate gulp task. Using [npx](https://github.com/npm/npx) (also bundled with Node.js) is a great way to accomplish this:

```bash
$ npx gulp images
```

Notes
-----

* Images are processed using [sharp](https://github.com/lovell/sharp), which requires a 64-bit processor.
