// 实现用状态机：在一个字符串中，找到字符“abcdef”
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
  if (c === 'c') {
    return foundC;
  } else {
    return start(c);
  }
}

function foundC(c) {
  if (c === 'd') {
    return foundD;
  } else {
    return start(c);
  }
}

function foundD(c) {
  if (c === 'e') {
    return foundE;
  } else {
    return start(c);
  }
}

function foundE(c) {
  if (c === 'f') {
    return end;
  } else {
    return start(c);
  }
}



console.log(match('hello abcdef'));
console.log(match('hello ababcdef'));
console.log(match('hello abbabcdef'));
