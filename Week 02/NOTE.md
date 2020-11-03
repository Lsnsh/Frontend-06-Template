# 学习笔记

## 遇到的问题

1. macOS 触控板无法触发鼠标左键和右键的 keydown 事件？

查阅了 `MDN` 文档，使用触控板时不会触发事件 `keydown` 事件：

https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent

于是改用 pointerdown 指针事件，支持鼠标、触控板、触控屏幕等：

https://developer.mozilla.org/zh-CN/docs/Web/API/Pointer_events
