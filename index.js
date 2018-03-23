const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);

const keyMap = {};
const blockInput = {one: false, two: false};

const block = player => {
  blockInput[player] = true;

  const opponent = player === 'one' ? 'two' : 'one';

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

const duck = player => {
  blockInput[player] = true;

  const opponent = player === 'one' ? 'two' : 'one';
  const playerDivs = $$(`.${player} div`);

  playerDivs.forEach(div => {
    div.style.transform = 'translatey(10vh)';
  });

  setTimeout(() => {
    playerDivs.forEach(div => {
      div.style.transform = '';
    });
    blockInput[player] = false;
  }, 500);
};

const dodgeLeft = player => {
  blockInput[player] = true;

  const opponent = player === 'one' ? 'two' : 'one';
  const playerDivs = $$(`.${player} div`);

  playerDivs.forEach(div => {
    div.style.transform = 'translatex(-20vh)';
  });

  setTimeout(() => {
    playerDivs.forEach(div => {
      div.style.transform = '';
    });
    blockInput[player] = false;
  }, 500);
};

const dodgeRight = player => {
  blockInput[player] = true;

  const opponent = player === 'one' ? 'two' : 'one';
  const playerDivs = $$(`.${player} div`);

  playerDivs.forEach(div => {
    div.style.transform = 'translatex(20vh)';
  });

  setTimeout(() => {
    playerDivs.forEach(div => {
      div.style.transform = '';
    });
    blockInput[player] = false;
  }, 500);
};

const jabLeft = player => {
  blockInput[player] = true;

  const opponent = player === 'one' ? 'two' : 'one';
  const leftArms = $$(`.${player} .left`);

  leftArms.forEach(div => {
    div.style.transform = 'translatey(-25vh)';
  });

  setTimeout(() => {
    leftArms.forEach(div => {
      div.style.transform = '';
    });
    blockInput[player] = false;
  }, 500);
};

const jabRight = player => {
  blockInput[player] = true;

  const opponent = player === 'one' ? 'two' : 'one';
  const rightArms = $$(`.${player} .right`);

  rightArms.forEach(div => {
    div.style.transform = 'translatey(-25vh)';
  });

  setTimeout(() => {
    rightArms.forEach(div => {
      div.style.transform = '';
    });
    blockInput[player] = false;
  }, 500);
};
const uppercutLeft = player => { console.log(player, 'uppercutLeft')};
const uppercutRight = player => { console.log(player, 'uppercutRight')};

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
