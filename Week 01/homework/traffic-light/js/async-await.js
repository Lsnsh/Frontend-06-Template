function show(color) {
  var ligthsELe = document.getElementsByTagName('div');
  for (var i = 0; i < ligthsELe.length; i++) {
    ligthsELe[i].classList.remove('light');
  }
  document.getElementsByClassName(color)[0].classList.add('light');
}

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  })
}

function happen(ele, eventName) {
  return new Promise((resolve, reject) => {
    ele.addEventListener(eventName, resolve, { once: true })
  })
}

async function go() {
  // 自动控制
  // while (true) {
  //   show('green');
  //   await sleep(5000)
  //   show('yellow');
  //   await sleep(2000)
  //   show('red');
  //   await sleep(10000)
  // }

  // 手动控制
  while (true) {
    show('green');
    await happen(document.getElementById('next'), 'click')
    show('yellow');
    await happen(document.getElementById('next'), 'click')
    show('red');
    await happen(document.getElementById('next'), 'click')
  }
}
