const EOF = Symbol('EOF'); // EOF: End Of File

// 有限状态机的初始状态
function data(char) {
  // 下一节完善初始化状态，状态迁移等逻辑
}

module.exports = {
  parseHTML(html) {
    // 初始状态
    let state = data;;
    for (let char of html) {
      state = state(char);
    }
    // 最终状态
    state = state(EOF);
  }
}
