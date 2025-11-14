import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
import getSharedDependencies from './shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STANDALONE = Boolean(process.env.STANDALONE);

console.log("📁[1;97;46m[4m[3mpackages/MiniApp/rspack.config.mjs:11[0m📁\n","💁  ℹ️ getSharedDependencies({eager: STANDALONE}) >>> ", getSharedDependencies({eager: STANDALONE}))

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default Repack.defineRspackConfig(({mode, platform}) => {
  return {
    mode,
    context: __dirname,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions(),
    },
    output: {
      uniqueName: 'sas-host',
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          type: 'javascript/auto',
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            parallel: true,
            options: {},
          },
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name:'host',
        dts:false,
        remotes:{
          mini: `mini@http://localhost:8082/${platform}/mf-manifest.json`
        },
        shared: getSharedDependencies({eager: STANDALONE}),
      }),
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  }
});
