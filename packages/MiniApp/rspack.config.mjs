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

export default Repack.defineRspackConfig(({mode}) => {
  return {
    mode,
    context: __dirname,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions(),
    },
    output: {
      uniqueName:'sas-mini',
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
        ...Repack.getAssetTransformRules({inline: !STANDALONE}),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'mini',
        filename: 'mini.container.js.bundle',
        dts: false,
        exposes: STANDALONE
          ? undefined
          : {
            './App': './src/navigation/MainNavigator',
          },
        shared: getSharedDependencies({eager: STANDALONE}),
      }),
      new Repack.plugins.CodeSigningPlugin({
        enabled: mode === 'production',
        privateKeyPath: path.join('..', '..', 'code-signing.pem'),
      }),
      // silence missing @react-native-masked-view optionally required by @react-navigation/elements
      new rspack.IgnorePlugin({
        resourceRegExp: /^@react-native-masked-view/,
      }),
    ],
  }
});
