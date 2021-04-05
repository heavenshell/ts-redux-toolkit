const path = require('path')
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const cpus = require('os').cpus().length
const tsLoaderWorkers = cpus > 3 ? cpus - 2 : 1
const toPath = (_path) => path.join(process.cwd(), _path)

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/components/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storycap',
  ],
  webpackFinal: async(config, {configType}) => {
    config.module.rules.push(
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            // import the antd theme, webpack build show .bezierEasingMixin error ?
            // https://github.com/ant-design/ant-design/issues/7927
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
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
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': toPath('node_modules/@emotion/react'),
          '@emotion/styled': toPath('node_modules/@emotion/styled'),
          '@emotion/styled-base': toPath('node_modules/@emotion/styled'),
          'emotion-theming': toPath('node_modules/@emotion/react'),
        },
      },
    }
  }
}
