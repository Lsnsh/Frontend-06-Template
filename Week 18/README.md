# 第 18 周｜工具链（二）

本周学习了如何使用[单元测试工具 Mocha ][1]对代码进行单元测试以及如何使用[测试代码覆盖率工具 nyc ][2]来完善单元测试代码。

围绕以下两个场景，下面我们来看看对应的命令有什么用，又是如何搭建起来的：

- 我们写测试用例的时候，使用 `npm run coverage`
- 我们写业务代码的时候，使用 `npm run test`

```json
{
  // ...
  "scripts": {
    "test": "mocha --require @babel/register",
    "coverage": "nyc mocha --require @babel/register"
  },
  "devDependencies": {
    "@babel/core": "^7.13.8",
    "@babel/preset-env": "^7.13.9",
    "@babel/register": "^7.13.8",
    "mocha": "^8.3.1",
    "nyc": "^15.1.0"
  }
}
```

## 单元测试工具——Mocha

```bash
npm i --save-dev mocha
```

使用 `npx` 或者添加 `scripts` 调用安装在本地的 `Mocha` ，默认会基于当前目录，执行 `./test/test.js` 中的测试代码：

```bash
# 默认 ./test/test.js
npx mocha
# 手动指定 ./test/demo.js
npx mocha ./test/demo.js
```

### 支持 ES Module

`Mocha` 默认是不支持 `ES Module`，需要使用 `Babel` 来处理。和平常项目中不同的是，我们使用 `Mocha` 是在命令行中，并没有搭配 `Webpack` 之类的打包工具一起使用，所有使用的 `Babel` 工具也有所不同，安装一下依赖：

```bash
npm i --save-dev @babel/core @babel/register @babel/preset-env
```

配置 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env"]
}
```

然后在命令行中使用 `--require` 参数将 `Babel` 引入 `Mocha` 的运行时环境，使得我们在通过执行命令行跑测试单元测试的时候，也能使用 `Babel` 对代码进行转换：

```bash
npx mocha --require @babel/register
```

也可以将其添加到 `package.json`中：

```json
// ...
"scripts": {
    "test": "mocha --require @babel/register",
},
```

## 测试代码覆盖率工具——nyc

```bash
npm i --save-dev nyc
```

`nyc` 搭配 `Mocha` 使用，类似这样的用法：

```bash
npx nyc mocha
```

使用代码覆盖率工具，能够直观的看到我们写的单元测试代码，覆盖了我们项目代码的多少，以及部分代码还没有被覆盖，据此进一步完善我们的单元测试代码和修复我们项目代码中潜在的 `BUG`：

```bash
➜  unit-test-example git:(main) ✗ npm run coverage ./test/demo.js

> unit-test-example@1.0.0 coverage /Users/lsnsh/github/Frontend-06-Template/Week 18/homework/unit-test-example
> nyc mocha --require @babel/register "./test/demo.js"



  add function testing
    ✓ 1+2 should be 3
    ✓ -2+3 should be 1


  2 passing (5ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |      50 |      100 |      50 |      50 |
 add.js   |      50 |      100 |      50 |      50 | 6
----------|---------|----------|---------|---------|-------------------
```

**./test/demo.js:**

```js
var assert = require("assert");
import { add } from "../add.js";

describe("add function testing", function () {
  it("1+2 should be 3", function () {
    assert.strictEqual(add(1, 2), 3);
  });
});
```

**./add.js:**

```js
export function add(a, b) {
  return a + b;
}

export function mul(a, b) {
  return a * b;
}
```

### 支持 ES Module

目前我们使用的 [nyc][2] 是间接通过 `mocha --require @babel/register` 来达到支持 `ES Module` 的目的，其实它自己也有配套的插件 [babel-plugin-istanbul][3] 和 [nyc-config-babel][4]

```bash
npm i --save-dev babel-plugin-istanbul @istanbuljs/nyc-config-babel
```

修改 `.babelrc`:

```diff
{
  "presets": ["@babel/preset-env"],
+ "plugins": ["istanbul"]
}
```

添加 `.nycrc`：

```json
{
  "extends": "@istanbuljs/nyc-config-babel"
}
```

添加脚本：

```diff
// ...
"scripts": {
    "test": "mocha --require @babel/register",
+   "coverage": "nyc mocha"
},
```

[1]: https://mochajs.org/
[2]: https://www.npmjs.com/package/nyc
[3]: https://github.com/istanbuljs/babel-plugin-istanbul
[4]: https://www.npmjs.com/package/@istanbuljs/nyc-config-babel
