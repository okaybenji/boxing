const $$ = query => document.querySelectorAll(query);

const keyMap = {};
const blockInput = {one: false, two: false};

// Give a window within which a player can uppercut instead of defending or jabbing.
let inputTimeouts = {one: undefined, two: undefined};

const animation = (player, selector, transformation) => {
  clearTimeout(inputTimeouts[player]);
  blockInput[player] = true;
  const elements = $$(selector);
  elements.forEach(el => {
    el.style.transform = transformation;
  });

  setTimeout(() => {
    elements.forEach(el => {
      el.style.transform = '';
    });
    blockInput[player] = false;
  }, 500);
};

const duck = player => animation(player, `.${player} div`, 'translatey(10vh)');
const dodgeLeft = player => animation(player, `.${player} div`, 'translatex(-20vh)');
const dodgeRight = player => animation(player, `.${player} div`, 'translatex(20vh)');

// Delay execution of the passed action until we're sure player isn't trying to press two keys simultaneously.
const executeAfterComboKeysWindowPasses = (player, action) => {
  const execute = () => {
    inputTimeouts[player] = undefined;
    action();
  };

  // If player doesn't press up within the timeout period, defend/jab.
  clearTimeout(inputTimeouts[player]);
  inputTimeouts[player] = setTimeout(execute, 25);
};

const defend = player => executeAfterComboKeysWindowPasses(player, () => {
  animation(player, `.${player} .left.arm`, 'translatey(-30vh) rotate(45deg)');
  animation(player, `.${player} .right.arm`, 'translatey(-30vh) rotate(-45deg)');
});

const jabLeft = player => executeAfterComboKeysWindowPasses(player, () => {
    animation(player, `.${player} .left`, 'translatey(-25vh)');
});

const jabRight = player => executeAfterComboKeysWindowPasses(player, () => {
    animation(player, `.${player} .right`, 'translatey(-25vh)');
});

const uppercutLeft = player => {
  animation(player, `.${player} div`, 'translatey(-10vh)');

  const leftArms = $$(`.${player} .left.arm`);
  leftArms.forEach(arm => {
    arm.style.transform = 'translatey(-35vh)';
  });
};

const uppercutRight = player => {
  animation(player, `.${player} div`, 'translatey(-10vh)');

  const rightArms = $$(`.${player} .right.arm`);
  rightArms.forEach(arm => {
    arm.style.transform = 'translatey(-35vh)';
  });
};

const applyKeys = () => {
  // Controls for player one.
  if (!blockInput.one) {
    keyMap.f && keyMap.w ? uppercutLeft('one')
    : keyMap.g && keyMap.w ? uppercutRight('one')
    : keyMap.w ? defend('one')
    : keyMap.a ? dodgeLeft('one')
    : keyMap.s ? duck('one')
    : keyMap.d ? dodgeRight('one')
    : keyMap.f ? jabLeft('one')
    : keyMap.g ? jabRight('one')
    : null;
  }

  // Controls for player two.
  if (!blockInput.two) {
    keyMap[`;`] && keyMap.i ? uppercutLeft('two')
    : keyMap[`'`] && keyMap.i ? uppercutRight('two')
    : keyMap.i ? defend('two')
    : keyMap.j ? dodgeLeft('two')
    : keyMap.k ? duck('two')
    : keyMap.l ? dodgeRight('two')
    : keyMap[`;`] ? jabLeft('two')
    : keyMap[`'`] ? jabRight('two')
    : null;
  }
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
