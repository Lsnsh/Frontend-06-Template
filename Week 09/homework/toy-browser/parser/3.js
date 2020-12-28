const EOF = Symbol('EOF'); // EOF: End Of File

// 有限状态机的初始状态
function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    // 终止
    return;
  } else {
    // 匹配到文本节点，暂时先不处理
    return data;
  }
}

// 标签-开始（包含开始标签、结束标签、自封闭标签三种标签）
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // re-consume
    return tagName(c);
  } else {
    return;
  }
}

// 结束标签-开始
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
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
  } else if (c === '>') {
    // 表示匹配到标签的结束，返回初始状态，继续往下匹配其他标签
    return data;
  } else {
    return tagName;
  }
}

// 标签属性名-开始，暂时先不处理
function beforeAttributeName(c) {
  if (c.match(/^[\r\t\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '>') {
    // 表示匹配到标签的结束，返回初始状态，继续往下匹配其他标签
    return data;
  } else if (c === '=') {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

// 自封闭标签
function selfClosingStartTag(c) {
  if (c === '>') {
    return data;
  } else if (c === EOF) {
    // 报错，属于异常情况
  } else {
    // 报错，属于异常情况
  }
}

module.exports = {
  parseHTML(html) {
    // 初始状态
    let state = data;;
    for (let c of html) {
      state = state(c);
    }
    // 最终状态
    state = state(EOF);
  }
}
