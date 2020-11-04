# 第 2 周｜编程与算法训练

## 本周作业

**必做：**

- 每课练习
  1. [实现一个地图编辑器](./homework/pathfinding-algorithm-visualization/1.html)
  2. [广度优先搜索](./homework/pathfinding-algorithm-visualization/2.html)
  3. [通过异步编程将寻路算法可视化](./homework/pathfinding-algorithm-visualization/3.html)
  4. 启发式搜索（一）
  5. 启发式搜索（二）

**选做**

- 优化现有代码，找最短路径（提示：「碰到墙壁或者走过路」部分的代码要调整）
- 将 Sorted 替换成更好的数据结构（建议：二叉堆）

## 本周总结

本周学习了`寻路算法`和通过`异步编程将寻路算法可视化`

## 遇到的问题

1. macOS 触控板无法触发鼠标左键和右键的 keydown 事件？

查阅了 `MDN` 文档，使用触控板时不会触发事件 `keydown` 事件：

https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent

于是改用 pointerdown 指针事件，支持鼠标、触控板、触控屏幕等：

https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_events
