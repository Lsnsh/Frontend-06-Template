# 第 10 周｜浏览器工作原理（三）

## 本周作业

**必做：**

- [排版 ｜ 根据浏览器属性进行排版](./homework/toy-browser/layout/1.js)
- [排版 ｜ 收集元素进行](./homework/toy-browser/layout/2.js)
- [排版 ｜ 计算主轴](./homework/toy-browser/layout/3.js)
- [排版 ｜ 计算交叉轴](./homework/toy-browser/layout/4.js)
- [渲染 ｜ 绘制单个元素](./homework/toy-browser/render/1.js)
- [渲染 ｜ 绘制 DOM 树](./homework/toy-browser/render/2.js)

## 本周总结

上周已经实现将 `HTTP Response` 返回的 `HTML` 纯文本，经过成 `HTML 解析` 和 `CSS 计算` 最终得到一颗带样式的 `DOM` 树。本周要在此基础上通过排版的计算得到一颗带位置的 `DOM` 树，最后渲染绘制出 `DOM` 树。

### 排版

- 分行
  - 根据主轴尺寸，把元素分行
  - 若设置 `no-wrap`，则强行分配进第一行
- 计算主轴
  - 找出所有 `flex` 元素
  - 把主轴方向的剩余尺寸按比例分配给这些元素
  - 若剩余空间为负数，所有 `flex` 元素为 `0`，等比压缩剩余元素
- 计算交叉轴
  - 根据每一行最大元素尺寸计算行高
  - 根据行高 `flex-align` 和 `item-align`，确定元素具体位置

### 渲染

- 绘制单个元素
  - 绘制需要依赖一个图形环境
  - 我们这里才用了 `npm` 包 `images`
  - 绘制在一个 `viewport` 上进行
  - 与绘制相关的属性：`background-color`、`border`、`background-image` 等
- 绘制 `DOM` 树
  - 递归调用子元素的绘制方法，完成 `DOM` 树的绘制
  - 忽略一些不需要绘制的节点
  - 实际浏览器中，文字绘制是难点，需要依赖字体库，我们这里忽略
  - 实际浏览器中，还会对一些图层做 `compositing`，我们这里也忽略了
