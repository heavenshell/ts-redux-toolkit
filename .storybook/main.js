// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const cpus = require('os').cpus().length
const tsLoaderWorkers = cpus > 3 ? cpus - 2 : 1

module.exports = {
  stories: ['../src/components/**/*.stories.tsx'],
  addons: [
    'storycap/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-links/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-viewport/register',
  ],
  webpackFinal: async(config, {configType}) => {
    config.module.rules.push(
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'cache-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
              // transpileOnly: true,
            },
          },
          {
            // run compilation threaded
            loader: 'thread-loader',
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: tsLoaderWorkers,
            },
          },
        ],
      },
    )
    // config.plugins.push(new ForkTsCheckerWebpackPlugin({ async: true }))
    config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx')
    return config
  }
}
