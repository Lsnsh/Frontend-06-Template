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

总结：

- 文本节点与自封闭标签处理类似（不需要入栈出栈）
- 多个文本节点需要合并

### CSS Computing

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

`CSS Computing` - `CSS` 计算，就是把 `CSS` 规则中所包含的 `CSS` 属性应用到匹配这些选择器的元素上去，最后生成一颗带 `CSS` 属性的 `DOM` 树。

备注：如果将所有 `CSS` 属性都写在 `style` 属性中，想完成渲染的话，可以不需要经历这一步（CSS Parser），经历这一步是为了更好的了解背后的原理。

#### 第一步-收集 CSS 规则

到目前为止我们生成的 `DOM` 树中，只包含 `HTML` 语言里描述的哪些语义信息，我们要想完成渲染，我们还需要得到 `CSS` 的信息。

要想完成 CSS 计算，需要对 CSS 进行语法和词法分析，这里我们直接使用 `npm` 上名为 `css` 的包，其实是一个 `CSS Parser`，能够帮我将 `CSS` 的代码解析成 `AST 抽象语法树`，便于我们从中提取出各种 `CSS` 规则，然后应用到我们的 HTML 元素上。

环境准备：

```
npm i css
```

`CSS Parse` 后得到的 `AST 抽象语法树`：

```json
{
  "type": "stylesheet",
  "stylesheet": {
    "rules": [
      {
        "type": "rule",
        "selectors": ["body div #title"],
        "declarations": [
          {
            "type": "declaration",
            "property": "font-size",
            "value": "24px",
            "position": {
              "start": {
                "line": 3,
                "column": 9
              },
              "end": {
                "line": 3,
                "column": 24
              }
            }
          },
          {
            "type": "declaration",
            "property": "font-weight",
            "value": "500",
            "position": {
              "start": {
                "line": 4,
                "column": 9
              },
              "end": {
                "line": 4,
                "column": 25
              }
            }
          },
          {
            "type": "declaration",
            "property": "color",
            "value": "red",
            "position": {
              "start": {
                "line": 5,
                "column": 9
              },
              "end": {
                "line": 5,
                "column": 19
              }
            }
          }
        ],
        "position": {
          "start": {
            "line": 2,
            "column": 7
          },
          "end": {
            "line": 6,
            "column": 8
          }
        }
      },
      {
        "type": "rule",
        "selectors": ["body div p"],
        "declarations": [
          {
            "type": "declaration",
            "property": "color",
            "value": "green",
            "position": {
              "start": {
                "line": 8,
                "column": 9
              },
              "end": {
                "line": 8,
                "column": 21
              }
            }
          }
        ],
        "position": {
          "start": {
            "line": 7,
            "column": 7
          },
          "end": {
            "line": 9,
            "column": 8
          }
        }
      }
    ],
    "parsingErrors": []
  }
}
```

总结：

- 遇到 `style` 标签时，我们把 `CSS` 规则保存起来
- 这里我们选择使用现成 `CSS Parser` 来分析 `CSS` 规则
- 需要看懂 `CSS Parser` 解析后的 `AST 抽象语法树` 中各字段代表的含义

#### 第二步-添加调用

总结：

- 当我们创建一个元素后，立即计算 `CSS`
- 理论上（假设），当我们分析一个元素时，所有 `CSS` 规则已经收集完毕
- 在真实浏览器中，可能遇到写在 `body` 中的 `style` 标签，需要重新 `CSS` 计算的情况，这里我们忽略

#### 第三步-获取父元素序列

```css
/* 从 #title 开始匹配，能最快的找到满足条件的元素 */
body div #title
```

- 在 `computeCSS` 函数中，我们必须要知道元素的所有父元素才能判断元素与规则是否匹配
- 我们从上一步骤的 `stack`，可以获取当前元素所有的父元素
- 因为我们首先获取的是“当前元素”，所以我们获取和计算父元素匹配的顺序是从从内向外

#### 第四步-选择器与元素的匹配

```js
// 'body div #title' => ['#title', 'div', 'body']
const selectorParts = rule.selectors[0].split(" ").reverse();
// ...
```

总结：

- 选择器也要从当前元素向外排列
- 复杂选择器拆成针对单个元素的选择器，用循环来匹配父元素队列

#### 第五步-计算选择器与元素匹配

总结：

- 根据选择器的类型和元素属性，计算是否与当前元素匹配
- 这里仅仅是实现了三种基本选择器，实际浏览器中要处理复合选择器等更多情况
- 作业（可选）：实现复合选择器，实现支持空格的 `class` 选择器

#### 第六步-生成 computed 属性

总结：

- 一旦选择器匹配，就会将应用选择器到元素上，形成 `computedStyle`

#### 第七步-specificity 的计算逻辑

上一节中我们已经生成了 `computedStyle`，但是样式（选择器）的优先级还没有处理，即后面的样式不一定可以覆盖前面的样式，要根据选择器 `specificity - 专指的程度/特异性` 来决定，我们知道 `id` 选择器的优先级高于 `class` 和 `元素名称` 选择器，但是具体高多少呢？

以前一直都接收了网络上对于 CSS 选择器"权重"的解释，即认为：

- 内联样式，“权重”是 1000
- id 选择器。"权重"是 100
- class 选择器，"权重"是 10
- 元素名称选择器，"权重"是 1

```css
body div #title {
  color: red;
}
```

以上面代码为例，，选择器出现级联时，将其各选择器的"权重"相加，得到最终的"权重"为 `1 + 1 + 100 = 102`。那么对于应用在同一个元素上，"权重"大一定能覆盖"权重"小的么？

```html
<html lang="en">
  <head>
    <style>
      body div #title {
        color: red;
      }
      body div p.c1.c2.c3.c4.c5.c6.c7.c8.c9.c10.c11 {
        color: green;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <p id="title" class="c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11">Helll World!</p>
    </div>
  </body>
</html>
```

以以上代码为例，实际运行 p 标签的文字颜色是 `red` 而不是 `green`，这是因为我们对于 `specificity` 的计算理解上出了一点偏差，`specificity` 是一个四元组 `a, b , c, d`：

- a = 元素有内联 `style` 属性样式时为 `1`，没有则为 `0`
- b = `ID` 选择器的数量
- c = 属性、类、伪类选择器的数量
- d = 元素名称和伪元素选择器的数量

计算 `specificity` ：

```css
body div #title  /* a=0 b=1 c=0 d=2 -> specificity = 0,1,0,2 */
body div p.c1.c2.c3.c4.c5.c6.c7.c8.c9.c10.c11 /* a=0 b=0 c=11 d=3 -> specificity = 0,0,11,3 */
```

比较 `specificity`：

- 0,1,0,2
- 0,0,11,3

从 `a` 开始比较大小，一旦得出大小就停止比较，不再继续往下比较，最终得到是 `0,1,0,2` > `0,0,11,3`，这也解释了为什么 p 标签的文字颜色是 `red` 而不是 `green`了 —— 实际“计算”时“权重”不会进位，因为“个十百千位”上表示的是选择器的数量，彼此之间是不存在进位关系的。

总结：

- CSS 规则根据 specificity 和后来者优先级更高，两种因素相结合决定是否覆盖
- [w3c - 计算选择器的特异性 - Calculating a selector's specificity](https://www.w3.org/TR/CSS22/cascade.html#specificity)

最后打印得到的 `DOM` 树结构是这样的：

```json
{
  "type": "document",
  "children": [
    {
      "type": "element",
      "tagName": "html",
      "children": [
        {
          "type": "text",
          "content": "\n  "
        },
        {
          "type": "element",
          "tagName": "head",
          "children": [
            {
              "type": "text",
              "content": "\n    "
            },
            {
              "type": "element",
              "tagName": "title",
              "children": [
                {
                  "type": "text",
                  "content": "Toy-Browser"
                }
              ],
              "attributes": [],
              "parent": null,
              "computedStyle": {}
            },
            {
              "type": "text",
              "content": "\n    "
            },
            {
              "type": "element",
              "tagName": "style",
              "children": [
                {
                  "type": "text",
                  "content": "\n      body div #title {\n        font-size: 24px;\n        font-weight: 500;\n        color: red;\n      }\n      body div p {\n        color: green;\n      }\n    "
                }
              ],
              "attributes": [],
              "parent": null,
              "computedStyle": {}
            },
            {
              "type": "text",
              "content": "\n  "
            }
          ],
          "attributes": [],
          "parent": null,
          "computedStyle": {}
        },
        {
          "type": "text",
          "content": "\n  "
        },
        {
          "type": "element",
          "tagName": "body",
          "children": [
            {
              "type": "text",
              "content": "\n    "
            },
            {
              "type": "element",
              "tagName": "div",
              "children": [
                {
                  "type": "text",
                  "content": "\n      "
                },
                {
                  "type": "element",
                  "tagName": "p",
                  "children": [
                    {
                      "type": "text",
                      "content": "Helll World!"
                    }
                  ],
                  "attributes": [
                    {
                      "name": "id",
                      "value": "title"
                    }
                  ],
                  "parent": null,
                  "computedStyle": {
                    "font-size": {
                      "value": "24px",
                      "specificity": [0, 1, 0, 2]
                    },
                    "font-weight": {
                      "value": "500",
                      "specificity": [0, 1, 0, 2]
                    },
                    "color": {
                      "value": "red",
                      "specificity": [0, 1, 0, 2]
                    }
                  }
                },
                {
                  "type": "text",
                  "content": "\n      "
                },
                {
                  "type": "element",
                  "tagName": "p",
                  "children": [
                    {
                      "type": "text",
                      "content": "--by Lsnsh"
                    }
                  ],
                  "attributes": [],
                  "parent": null,
                  "computedStyle": {
                    "color": {
                      "value": "green",
                      "specificity": [0, 0, 0, 3]
                    }
                  }
                },
                {
                  "type": "text",
                  "content": "\n      "
                },
                {
                  "type": "element",
                  "tagName": "img",
                  "children": [],
                  "attributes": [
                    {
                      "name": "alt",
                      "value": "img"
                    },
                    {
                      "name": "isSelfClosing",
                      "value": true
                    }
                  ],
                  "parent": null,
                  "computedStyle": {}
                },
                {
                  "type": "text",
                  "content": "\n    "
                }
              ],
              "attributes": [
                {
                  "name": "id",
                  "value": "app"
                }
              ],
              "parent": null,
              "computedStyle": {}
            },
            {
              "type": "text",
              "content": "\n  "
            }
          ],
          "attributes": [],
          "parent": null,
          "computedStyle": {}
        },
        {
          "type": "text",
          "content": "\n"
        }
      ],
      "attributes": [
        {
          "name": "lang",
          "value": "en"
        }
      ],
      "parent": null,
      "computedStyle": {}
    },
    {
      "type": "text",
      "content": "\n"
    }
  ]
}
```
