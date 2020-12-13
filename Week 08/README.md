# 第 8 周｜浏览器工作原理（一）

## 本周作业

**必做：**

- [Toy-Browser - 玩具浏览器（1/3）](./homework/toy-browser/part1/index.js)

## 本周总结

本周学习了浏览器的工作原理之 状态机处理字符串、HTTP 协议解析和如何实现 HTPP 请求。

### 浏览器

浏览器（以 Toy-Browser 为例）是由以下五个步骤，完成整体的渲染：

- URL
  - HTTP
- HTML
  - parse
- DOM
  - css computing
- DOM with CSS
  - layout
- DOM with position
  - render
- Bitmap

当我们打开浏览器，访问某个网址时，从计算机到显示器屏幕，最后显示的一定是图片的形式，计算机术语叫做 `Bitmap - 位图`。只有将这个东西传递给显卡驱动设备，才能转换成我们人眼可以识别的光信号，也就是在显示器屏幕上所能看到具体网站的网页内容。
