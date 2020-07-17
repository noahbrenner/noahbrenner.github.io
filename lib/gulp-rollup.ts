import {Transform} from 'stream';

import {rollup as rollupOriginal} from 'rollup';
import type {Plugin as RollupPlugin, OutputChunk} from 'rollup';
import type * as Vinyl from 'vinyl'; // Using gulp's dependency

export function rollup({plugins = [] as RollupPlugin[]} = {}): Transform {
  return new Transform({
    objectMode: true,
    async transform(file: Vinyl, _encoding, callback) {
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
    },
  });
}
