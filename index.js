const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);

const keyMap = {};
const blockInput = {one: false, two: false};

const block = player => {
  blockInput[player] = true;


  const leftArms = $$(`.${player} .left.arm`);
  const rightArms = $$(`.${player} .right.arm`);

  leftArms.forEach(arm => {
    arm.style.transform = 'translatey(-30vh)';
    arm.style.transform += 'rotate(45deg)';
  });

  rightArms.forEach(arm => {
    arm.style.transform = 'translatey(-30vh)';
    arm.style.transform += 'rotate(-45deg)';
  });

  setTimeout(() => {
    leftArms.forEach(arm => {
      arm.style.transform = '';
    });

    rightArms.forEach(arm => {
      arm.style.transform = '';
    });

    blockInput[player] = false;
  }, 500);
};

const animation = (player, selector, transformation) => {
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
const jabLeft = player => animation(player, `.${player} .left`, 'translatey(-25vh)');
const jabRight = player => animation(player, `.${player} .right`, 'translatey(-25vh)');

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
    : keyMap.w ? block('one')
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
    : keyMap.i ? block('two')
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
