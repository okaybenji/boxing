const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);
const keyMap = {};
const state = {
  one: {
    health: 75,
    action: '',
    disableInput: false,
    // Give a window during which a player can uppercut instead of defending or jabbing.
    delayingInput: false,
    inputTimeout: undefined,
  },
  two: {
    health: 75,
    action: '',
    disableInput: false,
    delayingInput: false,
    inputTimeout: undefined,
  }
};

// Reload page w/o POST.
const reset = () => {
  window.location = window.location;
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
  state[player].delayingInput = false;

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
  if (state[player].delayingInput) {
    // We already received this command.
    return;
  }
  state[player].delayingInput = true;
  const execute = () => {
    state[player].inputTimeout = undefined;
    state[player].delayingInput = false;
    action();
  };

  // If player doesn't press up within the timeout period, defend/jab.
  clearTimeout(state[player].inputTimeout);
  state[player].inputTimeout = setTimeout(execute, 35);
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

const hitDelay = 150; // Time in ms a player has to block/dodge an incoming attack.

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
  }, hitDelay);
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
  }, hitDelay);
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
  }, hitDelay);
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
  }, hitDelay);
};

// Keyboard controls.
const applyKeys = () => {
  keyMap.Enter ? reset() : null;

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

const keyOn = e => {
  keyMap[e.key] = true;
  applyKeys();
};

const keyOff = e => {
  keyMap[e.key] = false;
};

window.addEventListener('keydown', keyOn, false);
window.addEventListener('keyup', keyOff, false);

/**
 * Gamepad controls via gamepad.js.
 * This works fine w/ Xbone controllers but PS4 support is not good.
 * TODO: Figure out how to do this w/o gamepad.js!
 */
const gamepad = new Gamepad();
const buttons = {
  button_1: 'punchLeft',
  button_2: 'punchRight',
  button_3: 'punchLeft',
  button_4: 'punchRight',
  shoulder_bottom_left: 'punchLeft',
  shoulder_bottom_right: 'punchRight',
  shoulder_top_left: 'dodgeLeft',
  shoulder_top_right: 'dodgeRight',
  select: '',
  start: '',
  stick_button_left: '',
  stick_button_right: '',
  d_pad_up: 'defend',
  d_pad_down: 'duck',
  d_pad_left: 'dodgeLeft',
  d_pad_right: 'dodgeRight',
  vendor: '',
};
// For now, just going to map gamepad buttons to keyboard keys.
const commandToKey = {
  one: {
    defend: `w`,
    dodgeLeft: `a`,
    duck: `s`,
    dodgeRight: `d`,
    punchLeft: `f`,
    punchRight: `g`,
  },
  two: {
    defend: `i`,
    dodgeLeft: `j`,
    duck: `k`,
    dodgeRight: `l`,
    punchLeft: `;`,
    punchRight: `'`,
  },
};

// Set whether button is pressed or not.
const updateButton = (e, pressed) => {
  /**
   * Even gamepads will control player 1, odds player 2.
   * I figure this way if there are multiple controllers plugged in,
   * players can use whichever ones they want.
   */
  const player = e.player % 2 === 0 ? 'one' : 'two';
  const key = commandToKey[player][buttons[e.button]];
  if (!key) {
    return;
  }
  keyMap[key] = pressed;
  applyKeys();
};

gamepad.on('press', Object.keys(buttons), e => {
  updateButton(e, true);
});

gamepad.on('release', Object.keys(buttons), e => {
  updateButton(e, false);
});

// Allow moving with analog sticks.
const threshold = 0.25;
gamepad.on('press', ['stick_axis_left', 'stick_axis_right'], e => {
  let button;
  if (Math.abs(e.value[0]) > threshold) {
    button = e.value[0] < 0 ? 'd_pad_left' : 'd_pad_right';
  } else if (Math.abs(e.value[1]) > threshold) {
    button = e.value[1] < 0 ? 'd_pad_up' : 'd_pad_down';
  }
  updateButton(Object.assign(e, {button}), true);
});

gamepad.on('release', ['stick_axis_left', 'stick_axis_right'], e => {
  updateButton(Object.assign(e, {button: 'd_pad_left'}), false);
  updateButton(Object.assign(e, {button: 'd_pad_right'}), false);
  updateButton(Object.assign(e, {button: 'd_pad_up'}), false);
  updateButton(Object.assign(e, {button: 'd_pad_down'}), false);
});

// Allow resetting the game.
gamepad.on('release', ['select', 'start', 'vendor'], e => {
  reset();
});
