let pattern = [
  2, 1, 0
];

function create(rows, cols) {
  const board = document.getElementById('board');
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const value = pattern[i * rows + j] || 0;
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add(value === 2 ? 'black' : value === 1 ? 'white' : 'none');
      board.appendChild(cell);
    }
    board.appendChild(document.createElement('br'));
  }
}

// TODO: 用户落子

// TODO: 电脑落子

// TODO: 检查胜负

// TODO: 即将落子方胜负预判

// TODO: 局面胜负预判

create(15, 15);
