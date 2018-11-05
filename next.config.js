const withTypescript = require('@zeit/next-typescript');
const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {};
}

module.exports = withPlugins([
  withTypescript,
  [
    withLess,
    {
      lessLoaderOptions: {
        javascriptEnabled: true
      }
    }
  ]
]);
