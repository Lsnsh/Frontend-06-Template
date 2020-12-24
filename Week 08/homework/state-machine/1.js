// 在一个字符串中，找到字符”a”
function match(str, matchChar = 'a') {
  for (let c of str) {
    if (c === matchChar) {
      return true;
    }
  }
  return false;
}

console.log(match('hello Nana'));
console.log(match('hello Vivi', 'v'));
