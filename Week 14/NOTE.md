# 第 14 周｜组件化（一）

## 本周作业

**必做：**

- [让组件支持 JSX 语法](./homework/jsx/main.js)
- [轮播组件（一）](./homework/carousel/js/1.js)
- [轮播组件（二）](./homework/carousel/js/2.js)
- [轮播组件（三）](./homework/carousel/js/3.js)
- [轮播组件（四）](./homework/carousel/js/4.js)

## 本周总结

本周学习了组件的基础知识，包含组件的基本概念和基本组成部分，以及 JSX 语法与组件相结合时项目环境如何配置、如何书写等。

## 组件基础

### 基本概念

一般来说我们认为组件是跟 `UI` 强相关的东西，可以理解为是一种特殊的模块或者对象，但是同时它即是模块又是对象；支持以树形结构来进行组合，并且具备一定的模板化配置的能力。

### 基本组成部分

- 对象
  - Properties - 属性
  - Methods - 方法
  - Inherit - 继承关系
- 组件
  - Properties
  - Methods
  - Inherit
  - Attribute
  - Config & State - 配置 & 状态
  - Event - 事件机制
  - Lifecycle - 生命周期
  - Children - 子组件/插槽

**对象与组件的区别：**

组件在对象的基础上，增加很多语义相关的概念，使得组件变成一种非常适合描述 `UI` 的概念
