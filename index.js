const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);

const keyMap = {};
const blockInput = {one: false, two: false};
const state = {
  one: {
    health: 75,
    // Give a window during which a player can uppercut instead of defending or jabbing.
    inputTimeout: undefined,
  },
  two: {
    health: 75,
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
    $$(`.${player}`).forEach(el => el.classList.add('knockout'));
  }
};

// Prevent player from taking an action for a given period of time.
const disableInput = (player, duration) => {
  clearTimeout(state[player].inputTimeout);
  blockInput[player] = true;

  setTimeout(() => {
    blockInput[player] = false;
  }, duration);
};

const duck = player => {
  disableInput(player, 500);
  animation(`.${player} div`, 'duck', 500);
};

const dodgeLeft = player => {
  disableInput(player, 500);
  animation(`.${player} div`, 'dodgeLeft', 500);
};

const dodgeRight = player => {
  disableInput(player, 500);
  animation(`.${player} div`, 'dodgeRight', 500);
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
  disableInput(player, 500);

  animation(`.${player} .left.arm`, 'defendLeft', 500);
  animation(`.${player} .right.arm`, 'defendRight', 500);
});

const jabLeft = player => executeAfterComboKeysWindowPasses(player, () => {
  disableInput(player, 500);
  animation(`.${player} .left`, 'jabLeft', 500);
  animation(`.${player}`, 'attack', 500);
});

const jabRight = player => executeAfterComboKeysWindowPasses(player, () => {
  disableInput(player, 500);
  animation(`.${player} .right`, 'jabRight', 500);
  animation(`.${player}`, 'attack', 500);
});

const uppercutLeft = player => {
  disableInput(player, 500);
  animation(`.${player} .body, .${player} .right.arm`, 'jump', 500);
  animation(`.${player} .left.arm`, 'uppercutLeft', 500);
  animation(`.${player}`, 'attack', 500);
};

const uppercutRight = player => {
  disableInput(player, 500);
  animation(`.${player} .body, .${player} .left.arm`, 'jump', 500);
  animation(`.${player} .right.arm`, 'uppercutRight', 500);
  animation(`.${player}`, 'attack', 500);
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
