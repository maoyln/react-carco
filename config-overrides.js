const {
  override,
  addWebpackAlias,
  fixBabelImports,
  addLessLoader
} = require('customize-cra');
const path = require('path');

const setWebpackOutput = () => (config) => {
  config.output = {
    ...config.output,
    library: 'myl-[name]',
    libraryTarget: 'umd',
    // jsonpFunction: 'webpackJsonp_myl'
  };

  if (process.env.REACT_APP_ENV === 'development' || process.env.REACT_APP_ENV === 'test') {
    config.output.publicPath = process.env.PUBLIC_URL;
  } else {
    // config.output.publicPath = process.env.PUBLIC_URL;
  }
  return config;
};

module.exports = {
  webpack: override(
    // 添加别名
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
      pages: path.resolve(__dirname, 'src/pages')
    }),
    // 按需加载
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        '@hack': `true; @import "assets/styles/myCustomizedAntdTheme.less";`
      },
      paths: [path.resolve(__dirname, 'src')]
    }),
    setWebpackOutput() // 这才是正解，如果报错，只能说是 publicPath 有问题，因为如果你设置了 %publicUrl%，你需要加上publicUrl
  ),
  devServer: (configFunc) => {
    return (proxy, allowedHost) => {
      const config = configFunc(proxy, allowedHost);
      config.headers = config.headers || {};
      // config.proxy = {
      //   '/infra-bi/infra-bi-service/': {
      //     target: 'https://xxxxxxxx',
      //     changeOrigin: true,
      //     secure: true
      //   }
      // };
      return config;
    };
  }
};
