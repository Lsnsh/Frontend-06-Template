# 第 11 周｜重学 CSS（一）

## 本周总结

### CSS 总论

总体结构：

- @charset
- @import
- rules
  - @media
  - @page
  - rule

总结：

- `CSS` 语法
- `at-rules` - @规则
  - @charset
  - @import
  - @media
  - @page
  - @counter-style
  - @keyframes
  - @fontface
  - @supports
  - @namespace
- `rule` - `CSS` 规则
  - **Selector - 选择器**
    - selector group
    - selector
      - \>
      - \<sp>
      - \+
      - \-
    - simple selector
      - type
      - \*
      - \.
      - \#
      - []
      - :
      - ::
      - :not
  - `Declaration` - 声明
    - key
      - **variables**
      - properties
    - **value**
      - calc
      - number
      - length
      - ...

### CSS 选择器

- 简单选择器
  - \*
  - div svg|a
  - .cls
  - #id
  - [attr=value]
  - :hover
  - ::before
- 复合选择器
  - <简单选择器><简单选择器><简单选择器>
  - \* 或者 div 必须写在最前面
- 复杂选择器
  - <复合选择器><sp><复合选择器>
  - <复合选择器>">"<复合选择器>
  - <复合选择器>"~"<复合选择器>
  - <复合选择器>"+"<复合选择器>
  - <复合选择器>"||"<复合选择器>

#### 伪类

- 链接/行为
  - :any-link
  - :link
  - :visited
  - :hover
  - :active
  - :focus
  - :target
- 树结构
  - :empty
  - :nth-child()
  - :nth-last-child()
  - :first-child
  - :last-child
  - :only-child
- 逻辑型
  - :not
  - :where
  - :has

#### 伪元素

- ::before
- ::after
- ::first-line
- ::first-letter
