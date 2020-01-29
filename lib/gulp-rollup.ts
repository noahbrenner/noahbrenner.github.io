import {
  rollup as rollupOriginal,
  Plugin as RollupPlugin,
  OutputChunk,
} from 'rollup';
import * as through2 from 'through2';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Vinyl from 'vinyl'; // Imported only for the type definition

export function rollup({plugins = [] as RollupPlugin[]} = {}) {
  return through2.obj(async function transform(file: Vinyl, _encoding, callback) {
    const rollupBuild = await rollupOriginal({
      plugins,
      input: file.path,
    });

    const {output} = await rollupBuild.generate({format: 'iife'});

    output
      .filter((asset): asset is OutputChunk => asset.type === 'chunk')
      .forEach((rollupChunk) => {
        const newFile = file.clone();

        newFile.contents = Buffer.from(rollupChunk.code);
        newFile.extname = '.js';

        this.push(newFile);
      });

    callback();
  });
}
