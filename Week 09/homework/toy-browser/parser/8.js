const css = require('css');

/**
 * @property {object} currentToken
 * @property {string} currentToken.type
 * @property {string} currentToken.tagName
 * @property {string} currentToken.content
 * @property {string} currentToken.{attributeName}
 * @property {boolean} currentToken.isSelfClosing
 */
let currentToken = null;
/**
 * @property {object} currentAttribute
 * @property {string} currentAttribute.name
 * @property {string} currentAttribute.value
 */
let currentAttribute = null;

let currentTextNode = null;
let stack = [
  { type: 'document', children: [] }
];

let rules = [];
/**
 * 收集 CSS 规则
 * @param {String} text
 */
function addCSSRules(text) {
  let AST = css.parse(text);
  console.log(JSON.stringify(AST, null, 2));
  rules.push(...AST.stylesheet.rules);
}

/**
 * 提交节点 - tokenization
 * @param {{type: string, tagName: string, content: string, isSelfClosing: boolean}} token
 */
function emit(token) {
  let top = stack[stack.length - 1];

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      tagName: '',
      children: [],
      attributes: [],
      parent: null
    }
    element.tagName = token.tagName;

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end does\'t match!');
    } else {
      // style 标签结束时，开始执行收集 CSS 规则的操作
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content);
      }
      // style 标签中的 import 写法、link 标签等引入 CSS 规则的方式，暂时不处理（需要网络请求和异步处理）

      stack.pop();
    }

    currentTextNode = null;
  } else if (token.type === 'text') {
    // 匹配到文本节点
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

// ---

const EOF = Symbol('EOF'); // EOF: End Of File

// 有限状态机的初始状态
function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    });
    // 终止
    return;
  } else {
    // 匹配到文本节点
    emit({
      type: 'text',
      content: c
    });
    return data;
  }
}

// 标签-开始（包含开始标签、结束标签、自封闭标签三种标签）
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    // re-consume
    return tagName(c);
  } else {
    return;
  }
}

// 结束标签-开始
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c);
  } else if (c === '>') {
    // 报错，属于异常情况
  } else if (c === EOF) {
    // 报错，属于异常情况
  } else {

  }
}

// 标签名、标签内容-开始
function tagName(c) {
  if (c.match(/^[\r\t\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 表示匹配到标签名，更新 currentToken.tagName 属性
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    // 表示匹配到标签的结束，提交 currentToken
    emit(currentToken);
    // 返回初始状态，继续往下匹配其他标签
    return data;
  } else {
    return tagName;
  }
}

// 自封闭标签
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    // 表示匹配到标签的结束，提交 currentToken
    emit(currentToken);
    // 返回初始状态，继续往下匹配其他标签
    return data;
  } else if (c === EOF) {
    // 报错，属于异常情况
  } else {
    // 报错，属于异常情况
  }
}

// 标签属性名-开始，暂时先不处理
function beforeAttributeName(c) {
  if (c.match(/^[\r\t\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '>') {
    return afterAttributeName(c);
  } else if (c === '=') {
    // 报错，属于异常情况
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c);
  }
}

// 属性名
function attributeName(c) {
  if (c.match(/^[\r\t\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {
    // 存在疑问的点
  } else if (c === '\"' || c === '\'' || c === '<') {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

// 属性名-之后
function afterAttributeName(c) {
  if (c.match(/^[\r\t\f ]$/)) {
    return afterAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    // 表示匹配到标签的结束，提交 currentToken
    emit(currentToken);
    // 返回初始状态，继续往下匹配其他标签
    return data;
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c);
  }
}

// 属性值-开始前
function beforeAttributeValue(c) {
  if (c.match(/^[\r\t\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue(c);
  } else if (c === '\"') {
    return doubleQuotesAttributeValue;
  } else if (c === '\'') {
    return singleQuotesAttributeValue;
  } else {
    return noQuotesAttributeValue(c);
  }
}

// 双引号包裹的属性值
function doubleQuotesAttributeValue(c) {
  if (c === '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotesAttributeValue;
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotesAttributeValue;
  }
}

// 单引号包裹的属性值
function singleQuotesAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotesAttributeValue;
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return singleQuotesAttributeValue;
  }
}

// 单双引号-之后
function afterQuotesAttributeValue(c) {
  if (c.match(/^[\r\t\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    // 表示匹配到标签的结束，提交 currentToken
    emit(currentToken);
    // 返回初始状态，继续往下匹配其他标签
    return data;
  } else if (c === EOF) {

  } else {
    // 存在疑问的点
    currentAttribute.value += c;
    return afterQuotesAttributeValue;
  }
}

// 没有引号包裹的属性值
function noQuotesAttributeValue(c) {
  if (c.match(/^[\r\t\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    // 表示匹配到标签的结束，提交 currentToken
    emit(currentToken);
    // 返回初始状态，继续往下匹配其他标签
    return data;
  } else if (c === '\"' || c === '\'' || c === '<' || c === '=' || c === '`') {

  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return noQuotesAttributeValue;
  }
}

module.exports = {
  parseHTML(html) {
    // console.log(html);
    // 初始状态
    let state = data;;
    for (let c of html) {
      state = state(c);
    }
    // 最终状态
    state = state(EOF);
    return stack[0];
  }
}
