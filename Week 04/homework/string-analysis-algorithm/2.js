
// KMP（跳转表格 + 匹配）
function KMP(source, pattern) {
  let table = new Array(pattern.length).fill(0);

  // 创建跳转表格
  {
    let i = 1, j = 0;

    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        i++, j++;
        table[i] = j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          i++;
        }
      }
    }

    // console.log(table);
  }

  // 匹配
  {
    let i = 0, j = 0;

    while (i < source.length) {
      if (source[i] === pattern[j]) {
        i++, j++;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          i++;
        }
      }
      if (j === pattern.length) {
        return true;
      }
    }
    return false;
  }

}

// 创建跳转表格
// KMP('', 'abcdabce')
// KMP('', 'aabaaac')

// 匹配
// console.log(KMP('hello', 'llx'));
console.log(KMP('abcdabce', 'abc'));
console.log(KMP('abc', 'abc'));
