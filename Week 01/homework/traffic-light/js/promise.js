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

function go() {
  show('green');
  sleep(5000).then(() => {
    show('yellow');
    return sleep(2000)
  }).then(() => {
    show('red');
    return sleep(10000)
  }).then(() => {
    go();
  })
}
