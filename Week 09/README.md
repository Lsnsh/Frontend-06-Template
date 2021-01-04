# 第 9 周｜浏览器工作原理（二）

## 本周作业

**必做：**

- [HTML 解析 ｜ HTML Parse 模块的文件拆分](./homework/toy-browser/parser/1.js)
- [HTML 解析 ｜ 用 FSM 实现 HTML 的分析](./homework/toy-browser/parser/2.js)
- [HTML 解析 ｜ 解析标签](./homework/toy-browser/parser/3.js)
- [HTML 解析 ｜ 创建元素](./homework/toy-browser/parser/4.js)
- [HTML 解析 ｜ 处理属性](./homework/toy-browser/parser/5.js)
- [HTML 解析 ｜ 用 token 构建 DOM 树](./homework/toy-browser/parser/6.js)
- [HTML 解析 ｜ 将文本节点追加到 DOM 树](./homework/toy-browser/parser/7.js)
- [CSS 计算 ｜ 收集 CSS 规则](./homework/toy-browser/parser/8.js)
- [CSS 计算 ｜ 添加调用](./homework/toy-browser/parser/9.js)
- [CSS 计算 ｜ 获取父元素序列](./homework/toy-browser/parser/10.js)
- [CSS 计算 ｜ 选择器与元素的匹配](./homework/toy-browser/parser/11.js)
- [CSS 计算 ｜ 计算选择器与元素匹配](./homework/toy-browser/parser/12.js)
- [CSS 计算 ｜ 生成 computed 属性](./homework/toy-browser/parser/13.js)
- [CSS 计算 ｜ specificity 的计算逻辑](./homework/toy-browser/parser/14.js)

## 本周总结

上周已经实现了从 `HTTP Request` 到 `HTTP Response Body` 的过程，本周的目标是将 `HTTP Response` 返回的 `HTML` 纯文本，经过成 `HTML 解析` 和 `CSS 计算` 最终得到一颗带样式的 `DOM` 树。

### HTML Parse

```html
<html lang="en">
  <head>
    <title>Document</title>
    <style>
      body div #title {
        font-size: 24px;
        font-weight: 500;
        color: red;
      }
      body div p {
        color: green;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <p id="title">Helll World!</p>
      <p>--by Lsnsh</p>
    </div>
  </body>
</html>
```

将 `HTML` 文本解析并生成一颗 `DOM` 树结构的数据。

#### 第一步-HTML Parse 模块的文件拆分

```js
const response = await request.send();

const dom = parser.parseHTML(response.body;
```

为了便于理解和完成，我们在 `API` 的调用上，是将请求得到的完整 `HTTP Response Body`（`HTML` 文本），交由 `HTML Parse` 模块中的 `parseHTML()` 方法处理。

**注意：如果是实际的浏览器是会逐段（异步）的返回 `HTTP Response Body`（`HTML` 文本）然后逐段的去处理（`Parse`）。**

总结：

- 文件拆分-为了方便文件管理，我们将 `HTML Parse` 单独拆分到一个文件中
- 接口定义-`parseHTML`会接收 `HTML 文本` 作为参数，返回值是一颗 `DOM` 树

#### 第二步-用 FSM 实现 HTML 的分析

通过查阅 [HTML 标准](https://html.spec.whatwg.org/multipage/)的 `Tokenization` 章节，我们得知一共有八十个相关状态的定义，，我们会从中选取一部分状态去实现对应的逻辑，不会全部实现。

```js
// ...
module.exports = {
  parseHTML(html) {
    // 初始状态
    let state = data;
    for (let c of html) {
      state = state(c);
    }
    // 最终状态
    state = state(EOF);
  },
};
```

总结：

- 使用 `FSM`（有限状态机）来实现 `HTML` 的分析
- 在 `HTML` 标准中，已经规定了 `HTML` 有哪些状态，不用我们自行去设计状态机的状态
- `Toy-Browser` 只会选取其中一部分，完成一个最简版本

#### 第三步-解析标签

`HTML` 中的标签大概有三种分别是：开始标签、结束标签、自封闭标签，这一节会使用状态机来区分这三种标签。

1. data
2. tagOpen
3. endTagOpen
4. tagName
5. beforeAttributeName
6. selfClosingStartTag
7. EOF

```js
const EOF = Symbol("EOF");
```

涉及到的状态目前有以上这七种，其中 `data` 表示初始状态，`EOF` 是终止状态：

在 HTML 中有效的空白符有四种分别是：`\t`（Tab 制表符）、`\n`（换行符）、`\f`（Forbidden 禁止符）、` `（空白符）

```js
// 匹配标签内容间的空白符
if (c.match(/^[\r\t\f ]$/)) {
  // 属性名匹配-开始状态
  return beforeAttributeName;
}
```

总结：

- 主要的标签有：开始标签、结束标签、自封闭标签
- 在这一步中我们暂时忽略属性和文本节点的处理
- 状态机的各个状态能走通，等待添加具体的逻辑

#### 第四步-创建元素

在状态机的各个状态中，我们会创建并完善 `token` 最后调用 `emit()` 方法提交，`token` 对象的数据结构如下：

```ts
const token: {
  type: string; // 标签类型（startTag、endTag、text、EOF）
  tagName: string; // 标签名
  content: string; // 标签内容
  isSelfClosing: boolean; // 标记是否为自封闭标签
};
```

总结：

- 在状态机中，除了状态迁移，我们还要会加入业务逻辑（在 `HTML Parse` 中就是创建并完善 `token`）
- 在标签结束状态时提交标签 `token`，需要注意的是不是在结束标签时提交，而是在开始标签、结束标签、自封闭标签的结束状态时提交

#### 第五步-处理属性

使用状态机处理属性，是词法分析的最后一个步骤，涉及到一些状态机使用技巧和 HTML 解析比较特有的地方，新增了以下几个属性相关的状态：

8. attributeName
9. afterAttributeName
10. beforeAttributeValue
11. doubleQuotesAttributeValue
12. singleQuotesAttributeValue
13. afterQuotesAttributeValue
14. noQuotesAttributeValue

总结：

- 属性值分为双引号、单引号、无引号三种写法，有对应的状态处理
- 处理属性的方法跟处理标签类似，使用全局变量暂存属性数据
- 属性结束时，才会将全局变量暂存的属性数据，添加到 `token` 上

#### 第六步-用 token 构建 DOM 树

上一步之后已经完成了对 `HTML` 初步的解析，这个解析在编译原理中叫做词法分析；接下来开始进行的就是 `HTML` 的语法分析了，基于已经准备好的 `token` 来构建一颗 `DOM` 树。

`HTML` 这个语言的语法分析是非常简单的，语法使用一个栈就可以处理；但是在实际的浏览器中，光用一个栈是不行的，还需要加很多的特殊处理（eg: 标签未封闭时自动封闭等处理）。

用栈构建 `DOM` 树的原理：

完整的 `DOM` 树结构可以看 [HTML 标准](https://html.spec.whatwg.org/multipage/)中 `Tree construction` 这一节的内容，介绍了在各种情况下该如何去配对这些标签。

总结：

- 从标签构建 `DOM` 树的基本技巧是使用栈
- 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
- 自封闭节点可视为入栈后立即出栈
- 任何元素的父元素都是它入栈前的栈顶位置的元素

#### 第七步-将文本节点追加到 DOM 树

### CSS Compute

```html
<style>
  body div #title {
    font-size: 24px;
    font-weight: 500;
    color: red;
  }
  body div p {
    color: green;
  }
</style>
```

解析 `style` 标签中的选择器和样式，经过解析和计算后，将其追加到 `DOM`树上对应的 `Element` 上。

#### 第一步-收集 CSS 规则

#### 第二步-添加调用

#### 第三步-获取父元素序列

#### 第四步-选择器与元素的匹配

#### 第五步-计算选择器与元素匹配

#### 第六步-生成 computed 属性

#### 第七步-specificity 的计算逻辑
