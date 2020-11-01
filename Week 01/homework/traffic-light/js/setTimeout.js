function green() {
  var ligthsELe = document.getElementsByTagName('div');
  for (var i = 0; i < ligthsELe.length; i++) {
    ligthsELe[i].classList.remove('light');
  }
  document.getElementsByClassName('green')[0].classList.add('light');
}
function yellow() {
  var ligthsELe = document.getElementsByTagName('div');
  for (var i = 0; i < ligthsELe.length; i++) {
    ligthsELe[i].classList.remove('light');
  }
  document.getElementsByClassName('yellow')[0].classList.add('light');
}
function red() {
  var ligthsELe = document.getElementsByTagName('div');
  for (var i = 0; i < ligthsELe.length; i++) {
    ligthsELe[i].classList.remove('light');
  }
  document.getElementsByClassName('red')[0].classList.add('light');
}
function go() {
  green();
  setTimeout(() => {
    yellow();
    setTimeout(() => {
      red();
      setTimeout(() => {
        go();
      }, 5000);
    }, 2000);
  }, 10000);
}
