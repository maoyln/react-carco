## 创建项目

### 使用`create-react-app`创建项目

#### 安装create-react-app 

> 如果之前安装过，最好先卸载掉，重新安装

<!-- 卸载 -->
```
- npm uninstall -g create-react-app
- yarn global remove create-react-app

```

#### 使用npm创建项目
```
npx create-react-app my-app-ts --template typescript
```


#### 使用eject弹出webpack配置
```
npm run eject
```

#### 启动

```
yarn start
```
本地访问：http://localhost:3001/



## react-app-rewired使用

#### 安装 react-app-rewired

对于使用 Webpack 4 的 create-react-app 2.x：
```
npm install react-app-rewired --save-dev
```

对于使用 Webpack 3 的 create-react-app 1.x 或 react-scripts-ts：
```
npm install react-app-rewired@1.6.2 --save-dev
```

##### config-overrides.js2）在根目录下创建文件

安装customize-cra 
```
npm install customize-cra --save-dev
```

```
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
    jsonpFunction: 'webpackJsonp_myl'
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
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
      pages: path.resolve(__dirname, 'src/pages')
    }),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }),
    // addLessLoader({
    //   javascriptEnabled: true,
    //   modifyVars: {
    //     '@hack': `true; @import "assets/styles/myCustomizedAntdTheme.less";`
    //   },
    //   paths: [path.resolve(__dirname, 'src')]
    // }),
    setWebpackOutput() // 这才是正解，如果报错，只能说是 publicPath 有问题，因为如果你设置了 %publicUrl%，你需要加上publicUrl
  ),
  devServer: (configFunc) => {
    return (proxy, allowedHost) => {
      const config = configFunc(proxy, allowedHost);
      config.headers = config.headers || {};
      // config.proxy = {
      //   '/infra-bi/infra-bi-service/': {
      //     target: 'https://xxxxxxxxx',
      //     changeOrigin: true,
      //     secure: true
      //   }
      // };
      return config;
    };
  }
};

```


### 修改package.json文件
```
{
  // ...
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
  // ...
}
```

使用Less
```
安装less和less-loader：npm i less less-loader --save-dev
```

安装babel-plugin-import
```
npm install babel-plugin-import --save-dev
```


此时可以正常运行



### 配置多环境

在根目录下添加.env.development文件
```
REACT_APP_PLATFORM_URL=https://www.dev.com
PUBLIC_URL=/maoyl/
SKIP_PREFLIGHT_CHECK=true
EXTEND_ESLINT=true
```
在根目录下添加.env.production文件
```
REACT_APP_PLATFORM_URL=https://www.pro.com
PUBLIC_URL=/maoyl/
SKIP_PREFLIGHT_CHECK=true
EXTEND_ESLINT=true
```

在根目录下添加.env.test文件
```
REACT_APP_PLATFORM_URL=https://www.test.com
PUBLIC_URL=/maoyl/
SKIP_PREFLIGHT_CHECK=true
EXTEND_ESLINT=true
```

修改package.json配置
```
  "scripts": {
    "start-ts": "react-app-rewired start",
    "start": "sh -ac '. ./.env.development; PORT=3003 npm run start-ts'",
    "build-ts": "react-app-rewired build",
    "build": "sh -ac '. ./.env.${REACT_APP_ENV};npm run build-ts'",
    "build:development": "REACT_APP_ENV=development npm run build",
    "build:test": "REACT_APP_ENV=test npm run build",
    "build:production": "REACT_APP_ENV=production npm run build",
    "test": "react-app-rewired test --env=jsdom"
  },
```

此时正常运行http://localhost:3003/maoyl
截图在微信

测试打包： yarn build:development 和  yarn build:production 正常
截图在微信


后续需要用`react-app-rewired` 改成 `craco`