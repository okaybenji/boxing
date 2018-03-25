const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);
const keyMap = {};
const state = {
  one: {
    health: 75,
    disableInput: false,
    // Give a window during which a player can uppercut instead of defending or jabbing.
    inputTimeout: undefined,
  },
  two: {
    health: 75,
    disableInput: false,
    inputTimeout: undefined,
  }
};

const animation = (selector, className, duration) => {
  const elements = $$(selector);
  elements.forEach(el => el.classList.add(className))

  setTimeout(() => {
    elements.forEach(el => el.classList.remove(className));
  }, duration);
};

const takeDamage = (player, amount) => {
  state[player].health -= Math.min(amount, state[player].health);
  $(`#${player} .healthbar`).style.width = state[player].health + 'vh';

  if (state[player].health === 0) {
    const opponent = player === 'one' ? 'two' : 'one';
    $$(`.${player}`).forEach(el => el.classList.add('knockout'));
    $$(`.${opponent} .body`).forEach(el => el.classList.add('celebrateBody'));
    $$(`.${opponent} .arm`).forEach(el => el.classList.add('celebrateArm'));
  }
};

// Prevent player from taking an action for a given period of time.
const disableInput = (player, duration) => {
  clearTimeout(state[player].inputTimeout);
  state[player].disableInput = true;

  setTimeout(() => {
    state[player].disableInput = false;
  }, duration);
};

// Set player action for the passed duration.
const setAction = (player, action, duration) => {
  state[player].action = action;

  setTimeout(() => {
    state[player].action = '';
  }, duration);
};

const duck = player => {
  const duration = 500;
  disableInput(player, duration);
  setAction(player, 'duck', duration);
  animation(`.${player} div`, 'duck', duration);
};

const dodgeLeft = player => {
  const duration = 350;
  disableInput(player, duration);
  setAction(player, 'dodgeLeft', duration);
  animation(`.${player} div`, 'dodgeLeft', duration);
};

const dodgeRight = player => {
  const duration = 350;
  disableInput(player, duration);
  setAction(player, 'dodgeRight', duration);
  animation(`.${player} div`, 'dodgeRight', duration);
};

const stun = (player, duration) => {
  disableInput(player, duration);
  setAction(player, 'stun', duration);
  animation(`.${player} div`, 'shake', duration);
};

// Delay execution of the passed action until we're sure player isn't trying to press two keys simultaneously.
const executeAfterComboKeysWindowPasses = (player, action) => {
  const execute = () => {
    state[player].inputTimeout = undefined;
    action();
  };

  // If player doesn't press up within the timeout period, defend/jab.
  clearTimeout(state[player].inputTimeout);
  state[player].inputTimeout = setTimeout(execute, 25);
};

const defend = player => executeAfterComboKeysWindowPasses(player, () => {
  const duration = 500;
  disableInput(player, duration);
  setAction(player, 'defend', duration);
  animation(`.${player} .left.arm`, 'defendLeft', duration);
  animation(`.${player} .right.arm`, 'defendRight', duration);
});

const hit = (player, isUppercut = false) => {
  animation(`.${player} .body`, 'nudgeDown', 250);

  const action = state[player].action;
  if (action === 'defend') {
    takeDamage(player, isUppercut ? 3 : 2);
  } else {
    takeDamage(player, isUppercut ? 12 : 8);
    stun(player, isUppercut ? 750 : 500);
  }
};

const jabLeft = player => executeAfterComboKeysWindowPasses(player, () => {
  const duration = 500;
  disableInput(player, duration);
  setAction(player, 'attack', duration);
  animation(`.${player} .left`, 'jabLeft', duration);
  animation(`.${player}`, 'attack', duration);

  const opponent = player === 'one' ? 'two' : 'one';
  setTimeout(() => {
    if (state[opponent].action !== 'dodgeLeft') {
      hit(opponent);
    }
  }, 125);
});

const jabRight = player => executeAfterComboKeysWindowPasses(player, () => {
  const duration = 500;
  disableInput(player, duration);
  setAction(player, 'attack', duration);
  animation(`.${player} .right`, 'jabRight', duration);
  animation(`.${player}`, 'attack', duration);

  const opponent = player === 'one' ? 'two' : 'one';
  setTimeout(() => {
    if (state[opponent].action !== 'dodgeRight') {
      hit(opponent);
    }
  }, 125);
});

const uppercutLeft = player => {
  const duration = 750;
  disableInput(player, duration);
  setAction(player, 'attack', duration);
  animation(`.${player} .body, .${player} .right.arm`, 'jump', duration);
  animation(`.${player} .left.arm`, 'uppercutLeft', duration);
  animation(`.${player}`, 'attack', duration);

  const opponent = player === 'one' ? 'two' : 'one';
  setTimeout(() => {
    if (state[opponent].action !== 'dodgeLeft' && state[opponent].action !== 'duck') {
      const isUppercut = true;
      hit(opponent, isUppercut);
    }
  }, 125);
};

const uppercutRight = player => {
  const duration = 750;
  disableInput(player, duration);
  setAction(player, 'attack', duration);
  animation(`.${player} .body, .${player} .left.arm`, 'jump', duration);
  animation(`.${player} .right.arm`, 'uppercutRight', duration);
  animation(`.${player}`, 'attack', duration);

  const opponent = player === 'one' ? 'two' : 'one';
  setTimeout(() => {
    if (state[opponent].action !== 'dodgeRight' && state[opponent].action !== 'duck') {
      const isUppercut = true;
      hit(opponent, isUppercut);
    }
  }, 125);
};

const applyKeys = () => {
  // Controls for player one.
  if (!state.one.disableInput) {
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
  if (!state.two.disableInput) {
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
