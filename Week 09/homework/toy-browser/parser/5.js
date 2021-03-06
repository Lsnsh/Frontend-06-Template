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

/**
 * 提交节点 - tokenization
 * @param {{type: string, tagName: string, content: string, isSelfClosing: boolean}} token
 */
function emit(token) {
  console.log(token);
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
    emit({
      type: 'text',
      content: c
    });
    // 匹配到文本节点，暂时先不处理
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

// 标签属性名-开始
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
  }
}
