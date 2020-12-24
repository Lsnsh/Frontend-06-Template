// 实现用状态机：在一个字符串中，找到字符“abababx”
function match(str) {
  let state = start;
  for (let c of str) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  } else {
    return start;
  }
}

function end() {
  return end;
}

function foundA(c) {
  if (c === 'b') {
    return foundB;
  } else {
    return start(c);
  }
}

function foundB(c) {
  if (c === 'a') {
    return foundA2;
  } else {
    return start(c);
  }
}

function foundA2(c) {
  if (c === 'b') {
    return foundB2;
  } else {
    return start(c);
  }
}

function foundB2(c) {
  if (c === 'a') {
    return foundA3;
  } else {
    return start(c);
  }
}

function foundA3(c) {
  if (c === 'b') {
    return foundB3;
  } else {
    return start(c);
  }
}

function foundB3(c) {
  if (c === 'x') {
    return end;
  } else {
    // 处理字符串是 “ababababx” 的情况
    return foundB2(c);
  }
}



console.log(match('hello abababx'));
console.log(match('hello ababababx'));
console.log(match('hello abababc'));
