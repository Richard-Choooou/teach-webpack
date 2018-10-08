# 前言
对于现代web前端工程化，webpack起到了绝大的作用，此篇文章致力于让你学习webpack的配置，能够从无到有的配置一套属于自己的webpack配置。

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

安装webpack依赖,推荐使用yarn
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
        filename: './static/index.js',
        path: getPathByRoot('dist'),
        publicPath: './'
    }
}
```
这是一个最简单的配置，引入了 node 的path模块，用于路径解析，定义了webpack入口文件，以及出口的路径及文件名。

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

## loaders
webpack的loader作用是，loader将通过匹配规则匹配到的文件中的字符串，经过自己的处理后，再交给下一个loader处理，所以最终得到的文件，是一个自己需要的文件。

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
        filename: './static/index.js',
        path: getPathByRoot('dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /.js$/,
            use: ['babel-loader']
        }]
    }
}
```

添加了一个module属性，其中有一个自动是rules，这里对应的需要匹配的文件，以及使用的loader，是一个数组，可以添加多个配置。

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

可以看看 es6 的 class 语法已经转换成了es5的代码，至此，babel就配置成功了。一个web前端项目肯定是少不了html文件的，所以结下来教大家处理html文件。

### html-loader 以及 html-webpack-plugin
html-loader可以解析html文档中的图片资源，交给其他的loader处理，如url-loader或者是file-loader处理。html-webpacl-plugin的功能是将一个html作为模版，打包完成后会将打包后的资源比如js css，自动添加进html文档中。首先进行安装

> yarn add html-loader html-webpack-plugin --dev

再向webpack.base.config中添加一下配置：
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
    <title>Document</title>
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
    <title>Document</title>
</head>
<body>
    
<script type="text/javascript" src="./static/index.js"></script></body>
</html>
```

在浏览器中打开项目，已经可以正常运行了。

![wx20181008-171737](https://user-images.githubusercontent.com/23492006/46601033-9d1a3d00-cb1e-11e8-8753-fe74d3feb883.png)

### css预处理器
预处理器作为前端css高效的工具，不可不用，这一节教学sass的安装与配置。首先安装sass的依赖以及style-loader。

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

再看看使用的loader的顺序，值得注意的是，在这个数组中，webpack使用的loader是倒叙执行的，也是就是先执行的sass-loader再执行的css-loader，其次才是style-loader，要是反过来，是会报错的哦。

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
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),

        new MiniCssExtractPlugin({
            filename: 'static/index.[hash].css'
        })
    ]
}
```

在plugins中实例化了 **MiniCssExtractPlugin** 并且设置了打包后的名称，以及在rules中修改了最终的loader。

执行打包命令后，可以看见，dist目录下static目录中多了一个index.css文件，并且index.html也自动引入了这个css文件，并且js文件的体积也小了很多。有一点忘记提到的是，可以在filename的值中添加[hash]这一字符串，可以将输出的文件添加一个hash值，以免浏览器获取到的是之前的缓存。


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
            filename: 'static/index.[hash].css'
        })
    ]
}
```

可以看见首先对于文件，使用file-loader处理，然后交给url-loader，如果文件体积小于8192b 也就是 8kb 左右，那么url-loader会将图片转换为base64内联进js文件中。

做一个实验，在index.html文件中添加一个img标签,执行打包。如果图片大于8kb图片会被存储到dist/static/images目录下，如果文件小于8kb，那么文件会被内联到Html或者js中,着取决于是哪个类型的文件引用了这张图片。
