# 前言
对于现代web前端工程化，webpack起到了绝大的作用，此篇文章致力于让你学习webpack的配置，能够从无到有的配置一套属于自己的webpack配置，此教程从基础配置，到优化两个纬度进行讲解，其中有大量的示例，文尾部分会提供git仓库以供代码下载。

<!-- more -->

# 配置
这里只讲解配置相关的细节，不讲解原理性的知识，建议熟练使用webpack之后，学习下webpack是如何工作的，这样可以定制loader和plugin，能够更加高效的解决项目上的问题。

## 初始化工程
前端工程化最基础的东西，就是npm包管理器，这一切都是建立在这上面的，首先运行。

> npm init -y

初始化package.json

前提是你安装了node.js，下载地址

> https://nodejs.org/en/

其中 **-y** 指令是跳过package.json的配置，直接初始化一个package.json文件。建议去掉-y指令，进行一次定制化的配置。

建立一个build目录，用于存放webpack相关配置，建立一个src目录，用于存放工程文件。

## 安装webpack
在build目录下新建一个webpack.base.js文件，这个文件用于存放公共的webpack配置项，比如sass，babel什么的，因为一个工程可能不止一个需求，所以建立一个公共的配置项方便其他需求的配置。

安装webpack依赖，推荐使用yarn
> npm i yarn -g

> yarn add webpack --dev

因为是配置4.0版本，所以还需要安装webpack-cli
>yarn add webpack-cli --dev

配置完成后，在webpack.base.js进行以下配置，测试是否安装成功

```js
const path = require('path')

const getPathByRoot = function(targetPath) {
    path.resolve(__dirname, '../', targetPath)
}

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: './static/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    }
}
```
这是一个最简单的配置，引入了 node 的path模块，用于路径解析，定义了webpack入口文件，以及出口的路径及文件名，注意文件名后面有一个[hash]，这个的作用是给打包后的文件添加一个hash值，用户解决浏览器缓存的问题。

再看看入口文件。
```js
class Test {
    constructor() {
        alert(1)
    }
}

new Test()
```

很简单的代码，只是为了查看打包后的文件。

很关键的一步就是需要在package.json文件中定义打包命令，在package.json文件的script中添加以下代码:

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config ./build/webpack.base.js --mode=production"
}
```

build命令的大致意思是，以production模式运行webpack使用build目录下的webpack.base.js配置文件。

上述文件添加完成后，运行：
> npm run build

可以看见生成了一个dist目录，目录下有一个static目录，其中有一个index.js文件,其中的代码如下：
```js
!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="./",r(r.s=0)}([function(e,t){new class{constructor(){alert(1)}}}]);
```

多了一些文件，在最后可以看到：
```js
new class{constructor(){alert(1)}}}
```

入口文件的代码已经被打包了，但是还是之前的es6的代码，如果想要转换成es5，这就要用到babel了。

## loaders & plugins
webpack的loader作用是，loader通过正则表达式将匹配到的文件中的字符串，经过自己的处理后，再交给下一个loader处理，所以最终得到的文件，是一个自己需要的文件。

### bable-loader
这里介绍babel-loader的配置，babel的作用是将低版本浏览器不支持的es6 7 8 的代码转换成可执行的es5代码，而babel-loader的作用是将匹配到的js文件交给babel转换器处理成es5的代码，再交给下一个loader，先安装babel相关的依赖
> yarn add @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader --dev

> yarn add @babel/runtime

用两条命令的原因是， **@babel/runtime** 是生产依赖，用于将babel不转换的es6 函数如promise，set, map等转换成es5的 polyfill，并且通过 **@babel/plugin-transform-runtime** 插件将这些函数提取成公共的函数，以免重复转换，增加代码量。

完成依赖的安装后，我们需要配置webpack的loader,如下图。

```js
const path = require('path')

const getPathByRoot = function(targetPath) {
    path.resolve(__dirname, '../', targetPath)
}

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: './static/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader']
        }]
    }
}
```

添加了一个module属性，其中有一个字段是rules，值是一个数组，表示可以处理多种格式的文件。test是一个正则表达式，表示需要经过loader处理的文件类型。use对应的是需要使用的loader，是一个数组，可以添加多个loader，处理的顺序是，最后一个loader先处理，第一个loader最后处理，这个后面会详细讲解，现在不懂没关系。

然后在项目根目录新建一个文件，名为 **.babelrc** ,内容如下：
```json
{
    "presets": [
        "@babel/env"
    ]
}
``` 
关于babelrc文件具体的讲解可以看这篇文章,这里我使用的是最新的 **"@babel/env"** 
> http://www.cnblogs.com/tugenhua0707/p/9452471.html

运行 **npm run build** 命令，得到如下代码
```js
!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="./",t(t.s=0)}([function(e,n){new function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),alert(1)}}]);
```

在文件的最后，可以看到 es6 的 class 语法已经转换成了es5的代码，至此，babel就配置成功了。

其次一个web前端项目肯定是少不了html文件的，所以接下来教大家处理html文件。

### html-loader 以及 html-webpack-plugin
html-loader可以解析html文档中的图片资源，交给其他的loader处理，如url-loader或者是file-loader等。

html-webpacl-plugin的功能是将一个html作为模版，打包完成后会将打包后的资源比如js css，自动添加进html文档中。

首先进行安装：

> yarn add html-loader html-webpack-plugin --dev

再向webpack.base.config中添加以下配置：
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getPathByRoot = function(targetPath) {
    path.resolve(__dirname, '../', targetPath)
}

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /.js$/,
            use: ['babel-loader']
        }, {
            test: /.html/,
            use: ['html-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
```

然后在项目根目录下添加一个 **index.html**文件
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>learn webpack</title>
</head>
<body>
    
</body>
</html>
```

此时运行打包命令，可以看见输出的文件下已经有了index.html文件，并且已经引入了打包后的js文件。

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>learn webpack</title>
</head>
<body>
    
<script type="text/javascript" src="./static/index.js"></script></body>
</html>
```

在浏览器中打开index.html，已经可以正常运行了。

![wx20181008-171737](https://user-images.githubusercontent.com/23492006/46601033-9d1a3d00-cb1e-11e8-8753-fe74d3feb883.png)

### css预处理器
预处理器作为前端css高效的工具，不可不用，这一节教学sass的安装与配置。首先安装css sass的依赖以及style-loader。

> yarn add node-sass sass-loader css-loader style-loader --dev

如果提示编译失败，需要安装python2的话，就使用cnpm 安装 node-sass

> cnpm i node-sass --save-dev

其中style-loader的作用是，将处理完成的css文件使用style标签内联进html文档中，之后会讲解将css文件抽离出js文件。

安装完成后进行webpack配置，如下：
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getPathByRoot = function(targetPath) {
    path.resolve(__dirname, '../', targetPath)
}

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /.js$/,
            use: ['babel-loader']
        }, {
            test: /.html$/,
            use: ['html-loader']
        }, {
            test: /.(sc|c)ss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
```

这里我们同时匹配了css 以及scss文件，因为scss是css的一个超集，所以sass-loader也可以解析css文件，减少了不必要的配置。

再看看使用的loader的顺序，值得注意的是，在这个数组中，webpack使用的loader是倒序执行的，也是就是先执行的sass-loader再执行的css-loader，其次才是style-loader，要是反过来，是会报错的哦。

执行 build 命令得到以下代码：
```js
!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="./",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);n(1);new function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),alert(1)}},function(t,e,n){var r=n(2);"string"==typeof r&&(r=[[t.i,r,""]]);var o={hmr:!0,transform:void 0,insertInto:void 0};n(4)(r,o);r.locals&&(t.exports=r.locals)},function(t,e,n){(t.exports=n(3)(!1)).push([t.i,".test {\n  height: 100px; }\n  .test .test1 {\n    width: 100px; }\n",""])},function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var n=function(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var o=function(t){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+" */"}(r),i=r.sources.map(function(t){return"/*# sourceURL="+r.sourceRoot+t+" */"});return[n].concat(i).concat([o]).join("\n")}return[n].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+n+"}":n}).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<t.length;o++){var s=t[o];"number"==typeof s[0]&&r[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),e.push(s))}},e}},function(t,e,n){var r={},o=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),i=function(t){var e={};return function(t,n){if("function"==typeof t)return t();if(void 0===e[t]){var r=function(t,e){return e?e.querySelector(t):document.querySelector(t)}.call(this,t,n);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(t){r=null}e[t]=r}return e[t]}}(),s=null,a=0,u=[],f=n(5);function c(t,e){for(var n=0;n<t.length;n++){var o=t[n],i=r[o.id];if(i){i.refs++;for(var s=0;s<i.parts.length;s++)i.parts[s](o.parts[s]);for(;s<o.parts.length;s++)i.parts.push(b(o.parts[s],e))}else{var a=[];for(s=0;s<o.parts.length;s++)a.push(b(o.parts[s],e));r[o.id]={id:o.id,refs:1,parts:a}}}}function l(t,e){for(var n=[],r={},o=0;o<t.length;o++){var i=t[o],s=e.base?i[0]+e.base:i[0],a={css:i[1],media:i[2],sourceMap:i[3]};r[s]?r[s].parts.push(a):n.push(r[s]={id:s,parts:[a]})}return n}function p(t,e){var n=i(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=u[u.length-1];if("top"===t.insertAt)r?r.nextSibling?n.insertBefore(e,r.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),u.push(e);else if("bottom"===t.insertAt)n.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=i(t.insertAt.before,n);n.insertBefore(e,o)}}function d(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=u.indexOf(t);e>=0&&u.splice(e,1)}function h(t){var e=document.createElement("style");if(void 0===t.attrs.type&&(t.attrs.type="text/css"),void 0===t.attrs.nonce){var r=function(){0;return n.nc}();r&&(t.attrs.nonce=r)}return v(e,t.attrs),p(t,e),e}function v(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n])})}function b(t,e){var n,r,o,i;if(e.transform&&t.css){if(!(i=e.transform(t.css)))return function(){};t.css=i}if(e.singleton){var u=a++;n=s||(s=h(e)),r=m.bind(null,n,u,!1),o=m.bind(null,n,u,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(t){var e=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",v(e,t.attrs),p(t,e),e}(e),r=function(t,e,n){var r=n.css,o=n.sourceMap,i=void 0===e.convertToAbsoluteUrls&&o;(e.convertToAbsoluteUrls||i)&&(r=f(r));o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var s=new Blob([r],{type:"text/css"}),a=t.href;t.href=URL.createObjectURL(s),a&&URL.revokeObjectURL(a)}.bind(null,n,e),o=function(){d(n),n.href&&URL.revokeObjectURL(n.href)}):(n=h(e),r=function(t,e){var n=e.css,r=e.media;r&&t.setAttribute("media",r);if(t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}.bind(null,n),o=function(){d(n)});return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e)}else o()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=o()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=l(t,e);return c(n,e),function(t){for(var o=[],i=0;i<n.length;i++){var s=n[i];(a=r[s.id]).refs--,o.push(a)}t&&c(l(t,e),e);for(i=0;i<o.length;i++){var a;if(0===(a=o[i]).refs){for(var u=0;u<a.parts.length;u++)a.parts[u]();delete r[a.id]}}}};var y=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}();function m(t,e,n,r){var o=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=y(e,o);else{var i=document.createTextNode(o),s=t.childNodes;s[e]&&t.removeChild(s[e]),s.length?t.insertBefore(i,s[e]):t.appendChild(i)}}},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,r=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var o,i=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?t:(o=0===i.indexOf("//")?i:0===i.indexOf("/")?n+i:r+i.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")})}}]);
```

可以看见sass文件已经转成了css文件，并且内嵌进了js文件中，但是因为js要将css插入页面渲染，所以多了一堆的代码，这样很不利于优化，所以我们接下来将css文件抽离出js文件。

### mini-css-extract-plugin
这里我们使用的是 mini-css-extract-plugin，首先进行安装。

> yarn add mini-css-extract-plugin --dev

安装完成后，进行webpack配置，如下：
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getPathByRoot = function(targetPath) {
    path.resolve(__dirname, '../', targetPath)
}

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/js/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.(sc|c)ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),

        new MiniCssExtractPlugin({
            filename: 'static/css/main.[hash].css'
        })
    ]
}
```

在plugins中实例化了 **MiniCssExtractPlugin** 并且设置了打包后的名称，以及在rules中修改了最终的loader。

执行打包命令后，可以看见，dist目录下static目录中多了一个index.css文件，并且index.html也自动引入了这个css文件，并且js文件的体积也小了很多。

![a1](https://user-images.githubusercontent.com/23492006/46661600-159aff80-cbec-11e8-9ac8-552c25f68e0d.png)

### file-loader url-loader
对于文件的处理，可以使用 **url-loader** 和 **file-loader**，**url-loader** 可以将很小的icon文件转换成base64编码内联进js文件中，这样可以减少http的请求次数，**file-loader** 可以制定一个可以让文件输出的路径便于管理，更加好用的功能是可以使用import 或者 require 图片文件。首先安装依赖：

> yarn add file-loader url-loader --dev

其次进行webpack的配置：
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getPathByRoot = function (targetPath) {
    path.resolve(__dirname, '../', targetPath)
}

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/js/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /.(sc|c)ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash].[ext]',
                        outputPath: 'static/images',
                        fallback: 'file-loader',
                    }
                }
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),

        new MiniCssExtractPlugin({
            filename: 'static/css/main.[hash].css'
        })
    ]
}
```

可以看见首先对于文件，使用了url-loader，如果文件体积小于8192b 也就是 8kb 左右，那么url-loader会将图片转换为base64内联进js文件中，如果文件大于设定的值，那么就会将文件交给file-loader处理，并且将options选项交给file-loader这个是url的使用方式。

做一个实验，在index.html文件中添加一个img标签,执行打包。如果图片大于8kb图片会被存储到dist/static/images目录下。

![a3](https://user-images.githubusercontent.com/23492006/46662422-f7ce9a00-cbed-11e8-94e3-dead0563e668.png)

如果文件小于8kb，那么文件会被内联到Html或者js中,这取决于是哪个类型的文件引用了这张图片。

![a2](https://user-images.githubusercontent.com/23492006/46662329-b211d180-cbed-11e8-8d36-e7caefad9780.png)


到这一步，一个项目最基础的几个功能都已经配置完成了，但是只是这样怎么行，没法高效率的开发，接下来就要介绍webpack-dev-server的用法了。

## HotModuleReplacementPlugin
热模块加载依赖于 **webpack-dev-server**，首先安装

> yarn add webpack-dev-server --dev

接下来进行webpack的配置：

```js
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getPathByRoot = function (targetPath) {
    path.resolve(__dirname, '../', targetPath)
}

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/js/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.(sc|c)ss$/,
            // use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            use: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash].[ext]',
                        outputPath: 'static/images',
                        fallback: 'file-loader',
                    }
                }
            ]
        }]
    },
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        publicPath: '/',
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),

        new MiniCssExtractPlugin({
            filename: 'static/css/index.[hash].css'
        }),

        new webpack.HotModuleReplacementPlugin()
    ]
}
```

首先require了webpack模块，因为 **HotModuleReplacementPlugin** 是webpack内置的插件，所以不用引入。

其次将css解析的loader中，移除了 **MiniCssExtractPlugin.loader** ，改成了 **style-loader** ,将样式内联进html文档，这样做是为了热更新，如果是用了抽离css的 **MiniCssExtractPlugin.loader** ，就无法热更新了(之前配置是可以热更新的，但这次遇到了未知的情况，所以换一个处理方式)，不过这个问题，后期可以将开发以及生产的webpack分开配置来实现不同的需求。

然后添加了这些配置项
```json
{
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        publicPath: '/',
        hot: true,
    }
}
```

**inline-source-map** 的作用为将js文件打包后同时生成source map文件用于开发时的debugger，生产环境下建议不配置，后期也会将它抽离出公共的配置。 **devServer** 是用于配置开发环境下的配置项，更多的参数可以查看官方文档，这里不做详细介绍。

最后配置package.json的script，用于快速启动开发服务：

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config ./build/webpack.base.js --mode=production",
    "dev": "webpack-dev-server --config ./build/webpack.base.js --mode=development --color --open"
},
```

此时运行
> npm run dev

打开控制台提示的运行的地址
> Project is running at http://localhost:8080/

打开这个地址就能够看到站点了，同时修改js文件以及css文件，可以看见页面的同步更改。

# 优化
完成上面的步骤基本上已经可以进行开发和生产了，但是对于工程的优化可不能停下脚步，所以得进行以下步骤。

## 抽离不同的配置项
就像之前说过的，维护一个公共的配置项，非公共的配置项抽离成几个不同的功能以适应不同的需求。这里需要使用到webpack-merge功能，先进行依赖的安装

> yarn add webpack-merge --dev

新建三个文件，分别是 **webpack.pro.js** 用于配置打包生产环境的文件， **webpack.dev.js** 用于配置开发环境的文件，**utils** 用于抽离公共的工具函数。文件如下：

```js
// utils.js

const path = require('path')

module.exports.getPathByRoot = function (targetPath) {
    return path.resolve(__dirname, '../', targetPath)
}
```

```js
// webpack.base.js

const HtmlWebpackPlugin = require('html-webpack-plugin')
const getPathByRoot = require('./utils').getPathByRoot

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/js/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash].[ext]',
                        outputPath: 'static/images',
                        fallback: 'file-loader',
                    }
                }
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
```

```js
// webpack.pro.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base')

module.exports = merge(webpackBaseConfig, {
    module: {
        rules: [{
            test: /\.(sc|c)ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/index.[hash].css'
        })
    ]
})
```

```js
// webpack.dev.js

const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base')

module.exports = merge(webpackBaseConfig, {
    module: {
        rules: [{
            test: /\.(sc|c)ss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }]
    },
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        publicPath: '/',
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})
```

修改package.json的script：
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config ./build/webpack.pro.js --mode=production",
    "dev": "webpack-dev-server --config ./build/webpack.dev.js --mode=development --color --open"
}
```

主要是修改了使用的配置文件为pro 和 dev 文件。

## 打包前删除之前的文件
每次打包如果文件修改了，那么就会修改文件的hash值，所以文件不会存在冲突的情况，所以上一次打包的文件还会存在于dist目录，这样会造成打包后的文件过大不便于管理，也有可能因为浏览器缓存的原因，请求的是之前的文件，所以得将之前的打包文件删除掉，所以这里我们需要使用到 **clean-webpack-plugin**，首先安装依赖。

> yarn add clean-webpack-plugin --dev

然后修改配置项：

```js
// webpack.pro.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base')
const WebpackCleanPlugin = require('clean-webpack-plugin')
const getPathByRoot = require('./utils').getPathByRoot

module.exports = merge(webpackBaseConfig, {
    module: {
        rules: [{
            test: /\.(sc|c)ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/index.[hash].css'
        }),

        new WebpackCleanPlugin(getPathByRoot('./dist'), {
            allowExternal: true
        })
    ]
})
```

运行打包命令，可以看见在打包之前，删除了dist目录。

## 打包后GZIP压缩静态资源
gzip的压缩，可以极大的减少http请求的size，优化站点的加载速度，需进行以下配置:

先安装依赖 **compression-webpack-plugin**

> yarn add compression-webpack-plugin@1.1.12 --dev

这里指定版本号为1.1.12，因为2.0的版本在我这个环境下报错了，所以使用1.1.12

其次修改webpack配置：

```js
//webpack.pro.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base')
const WebpackCleanPlugin = require('clean-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const getPathByRoot = require('./utils').getPathByRoot

module.exports = merge(webpackBaseConfig, {
    module: {
        rules: [{
            test: /\.(sc|c)ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }]
    },
    plugins: [
        new CompressionPlugin({
            test: [/\.js$/, /\.css$/],
            asset: '[path].gz',
            algorithm: 'gzip'
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/main.[hash].css'
        }),

        new WebpackCleanPlugin(getPathByRoot('./dist'), {
            allowExternal: true
        })
    ]
})

```

完成配置后就可以打包出gzip文件了，不过还得nginx服务器打开gzip的支持才行。

## 查看webpack打包进度
使用 **progress-bar-webpack-plugin** 插件，首先安装

> yarn add progress-bar-webpack-plugin --dev

其次修改webpack配置：
```js
// webpack.base.js

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const getPathByRoot = require('./utils').getPathByRoot

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/js/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /\/node_modules/,
            use: ['babel-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash].[ext]',
                        outputPath: 'static/images',
                        fallback: 'file-loader',
                    }
                }
            ]
        }]
    },
    plugins: [
        new ProgressBarPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
```

进度条就添加了。

## 抽离公共依赖项
因为是模块式的开发，对于jquery vue等库的文件，需要多次引入，如果不提取公共依赖项，那么就会导致每个js文件中都会有这两个库的文件。如果提取出来，将会大大减少文件的体积，优化浏览器的下载速度，而且可以将公共依赖项设置成强缓存，可以进一步减少http请求的开支，下面我们就添加这个功能，代码如下：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const getPathByRoot = require('./utils').getPathByRoot

module.exports = {
    entry: getPathByRoot('src/index.js'),
    output: {
        filename: 'static/js/index.[hash].js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /\/node_modules/,
            use: ['babel-loader']
        }, {
            test: /\.html$/,
            use: ['html-loader']
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash].[ext]',
                        outputPath: 'static/images',
                        fallback: 'file-loader',
                    }
                }
            ]
        }]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'commons',
            filename: 'static/js/[name].[hash].js'
        }
    },
    plugins: [
        new ProgressBarPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
```

因为在webpack4.0中提取公共文件已经是内置功能了，所以不需要插件。只需要在配置文件中插入这样的一个配置就行：

```json
optimization: {
    splitChunks: {
        chunks: 'all',
        name: 'commons',
        filename: 'static/js/[name].[hash].js'
    }
},
```

安装jqery 和 vue进行一次测试
> yarn add jquery vue

然后在src/index.js中引入这两个库文件。

```js
import './index.scss'
import $ from 'jquery'
import Vue from 'vue'

new Vue({
    el: '#app'
})

$('#app').on('click', function() {
    
})
```

运行打包命令后查看js文件会发现多出了一个common.js文件，打开可以看见内容只包含了jquery 和 vue 的源码，打开打包后的index.html也可以看见引入了common.js文件，说明提取公共依赖项成功了。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
<link href="./static/css/main.bf73755b575b70e4fc39.css" rel="stylesheet"></head>
<body>
    <img src="./static/images/WechatIMG5.72047b6d3b0f1c1f1dc0a1fa9c81188f.png" alt="">
    <script type="text/javascript" src="./static/js/commons.bf73755b575b70e4fc39.js"></script>
    <script type="text/javascript" src="./static/js/index.bf73755b575b70e4fc39.js"></script>
</body>
</html>
```

![a4](https://user-images.githubusercontent.com/23492006/46663106-d1a9f980-cbef-11e8-8e21-3deac19b522e.png)

## 查看打包后的文件结构

使用 **webpack-bundle-analyzer** 插件，可以查看到打包后的js文件的内部细节，可以很清楚的分析哪些细节可以优化，首先安装依赖。

> yarn add webpack-bundle-analyzer --dev

然后进行webpack配置

```js
//webpack.pro.js

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base')
const WebpackCleanPlugin = require('clean-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const getPathByRoot = require('./utils').getPathByRoot

module.exports = merge(webpackBaseConfig, {
    module: {
        rules: [{
            test: /\.(sc|c)ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }]
    },
    plugins: [
        new CompressionPlugin({
            test: [/\.js$/, /\.css$/],
            asset: '[path].gz',
            algorithm: 'gzip'
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/main.[hash].css'
        }),

        new WebpackCleanPlugin(getPathByRoot('./dist'), {
            allowExternal: true
        }),

        new BundleAnalyzerPlugin()
    ]
})
```

运行打包后会打开浏览器有以下界面，可以很清楚的看见js文件的内容：
![wx20181009-172315](https://user-images.githubusercontent.com/23492006/46659849-51cc6100-cbe8-11e8-9248-d9e79d36efaa.png)

借用官方文档的动图，可以看见更直观的细节：
![gif](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)

# 结尾
到这里，基本的配置都已经完成了，如果你想实现更多的功能，就需要自己去探索啦。
工程地址：https://github.com/Richard-Choooou/teach-webpack

例外有两个之前配置的webpack脚手架可以看一看：

用于vue组件系统开发的webpack配置： https://github.com/Richard-Choooou/vue-component-webpack

多页面开发的webpack配置：https://github.com/Richard-Choooou/mpa-webpack4.0-config

