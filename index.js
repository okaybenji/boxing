const keyMap = {};

const block = player => { console.log(player, 'block')};
const duck = player => { console.log(player, 'duck')};
const dodgeLeft = player => { console.log(player, 'dodgeLeft')};
const dodgeRight = player => { console.log(player, 'dodgeRight')};
const jabLeft = player => { console.log(player, 'jabLeft')};
const jabRight = player => { console.log(player, 'jabRight')};
const uppercutLeft = player => { console.log(player, 'uppercutLeft')};
const uppercutRight = player => { console.log(player, 'uppercutRight')};

const applyKeys = () => {
  // Controls for player one.
  keyMap.f && keyMap.w ? uppercutLeft('one')
  : keyMap.g && keyMap.w ? uppercutRight('one')
  : keyMap.w ? block('one')
  : keyMap.a ? dodgeLeft('one')
  : keyMap.s ? duck('one')
  : keyMap.d ? dodgeRight('one')
  : keyMap.f ? jabLeft('one')
  : keyMap.g ? jabRight('one')
  : null;

  // Controls for player two.
  keyMap[`;`] && keyMap.i ? uppercutLeft('two')
  : keyMap[`'`] && keyMap.i ? uppercutRight('two')
  : keyMap.i ? block('two')
  : keyMap.j ? dodgeLeft('two')
  : keyMap.k ? duck('two')
  : keyMap.l ? dodgeRight('two')
  : keyMap[`;`] ? jabLeft('two')
  : keyMap[`'`] ? jabRight('two')
  : null;
};

const keyon = e => {
  keyMap[e.key] = true;
  applyKeys();
};

const keyoff = e => {
  keyMap[e.key] = false;
}

window.addEventListener('keydown', keyon, false);
window.addEventListener('keyup', keyoff, false);
