# 第 3 周｜编程与算法训练

## 本周作业

**必做：**

- 课堂练习
  1. [使用 LL 算法构建 AST | 正则表达式](./homework/LL-algorithm-build-AST/1.html)
  2. [使用 LL 算法构建 AST | LL 词法分析](./homework/LL-algorithm-build-AST/2.html)
  3. [使用 LL 算法构建 AST | LL 语法分析（一）](./homework/LL-algorithm-build-AST/3.html)
  4. [使用 LL 算法构建 AST | LL 语法分析（二）](./homework/LL-algorithm-build-AST/4.html)

## 本周总结

本周学习了如何使用 `LL 算法`（Left Left，从左到右扫描，从左到右规约） 分析输入的四则运算表达式，来构建 `AST`（抽象语法树）。

### 什么是 AST ？

`AST（Abstract Syntax Tree）`叫做抽象语法树，是源代码语法结构的一种抽象表示。

编程语言在计算机中的处理，首先会将源代码经过词法和语法分析，构建出 `AST`；然后编译器基于 `AST` 来读取和解析代码，生成目标二进制文件，最后执行。

### 什么是词法分析？

词法分析是计算机科学中将**字符串序列转换为单词（Token）序列的过程**。

```
输入 => 扫描 => 分析 => 输出
```

通俗来说就是按照编程语言的规则，识别出各类关键字，将其转为特定内容，最后输出，以供后续语法分析用，感觉有点像模板引擎的意思

### 什么是语法分析？

**构建 AST 抽象语法树的过程叫做语法分析**，语法分析的过程包含词法分析

最著名的两种语法分析算法分别是：`LL 算法`和 `LR 算法`，其中 `L 表示 Left` ，`R 表示 Right`

`LL 算法`是从左到右扫描，从左到右规约，`LR 算法`是从左到右扫描，从右到左规约

### 四则运算的词法和语法的定义

**词法定义：**

```
- TokenNumber: . 1 2 3 4 5 6 7 8 9 0 的组合
- Operator: +、-、\*、/ 之一
- WhiteSpace: <SP>
- LineTerminator: <LF> <CR>
```

**语法定义：**

`JavaScript` 产生式的规则：

- 加法运算
  - 是由左右两个乘法组成的
  - 可以连加
- 乘法运算
  - 单独的数字也认为是一种特殊的乘法（只有一项的乘法）
  - 操作符只有一个乘号时，认为是一种特殊的加法（只有一项的加法）

```xml
<Expression>::=
  <AdditiveExpression><EOF>

<AdditiveExpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression>::=
  <Number>
  |<MultiplicativeExpression><*><Number>
  |<MultiplicativeExpression></><Number>
```

以上定义为终结符（`TerminalSymbol`，直接从词法分析后的内容里扫描得到的）的有这些：

```xml
<Number>
<+>
<->
<*>
</>
<EOF>
```

除了终结符之外，其他都为非终结符（`NoneTerminalSymbol`，是拿终结符的组合定义出来的）
