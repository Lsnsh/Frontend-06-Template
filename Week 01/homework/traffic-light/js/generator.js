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

function* go() {
  // // 自动控制
  // while (true) {
  //   show('green');
  //   yield sleep(5000)
  //   show('yellow');
  //   yield sleep(2000)
  //   show('red');
  //   yield sleep(10000)
  // }

  // 手动控制
  while (true) {
    show('green');
    yield happen(document.getElementById('next'), 'click')
    show('yellow');
    yield happen(document.getElementById('next'), 'click')
    show('red');
    yield happen(document.getElementById('next'), 'click')
  }
}

function run(iterator) {
  let { value, done } = iterator.next();
  if (done) {
    return;
  }
  if (value instanceof Promise) {
    value.then(() => {
      run(iterator);
    })
  }
}

function co(generator) {
  return function () {
    run(generator())
  }
}

go = co(go);
