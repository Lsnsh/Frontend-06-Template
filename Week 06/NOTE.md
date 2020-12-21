# 第 6 周｜重学 JavaScript（一）

## 本周作业

**必做：**

- 课堂练习
  1. [编写带括号的四则运算产生式](#1-编写带括号的四则运算产生式)
  2. [尽可能寻找你知道的计算机语言，尝试把它们分类](#2-尽可能寻找你知道的计算机语言尝试把它们分类)
  3. [写一段 JS 的函数，把一个 string 它代表的字节给它转换出来，用 UTF8 对 string 进行遍码](./homework/3.html)
  4. [用 JavaScript 去设计狗咬人的代码](./homework/4.html)
  5. [找出 JavaScript 标准里面所有具有特殊行为的对象](#5-找出-javascript-标准里面所有具有特殊行为的对象)

### 1. 编写带括号的四则运算产生式

```xml
<Expression>::=
  <BracketsExpression><EOF>

<BracketsExpression>::=
  <AdditiveExpression>
  |<(><BracketsExpression><+><AdditiveExpression><)>
  |<(><BracketsExpression><-><AdditiveExpression><)>
  |<(><BracketsExpression><*><AdditiveExpression><)>
  |<(><BracketsExpression></><AdditiveExpression><)>

<AdditiveExpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression>::=
  <Number>
  |<MultiplicativeExpression><*><Number>
  |<MultiplicativeExpression></><Number>
```

### 2. 尽可能寻找你知道的计算机语言，尝试把它们分类

- 从**用途**角度
  - 数据描述语言
    - XML, HTML, SGML, JSON, SQL, CSS
  - 编程语言
    - C, C++, C#, Java, Python, PHP, Ruby, Go, R, Perl, Groovy, VB, VB .NET, Object-C, Swift, Kotlin, JavaScript, Dart, MATLAB, Assembly Language, PL/SQL
- 从**表达方式**角度
  - 声明式语言
    - XML, HTML, SGML, JSON, SQL, CSS, Lisp, Clojure, Haskell, Prolog
  - 命令型语言
    - C, C++, C#, Java, Python, PHP, Ruby, Go, R, Perl, Groovy, VB, VB .NET, Object-C, Swift, Kotlin, JavaScript, Dart, MATLAB, Assembly Language, PL/SQL

### 5. 找出 JavaScript 标准里面所有具有特殊行为的对象

TODO:

Array：Array 的 length 属性根据最大的下标自动发生变化。

Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。

String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。

Arguments：arguments 的非负整数型下标属性跟对应的变量联动。

模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。

类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊。

bind 后的 function：跟原来的函数相关联。

## 本周总结

### JS 语言通识

#### 泛用语言分类方法

语言按语法分类

- 非形式语言
  - 中文、英文
- 形式语言（乔姆斯基谱系）
  - 0 型 无限制文法
  - 1 型 上下文相关法
  - 2 型 上下文无关法
  - 3 型 正则文法

#### 什么是产生式

产生式（BNF）

- 用尖括号括起来的名称来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的符合结构
  - 基础结构称终结符
  - 符合结构称非终结符
- 引号和中间的字符标识终结符
- 可以有括号
- - 标识重复多次
- ｜ 标识或
- - 标识至少一次

不带括号的四则运算产生式：

**练习：编写带括号的四则运算产生式**

#### 深入理解产生式

通过产生式理解乔姆斯基谱系

- 0 型 无限制文法
  - ?::=?
- 1 型 上下文相关法
  - ?\<A>?::=?\<B>?
- 2 型 上下文无关法
  - \<A>::=?
- 3 型 正则文法
  - \<A>::=\<A>?
  - \<A>::=?\<A>x

`JavaScript` 总体上属于`上下文无关文法`，其中的表达式部分大部分属于`正则文法`，但是也有特例：

比如使用乘方运算符的表达式，是右结合的，从右开始计算，表达式计算的结果等于：2，因为是右结合，所以不是 `正则文法`。

```js
2 ** (1 ** 2);
```

`JavaScript` 其实不是严格意义上的 `上下文无关文法`，反而由于类似下面的表达式的出现，如果严格遵循乔姆斯基谱系的话，反而变成了`上下文相关文法`

```js
{
  get a {return 1},
  get: 1
}
```

上面的 `get` 关键词，在定义对象时后面写 `a` 与不写 `a` 是两种意思，如果写 `a` 它就是类似关键词的存在，如果不写就是作为对象的属性名存在

`JavaScript` 引擎的实现上，总体的编程结构是针对`上下文无关文法`的分析，只在遇到类似 `get` 这样的上下文相关的地方做一些特例的处理，所以还是会把 `JavaScript` 归结为 `上下文无关文法` 去处理。

#### 现代语言的分类

**现代语言的特例：**

- `C++` 中，`*` 可能表示乘号或者指针，具体是哪个，取决于星号前面的标识符是否被声明为类型
- `VB` 中，`<` 可能是小于号，也可能是 `XML` 直接量的开始，取决于当前位置是否可以接收 `XML` 直接量
- `Python` 中，行首的 `tab` 符号和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符 `indent` 或者 `dedent`
- `JavaScript` 中，`/` 可能是除号，也可能是正则表达式开头，处理方式类似于 `VB`，字符串模板中也需要特殊处理 `}`，还有自动插入分号规则

**语言的分类：**

- 形式语言
  - 从**用途**角度
    - 数据描述语言
      - JSON, HTML, XAML, SQL, CSS
    - 编程语言
      - C, C++, Java, C#, Python, Ruby, Perl, Lisp, T-SQL, Clojure, Haskell, JavaScript
  - 从**表达方式**角度
    - 声明式语言
      - JSON, HTML, XAML, SQL, CSS, Lisp, Clojure, Haskell
    - 命令型语言
      - C, C++, Java, C#, Python, Ruby, Perl, JavaScript

练习：尽可能寻找你知道的计算机语言，尝试把它们分类

#### 编程语言的性质

**图灵完备性：**

- 命令式——图灵机
  - goto
  - if 和 while
- 声明式——lamada
  - 递归

**动态和静态：**

- 动态：
  - 在用户的设备/在线服务器上
  - 产品实际运行时
  - Runtime
- 静态：
  - 在程序员的设备上
  - 产品开发时
  - Compiletime

**类型系统：**

- 动态类型系统于静态类型系统
- 强类型和弱类型
  - 是否会隐式类型转换
  - String + Number
    - Number 先被转换为 String
  - String === Boolean
    - Boolean 先被转换为 Number
- 复合类型
  - 结构体
  - 函数签名
- 子类型
- 泛型
  - 协变
    - 凡是能用 Array<Parent> 的地方，都能用 Array<Child>
  - 逆变
    - 凡是能用 Function<Child> 的地方，都能用 Function<Parent>

#### 一般命令式编程语言的设计方式

总体上来讲结构会分为五个层级：

- Atom
  - Identifier
  - Literal
- Expression
  - Atom
  - Operator
  - Punctuator
- Statement
  - Expression
  - Keyword
  - Punctuator
- Structure
  - Function
  - Class
  - Process
  - Namespace
  - ...
- Program
  - Program
  - Module
  - Package
  - Library

### JS 类型

**Types:**

- Number
- String
- Boolean
- Object
- Null
- Undefined
- Symbol
- BigInt（在途）
