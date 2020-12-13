# 第 7 周｜重学 JavaScript（二）

## 本周作业

**必做：**

- 课堂练习
  1. [完成 StringToNumber 和 NumberToString 两个函数](./homework/1.html)
  2. [尝试找出 JavaScript 引擎里面 Realm 所有的对象，使用一个 JS 数据可视化的框架去做一个可视化](./homework/2.html)

## 本周总结

本周学习了 `JavaScript` 语言的构成，是如何从最小的单位，逐渐构造成一个完整的语言的。

- Atom
- Expression
- Statement
- Structure
- Program/Module

### Atom

#### Grammer - 语法

- `Grammer Tree vs Priority` - 语法树跟运算符优先级的关系
  - 运算符优先级会影响到语法树的构成，在 `JavaScript` 标准中使用产生式来描述运算符的优先级

#### Runtime - 运行时

- `Type Convertion` - 类型转换
- `Reference` - 引用类型

### Expression

- `Member`
- `New`
- `Call` - 函数调用
- `Left hand side & Right hand side` - 左值和右值的区别
  - 能放在语句左边的表达式就是 `Left Handside Expression`
  - 几乎所有 `Left Handside Expression` 都是 `Right Handside Expression`
- `Update` - 自增自减运算
  - a++
  - a--
- `Unary` - 单目运算
  - delete a.b
  - voide foo()
  - typeof a
  - \- a
  - \- a
  - ~ a
  - ! a
  - await a
- `Exponental` - 乘方运算，唯一一个右结合的运算符
  - \*\*
- `Multiplicative` - 乘法运算
  - \*
  - /
  - %
- Additive - 加法运算
  - \+
  - -
- `Shfit` - 移位运算
  - <<, >>, >>>
- `Relationshop` - 关系运算
  - <, >, <=, >=
  - instanceof, in
- `Equality` - 比较运算
  - ==
  - !=
  - ===
  - !==
- `Bitwise` - 位运算
  - &
  - ^
  - |
- `Logical` - 逻辑运算
  - &&
  - ||
- `Conditional` - 三目运算
  - ? :

### Statement

#### Grammar

- 简单语句 - 不会再容纳其他语句的语句
  - ExpressionStatement
  - EmptyStatement
  - DebuggerStatement
  - ThrowStatement
  - ContinueStatement
    - \[\[type]]: break continue
    - \[\[value]]: --
    - \[\[target]]: label
  - BreakStatement
    - \[\[type]]: break continue
    - \[\[value]]: --
    - \[\[target]]: label
  - ReturnStatement
- 组合语句
  - BlockStatement
    - \[\[type]]: normal
    - \[\[value]]: --
    - \[\[target]]: --
  - IfStatement
  - SwitchStatement
    - \[\[type]]: break continue
    - \[\[value]]: --
    - \[\[target]]: label
  - IterationStatement
    - \[\[type]]: break continue
    - \[\[value]]: --
    - \[\[target]]: label
  - WithStatement
  - LabelledStatement
    - \[\[type]]: break continue
    - \[\[value]]: --
    - \[\[target]]: label
  - TryStatement
    - \[\[type]]: return
    - \[\[value]]: --
    - \[\[target]]: label
- 声明
  - FunctionDeclaration
    - function
  - GenratorDeclaration
    - function\*
  - AsyncFunctionDeclaration
    - async function
  - AsyncGeneratorDeclaration
    - async function\*
  - VariableStatement
    - var
  - ClassDeclaration
    - class
  - LexicalDeclaration
    - const
    - let

#### Runtime

- `Completion Record` - 语句执行结果的记录
  - \[\[type]]: normal, break, continue, return, or throw
  - \[\[value]]: 基本类型
  - \[\[target]]: label
- `Lexical Environment` - 作用域

### Structure

- JS 执行粒度
  - 宏任务 - `MacroTask`
    - 把代码塞给引擎并且执行的整个过程
  - 微任务（`Promise`） - `MicroTask`
    - 在 `JavaScript` 只有 `Promise` 会产生微任务
  - 函数调用 - `Execution Context`
  - 语句/声明 - `Completion Record`
  - 表达式 - `Reference`
  - 直接量/变量/this ......
- 事件循环

### Program/Module

#### 函数调用（Call）

- `Execution Context Stack` - 执行上下文栈
  - Running Execution Context
    - 栈顶的 `Execution Context` 就是我们能访问到的所有的变量，也被称为：`Running Execution Context`
  - `Execution Context` - 执行上下文
    - Code Evaluation State
      - 用于 `async` 和 `generator` 函数，保存代码执行到哪里了的信息
    - Function
      - `function` 初始化
    - Script or Module
      - `scriot` 和 `module` 两种部分代码的信息
    - Generator
      - `generator 函数`每次执行时创建并保存的信息
    - Realm
      - 保存我们所有使用内置对象的领域
    - Lexical Environment
      - 执行代码时所需要访问的环境，用于保存变量
    - Variable Environment
      - `var` 关键词声明变量，声明到哪的信息
- Environment Record
  - `Declarative Environment Records`（最常见的，Block, Function, Module）
    - Function Environment Records
    - Module Environment Records
  - Global Environment Records
  - Object Environment Records

#### 函数闭包（Closure）

- `Environment Recode` - 环境部分
- `Code` - 代码部分

#### Realm

在 `JavaScript` 中，函数表达式和对象直接量都会创建对象。使用 `.` 做隐式转换也会创建对象。
这些对象也是有原型的，如果我们没有 `Realm`，就不知道它们的原型是什么。

```js
var x = {}; // 创建了一个 Object 对象

1.toString(); // 自动装箱产生 Number 对象
```
