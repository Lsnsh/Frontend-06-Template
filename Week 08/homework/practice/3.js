// 不准使用正则表达式，纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“abcdef”
function match(str, matchChar = 'abcdef') {
  let foundItem1 = false;
  let foundItem2 = false;
  let foundItem3 = false;
  let foundItem4 = false;
  let foundItem5 = false;
  for (let c of str) {
    if (c === matchChar[0] && !foundItem2) {
      foundItem1 = true;
    } else if (foundItem1 && c === matchChar[1] && !foundItem3) {
      foundItem2 = true;
    } else if (foundItem1 && foundItem2 && c === matchChar[2] && !foundItem4) {
      foundItem3 = true;
    } else if (foundItem1 && foundItem2 && foundItem3 && c === matchChar[3] && !foundItem5) {
      foundItem4 = true;
    } else if (foundItem1 && foundItem2 && foundItem3 && foundItem4 && c === matchChar[4]) {
      foundItem5 = true;
    } else if (foundItem1 && foundItem2 && foundItem3 && foundItem4 && foundItem5 && c === matchChar[5]) {
      return true;
    } else {
      foundItem1 = false;
      foundItem2 = false;
      foundItem3 = false;
      foundItem4 = false;
      foundItem5 = false;
    }
  }
  return false;
}

console.log(match('hello abcdef'));
console.log(match('hello Nanavi', 'Nanavi'));
console.log(match('hello Nanavv', 'Nanavi'));
