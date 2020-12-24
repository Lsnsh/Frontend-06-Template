// 不准使用正则表达式，纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“ab”
function match(str, matchChar = 'ab') {
  let foundBegin = false;
  for (let c of str) {
    if (c === matchChar[0]) {
      foundBegin = true;
    } else if (foundBegin && c === matchChar[1]) {
      return true;
    } else {
      foundBegin = false;
    }
  }
  return false;
}

console.log(match('hello Nana'));
console.log(match('hello Baba'));
console.log(match('hello Vivi', 'vi'));
