// ========== КОНФІГУРАЦІЯ ГРИ ==========
const BASE_HP = 100;
const START_POINTS = 20;

// База даних зброї з характеристиками
const weaponsBase = {
  "меч": { damage: 35, strong: "легка", weak: "важка", cost: 10 },
  "сокира": { damage: 40, strong: "важка", weak: "середня", cost: 10 },
  "лук": { damage: 30, strong: "середня", weak: "без броні", cost: 10 },
};

// База даних броні
const armors = {
  "легка": { reduce: 5, weak_to: "меч", cost: 10 },
  "середня": { reduce: 10, weak_to: "сокира", cost: 10 },
  "важка": { reduce: 15, weak_to: "лук", cost: 10 },
  "без броні": { reduce: 0, weak_to: null, cost: 0 },
};

// Список ворогів
const enemiesList = [
  {name:"Артур", role:"лицар", hp:100},
  {name:"Хротгар", role:"варвар", hp:100},
  {name:"Ровен", role:"лучник", hp:100},
  {name:"Тарен", role:"лицар", hp:100},
  {name:"Дроган", role:"варвар", hp:100},
  {name:"Сіріон", role:"лицар", hp:200}
];

// Доступні локації
const locations = ["селище","місто","рівнини","болото"];

// ========== СТАН ГРИ ==========
let state = {
  player: null,
  enemy: null,
  location: null,
  round: 0,
  auto: false,
  currentRoundElement: null,
  battleEnded: false
};

// ========== DOM ЕЛЕМЕНТИ ==========
const logElement = document.getElementById('log');
const playerNameElement = document.getElementById('pName');
const playerHPElement = document.getElementById('pHP');
const playerWeaponElement = document.getElementById('pWeapon');
const playerArmorElement = document.getElementById('pArmor');
const playerPointsElement = document.getElementById('pPoints');
const enemyNameElement = document.getElementById('eName');
const enemyRoleElement = document.getElementById('eRole');
const enemyHPElement = document.getElementById('eHP');
const enemyWeaponElement = document.getElementById('eWeapon');
const enemyArmorElement = document.getElementById('eArmor');
const roundBadgeElement = document.getElementById('roundBadge');
const locationBadgeElement = document.getElementById('locationBadge');
const modeBadgeElement = document.getElementById('modeBadge');
const locationsWrapper = document.getElementById('locations');
const weaponSelectElement = document.getElementById('weaponSelect');
const armorSelectElement = document.getElementById('armorSelect');
const startButton = document.getElementById('startBtn');
const resetButton = document.getElementById('resetBtn');
const attackButtons = document.querySelectorAll('.attackbtn');
const autoButton = document.getElementById('autoBtn');
const upgradeUIElement = document.getElementById('upgradeUI');
const buyShieldButton = document.getElementById('buyShield');
const buyAxeButton = document.getElementById('buyAxe');
const buyBowButton = document.getElementById('buyBow');
const shopInfoElement = document.getElementById('shopInfo');

// Елементи інструкцій
const instructionsButton = document.getElementById('instructionsBtn');
const instructionsOverlayElement = document.getElementById('instructionsOverlay');
const instructionsCloseButton = document.getElementById('instructionsClose');
const instructionsTabs = document.querySelectorAll('.instructions-tab');
const instructionsContents = document.querySelectorAll('.instructions-content');

// Елементи інформаційних кнопок
const weaponInfoBtn = document.getElementById('weaponInfoBtn');
const locationInfoBtn = document.getElementById('locationInfoBtn');
const upgradeInfoBtn = document.getElementById('upgradeInfoBtn');
const weaponInfoSection = document.getElementById('weaponInfo');
const locationInfoSection = document.getElementById('locationInfo');
const upgradeInfoSection = document.getElementById('upgradeInfo');

let currentInfoSection = null;
let selectedLocation = locations[0];

// ========== КЛАС БІЙЦЯ ==========
class Combatant {
  constructor(name, role = null, hp = BASE_HP) {
    this.name = name;
    this.role = role;
    this.maxHp = hp;
    this.hp = hp;
    this.points = START_POINTS;
    this.weapon = null;
    this.weaponDamage = {};
    this.armor = "без броні";
    this.preferred = null;
    this.firstAttackDone = false;
    this.shield = false;
  }

  // Отримання загального урону для зброї
  getWeaponDamage(weaponName) {
    const baseDamage = weaponsBase[weaponName]?.damage || 0;
    const additionalDamage = this.weaponDamage[weaponName] || 0;
    return baseDamage + additionalDamage;
  }
}

// ========== ІНФОРМАЦІЙНІ СЕКЦІЇ ==========
function showInfoSection(section) {
  if (currentInfoSection) {
    currentInfoSection.style.display = 'none';
  }
  section.style.display = 'block';
  currentInfoSection = section;
}

function hideAllInfoSections() {
  weaponInfoSection.style.display = 'none';
  locationInfoSection.style.display = 'none';
  upgradeInfoSection.style.display = 'none';
  currentInfoSection = null;
}

// Обробники подій для кнопок інформації
weaponInfoBtn.addEventListener('click', () => {
  if (currentInfoSection === weaponInfoSection) {
    hideAllInfoSections();
  } else {
    showInfoSection(weaponInfoSection);
  }
});

locationInfoBtn.addEventListener('click', () => {
  if (currentInfoSection === locationInfoSection) {
    hideAllInfoSections();
  } else {
    showInfoSection(locationInfoSection);
  }
});

upgradeInfoBtn.addEventListener('click', () => {
  if (currentInfoSection === upgradeInfoSection) {
    hideAllInfoSections();
  } else {
    showInfoSection(upgradeInfoSection);
  }
});

// ========== ІНСТРУКЦІЇ ==========
function showInstructions() {
  instructionsOverlayElement.classList.add('active');
}

function hideInstructions() {
  instructionsOverlayElement.classList.remove('active');
}

function switchTab(tabName) {
  instructionsTabs.forEach(tab => {
    tab.classList.remove('active');
  });

  instructionsContents.forEach(content => {
    content.classList.remove('active');
  });

  const selectedTab = document.querySelector(`.instructions-tab[data-tab="${tabName}"]`);
  const selectedContent = document.getElementById(`${tabName}Content`);

  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  if (selectedContent) {
    selectedContent.classList.add('active');
  }
}

instructionsButton.addEventListener('click', showInstructions);
instructionsCloseButton.addEventListener('click', hideInstructions);
instructionsOverlayElement.addEventListener('click', (event) => {
  if (event.target === instructionsOverlayElement) {
    hideInstructions();
  }
});

instructionsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchTab(tab.dataset.tab);
  });
});

// ========== СИСТЕМА ЛОГУВАННЯ ==========
function appendLog(htmlContent, className = '') {
  const divElement = document.createElement('div');
  divElement.innerHTML = htmlContent;
  if (className) {
    divElement.className = className;
  }
  logElement.appendChild(divElement);
  logElement.scrollTop = logElement.scrollHeight;
}

function createRoundContainer(roundNumber) {
  const roundDiv = document.createElement('div');
  roundDiv.className = 'round-container';
  roundDiv.innerHTML = `
    <div class="round-header">
      <div class="round-number">Раунд ${roundNumber}</div>
      <div class="round-result" id="roundResult${roundNumber}">В процесі...</div>
    </div>
    <div class="round-content" id="roundContent${roundNumber}"></div>
  `;
  logElement.appendChild(roundDiv);
  logElement.scrollTop = logElement.scrollHeight;
  return roundDiv;
}

function updateRoundResult(roundNumber, result, className) {
  const resultElement = document.getElementById(`roundResult${roundNumber}`);
  if (resultElement) {
    resultElement.textContent = result;
    resultElement.className = `round-result ${className}`;
  }
}

function addToRoundContent(roundNumber, htmlContent) {
  const contentElement = document.getElementById(`roundContent${roundNumber}`);
  if (contentElement) {
    const divElement = document.createElement('div');
    divElement.innerHTML = htmlContent;
    contentElement.appendChild(divElement);
  }
}

// ========== ОНОВЛЕННЯ ІНТЕРФЕЙСУ ==========
function updateUI() {
  if (!state.player) return;

  playerNameElement.textContent = state.player.name;
  playerHPElement.textContent = state.player.hp;
  playerWeaponElement.textContent = state.player.weapon || '-';
  playerArmorElement.textContent = state.player.armor || '-';
  playerPointsElement.textContent = state.player.points;

  enemyNameElement.textContent = state.enemy.name;
  enemyRoleElement.textContent = state.enemy.role;
  enemyHPElement.textContent = state.enemy.hp;
  enemyWeaponElement.textContent = state.enemy.weapon || '-';
  enemyArmorElement.textContent = state.enemy.armor || '-';

  roundBadgeElement.textContent = `Раунд: ${state.round}`;
  locationBadgeElement.textContent = `Локація: ${state.location}`;
  modeBadgeElement.textContent = state.auto ? 'Режим: автогра' : 'Режим: ручний';
}

// ========== ІНІЦІАЛІЗАЦІЯ ЛОКАЦІЙ ==========
function renderLocationButtons() {
  locationsWrapper.innerHTML = '';

  locations.forEach((location, index) => {
    const button = document.createElement('button');
    button.className = 'locbtn' + (index === 0 ? ' active' : '');
    button.textContent = `${index + 1}. ${location}`;
    button.dataset.loc = location;
    button.addEventListener('click', () => {
      document.querySelectorAll('.locbtn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      weaponSelectElement.focus();
      selectedLocation = location;
    });
    locationsWrapper.appendChild(button);
  });
}

// ========== ПОЧАТОК ГРИ ==========
function startBattle() {
  logElement.innerHTML = '';
  state.battleEnded = false;

  const playerNameInput = document.getElementById('playerName');
  const playerName = playerNameInput.value.trim() || 'Герой';
  const player = new Combatant(playerName, null, BASE_HP);

  const randomEnemyData = enemiesList[Math.floor(Math.random() * enemiesList.length)];
  const enemy = new Combatant(randomEnemyData.name, randomEnemyData.role, randomEnemyData.hp);

  state.location = selectedLocation || locations[0];

  const chosenWeapon = weaponSelectElement.value;
  const chosenArmor = armorSelectElement.value;
  player.weapon = chosenWeapon;
  player.armor = chosenArmor;
  player.points = START_POINTS - (weaponsBase[chosenWeapon].cost || 0) - (armors[chosenArmor].cost || 0);
  if (player.points < 0) player.points = 0;

  const weaponKeys = Object.keys(weaponsBase);
  enemy.weapon = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
  const armorKeys = Object.keys(armors);
  enemy.armor = armorKeys[Math.floor(Math.random() * armorKeys.length)];

  state.player = player;
  state.enemy = enemy;
  state.round = 0;
  state.auto = false;
  autoButton.textContent = 'Автогра: вимк';

  appendLog(`<div style="color:var(--accent)"><strong>Починається бій!</strong> Локація: <em>${state.location}</em></div>`);
  appendLog(`<div class="small">Твій ворог: <strong>${enemy.role} ${enemy.name}</strong> (${enemy.hp} HP)</div>`);

  shopInfoElement.style.display = 'block';
  upgradeUIElement.style.display = 'none';
  updateUI();
}

// ========== МЕХАНІКА ХОДУ ==========
function resolveTurn(attacker, defender, attackMove, defenderMove, location, isPlayer) {
  let roundResult = '';
  let resultClass = '';

  // Атака голими руками (якщо немає зброї)
  if (!attacker.weapon) {
    const damage = 5;
    defender.hp = Math.max(0, defender.hp - damage);
    const attackerNameClass = attacker === state.player ? 'player-name' : 'enemy-name';
    addToRoundContent(state.round, `<div><span class="${attackerNameClass}">${attacker.name}</span> атакує голими руками. <span class="damage-warning">Урон: ${damage}</span>. ${defender.name} HP → ${defender.hp}</div>`);
    roundResult = 'Удар голими руками';
    resultClass = 'round-warning';
    return { result: roundResult, class: resultClass };
  }

  // Нічия
  if (attackMove === defenderMove) {
    addToRoundContent(state.round, `<div>Нічия: ${attacker.name} обрав ${attackMove}, ${defender.name} обрав ${defenderMove}</div>`);
    roundResult = 'Нічия';
    resultClass = 'round-warning';
    return { result: roundResult, class: resultClass };
  }

  // Система "камінь-ножиці-папір"
  const beats = (attack, defense) => {
    return (attack === 'меч' && defense === 'лук') ||
           (attack === 'сокира' && defense === 'меч') ||
           (attack === 'лук' && defense === 'сокира');
  };

  const winnerIsAttacker = beats(attackMove, defenderMove);
  if (!winnerIsAttacker) {
    const attackerNameClass = attacker === state.player ? 'player-name' : 'enemy-name';
    const defenderNameClass = defender === state.player ? 'player-name' : 'enemy-name';
    addToRoundContent(state.round, `<div><span class="${attackerNameClass}">${attacker.name}</span> програв хід (<span class="damage-danger">${attackMove}</span> проти <span class="damage-success">${defenderMove}</span>).</div>`);
    roundResult = 'Програш ходу';
    resultClass = 'round-danger';
    return { result: roundResult, class: resultClass };
  }

  // РОЗРАХУНОК УРОНУ
  const baseDamage = attacker.getWeaponDamage(attacker.weapon);
  let weaponBonus = 0;
  const defenderArmor = armors[defender.armor];

  // Бонус проти слабкої броні
  if (defenderArmor && defenderArmor.weak_to === attacker.weapon) {
    weaponBonus = 10;
  }

  // Бонус локації
  let locationBonus = 0;
  if (attacker.role === 'лицар') {
    if (location === 'місто') locationBonus = Math.floor((baseDamage + weaponBonus) * 0.15);
    else if (location === 'селище') locationBonus = Math.floor((baseDamage + weaponBonus) * 0.10);
    else if (location === 'рівнини') locationBonus = Math.floor((baseDamage + weaponBonus) * 0.05);
  } else if (attacker.role === 'варвар') {
    if (location === 'болото' || location === 'рівнини') locationBonus = Math.floor((baseDamage + weaponBonus) * 0.10);
  }

  let totalDamage = baseDamage + weaponBonus + locationBonus - (defenderArmor ? defenderArmor.reduce : 0);
  if (totalDamage < 0) totalDamage = 0;

  // КРИТИЧНІ УДАРИ
  let isCritical = false;
  let criticalMultiplier = 1;

  if (attacker.role === 'лучник' && !attacker.firstAttackDone) {
    isCritical = true;
    attacker.firstAttackDone = true;
    criticalMultiplier = 2;
    totalDamage = totalDamage * criticalMultiplier;
  } else {
    if (Math.random() < 0.2) {
      isCritical = true;
      criticalMultiplier = 2;
      totalDamage = totalDamage * criticalMultiplier;
    }
  }

  // БЛОКУВАННЯ ЩИТОМ
  let shieldBlocked = 0;
  if (defender.shield) {
    const previousDamage = totalDamage;
    shieldBlocked = Math.floor(totalDamage / 2);
    totalDamage = Math.floor(totalDamage / 2);
    addToRoundContent(state.round, `<div class="small" style="color:var(--muted)">${defender.name} щитом заблоковано ${shieldBlocked} урону</div>`);
  }

  totalDamage = Math.floor(totalDamage);
  defender.hp = Math.max(0, defender.hp - totalDamage);
  attacker.points += 5;
  attacker.preferred = attackMove;

  const attackerNameClass = attacker === state.player ? 'player-name success' : 'enemy-name danger';
  const defenderNameClass = defender === state.player ? 'player-name' : 'enemy-name';

  // ДЕТАЛЬНЕ ЛОГУВАННЯ УРОНУ
  let detail = `<div><span class="${attackerNameClass}">${attacker.name}</span> атакує <span class="${defenderNameClass}">${defender.name}</span> (${attacker.weapon})</div>`;
  detail += `<div class="small">  Базовий урон: ${baseDamage}</div>`;

  if (weaponBonus) {
    detail += `<div class="small">  Бонус проти броні: <span class="damage-success">+${weaponBonus}</span></div>`;
  }

  if (locationBonus) {
    detail += `<div class="small">  Бонус локації (${location}): <span class="damage-success">+${locationBonus}</span></div>`;
  }

  if (defenderArmor) {
    detail += `<div class="small">  Зменшення від броні (${defender.armor}): <span class="damage-danger">-${defenderArmor.reduce}</span></div>`;
  }

  if (isCritical) {
    detail += `<div style="color:var(--success)">  🎯 Критичний удар! (×${criticalMultiplier})</div>`;
  }

  if (shieldBlocked) {
    detail += `<div class="small" style="color:var(--muted)">  Щит заблокував: ${shieldBlocked}</div>`;
  }

  detail += `<div style="margin-top:6px">  Підсумковий урон: <span class="damage-success"><strong>${totalDamage}</strong></span></div>`;
  detail += `<div class="small">  ${defender.name} має ${defender.hp} HP залишилось</div>`;

  addToRoundContent(state.round, detail);

  roundResult = `Удар: ${totalDamage} урону` + (isCritical ? ' (Крит!)' : '');
  resultClass = 'round-success';

  return { result: roundResult, class: resultClass };
}

// ========== ОБРОБНИКИ ПОДІЙ ==========
startButton.addEventListener('click', () => {
  startBattle();
  appendLog(`<div class="small">Початкові покупки застосовано.</div>`);
  updateUI();
});

resetButton.addEventListener('click', () => {
  state = {
    player: null,
    enemy: null,
    location: null,
    round: 0,
    auto: false,
    currentRoundElement: null,
    battleEnded: false
  };

  logElement.innerHTML = '';
  document.getElementById('playerName').value = 'Герой';
  weaponSelectElement.value = 'меч';
  armorSelectElement.value = 'без броні';
  shopInfoElement.style.display = 'none';
  upgradeUIElement.style.display = 'none';

  document.querySelectorAll('.locbtn').forEach((button, index) => {
    button.classList.remove('active');
    if (index === 0) {
      button.classList.add('active');
    }
  });

  selectedLocation = locations[0];

  playerNameElement.textContent = 'Герой';
  playerHPElement.textContent = '100';
  playerWeaponElement.textContent = '-';
  playerArmorElement.textContent = '-';
  playerPointsElement.textContent = '0';
  enemyNameElement.textContent = 'Ворог';
  enemyRoleElement.textContent = '-';
  enemyHPElement.textContent = '100';
  enemyWeaponElement.textContent = '-';
  enemyArmorElement.textContent = '-';
  roundBadgeElement.textContent = 'Раунд: 0';
  locationBadgeElement.textContent = 'Локація: -';
  modeBadgeElement.textContent = 'Режим: ручний';
  autoButton.textContent = 'Автогра: вимк';

  appendLog(`<div class="small">Гра скинута. Введи ім'я, обери локацію, зброю та броню, потім натисни "Почати бій".</div>`);
});

attackButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!state.player) {
      appendLog('<div class="small">спочатку натисни "Почати бій"</div>');
      return;
    }

    if (state.battleEnded) {
      appendLog('<div class="small">Бій завершено. Натисни "Скинути" для нового бою.</div>');
      return;
    }

    const move = button.dataset.attack;
    playerTurn(move);
  });
});

autoButton.addEventListener('click', () => {
  if (!state.player) {
    appendLog('<div class="small">Спочатку почни бій</div>');
    return;
  }

  if (state.battleEnded) {
    appendLog('<div class="small">Бій завершено. Натисни "Скинути" для нового бою.</div>');
    return;
  }

  state.auto = !state.auto;
  autoButton.textContent = state.auto ? 'Автогра: вімк' : 'Автогра: вимк';
  modeBadgeElement.textContent = state.auto ? 'Режим: автогра' : 'Режим: ручний';

  if (state.auto) {
    autoLoop();
  }
});

// ========== ХОД ГРАВЦЯ ==========
function playerTurn(move) {
  if (!state.player || !state.enemy) return;
  if (!move) {
    appendLog('<div class="small">невірний хід</div>');
    return;
  }

  state.round++;
  roundBadgeElement.textContent = `Раунд: ${state.round}`;

  state.currentRoundElement = createRoundContainer(state.round);

  const enemyMove = getRandomAttack();

  const playerResult = resolveTurnAndLog(state.player, state.enemy, move, enemyMove);
  updateRoundResult(state.round, playerResult.result, playerResult.class);

  if (state.enemy.hp <= 0) {
    endBattle(true);
    updateUI();
    return;
  }

  const enemyResult = resolveTurnAndLog(state.enemy, state.player, enemyMove, move);

  const finalResult = enemyResult.result === 'Програш ходу' ? playerResult.result :
                     playerResult.result === 'Програш ходу' ? enemyResult.result :
                     `Гравець: ${playerResult.result} | Ворог: ${enemyResult.result}`;

  const finalClass = enemyResult.class === 'round-danger' ? playerResult.class :
                    playerResult.class === 'round-danger' ? enemyResult.class :
                    'round-warning';

  updateRoundResult(state.round, finalResult, finalClass);

  if (state.player.hp <= 0) {
    endBattle(false);
    updateUI();
    return;
  }

  postRoundProcedures();
  updateUI();
}

function resolveTurnAndLog(attacker, defender, attackMove, defenderMove) {
  return resolveTurn(attacker, defender, attackMove, defenderMove, state.location, attacker === state.player);
}

function getRandomAttack() {
  const attacks = ["меч", "сокира", "лук"];
  return attacks[Math.floor(Math.random() * attacks.length)];
}

// ========== ПОСТ-РАУНДОВА ЛОГІКА ==========
function postRoundProcedures() {
  // Покращення кожні 5 раундів
  if (state.round % 5 === 0 && state.player.hp > 0 && state.enemy.hp > 0) {
    upgradeUIElement.style.display = 'block';
    addToRoundContent(state.round, `<div style="color:var(--accent)">Покращення доступні. Обери опцію.</div>`);
  } else {
    upgradeUIElement.style.display = 'none';
  }

  // Магазин кожні 10 раундів
  if (state.round % 10 === 0 && state.player.hp > 0 && state.enemy.hp > 0) {
    addToRoundContent(state.round, `<div style="color:var(--accent)">Магазин доступний. Ти можеш змінити зброю або броню.</div>`);
    setTimeout(() => { openShop(); }, 200);
  }

  // Статистика кожні 5 раундів
  if (state.round % 5 === 0) {
    addToRoundContent(state.round, `<div class="small">Статистика: ${state.player.name}: ${state.player.hp} HP, очки: ${state.player.points} | ${state.enemy.name}: ${state.enemy.hp} HP</div>`);
  }
}

// ========== МАГАЗИН ==========
function openShop() {
  const weaponChoices = Object.keys(weaponsBase).join(', ');
  const armorChoices = Object.keys(armors).join(', ');

  const newWeapon = prompt(`Магазин\nДоступні зброї: ${weaponChoices}\nВведи назву зброї або залиш порожнім, щоб пропустити:`);
  if (newWeapon && weaponsBase[newWeapon]) {
    state.player.weapon = newWeapon;
    addToRoundContent(state.round, `<div class="small">Ти купив/обрав зброю: ${newWeapon}</div>`);
  }

  const newArmor = prompt(`Магазин\nДоступні броні: ${armorChoices}\nВведи назву броні або залиш порожнім:`);
  if (newArmor && armors[newArmor]) {
    state.player.armor = newArmor;
    addToRoundContent(state.round, `<div class="small">Ти купив/обрав броню: ${newArmor}</div>`);
  }

  updateUI();
}

// ========== ПОКРАЩЕННЯ ==========
buyShieldButton.addEventListener('click', () => {
  if (!state.player) return;

  state.player.shield = true;
  addToRoundContent(state.round, `<div class="small">Ти отримав щит: тепер 50% урону блокується.</div>`);
  upgradeUIElement.style.display = 'none';
});

buyAxeButton.addEventListener('click', () => {
  if (!state.player) return;

  if (state.player.weapon === 'сокира') {
    state.player.weaponDamage['сокира'] = (state.player.weaponDamage['сокира'] || 0) + 10;
    addToRoundContent(state.round, `<div class="small">Сокира покращена: <span class="damage-success">+10 урону</span> для сокири.</div>`);
  } else {
    addToRoundContent(state.round, `<div class="small">У тебе немає сокири — покращення не застосовано.</div>`);
  }

  upgradeUIElement.style.display = 'none';
});

buyBowButton.addEventListener('click', () => {
  if (!state.player) return;

  if (state.player.weapon === 'лук') {
    state.player.weaponDamage['лук'] = (state.player.weaponDamage['лук'] || 0) + 10;
    addToRoundContent(state.round, `<div class="small">Лук покращено: <span class="damage-success">+10 урону</span> для лука.</div>`);
  } else {
    addToRoundContent(state.round, `<div class="small">У тебе немає лука — покращення не застосовано.</div>`);
  }

  upgradeUIElement.style.display = 'none';
});

// ========== ЗАВЕРШЕННЯ БОЮ ==========
function endBattle(playerWon) {
  state.battleEnded = true;

  if (playerWon) {
    appendLog(`<div class="round-container battle-won">
      <div class="round-header">
        <div class="round-number">🎉 Перемога!</div>
        <div class="round-result round-success">Ти переміг ${state.enemy.role}а ${state.enemy.name}!</div>
      </div>
      <div class="round-content">
        <div style="color:var(--success)"><strong>Вітаємо з перемогою!</strong></div>
        <div class="small">Залишилось HP: ${state.player.hp}</div>
        <div class="small">Накопичено очок: ${state.player.points}</div>
      </div>
    </div>`);
  } else {
    appendLog(`<div class="round-container battle-lost">
      <div class="round-header">
        <div class="round-number">💀 Поразка</div>
        <div class="round-result round-danger">На жаль, ${state.enemy.role} ${state.enemy.name} здолав тебе...</div>
      </div>
      <div class="round-content">
        <div style="color:var(--danger)"><strong>Не засмучуйся! Спробуй ще раз!</strong></div>
        <div class="small">У ворога залишилось HP: ${state.enemy.hp}</div>
      </div>
    </div>`);
  }

  updateUI();
  state.auto = false;
  autoButton.textContent = 'Автогра: вимк';
  upgradeUIElement.style.display = 'none';
}

// ========== АВТОМАТИЧНА ГРА ==========
function autoLoop() {
  if (!state.player || !state.enemy) return;
  if (!state.auto) return;

  if (state.player.hp <= 0 || state.enemy.hp <= 0) {
    state.auto = false;
    autoButton.textContent = 'Автогра: вимк';
    return;
  }

  const attacks = ["меч", "сокира", "лук"];
  const move = attacks[Math.floor(Math.random() * attacks.length)];
  playerTurn(move);

  setTimeout(() => {
    if (state.auto) {
      autoLoop();
    }
  }, 800);
}

// ========== ІНІЦІАЛІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ ==========
window.addEventListener('load', () => {
  appendLog(`<div class="small">Введи ім'я, обери локацію, зброю та броню, потім натисни "Почати бій".</div>`);
  renderLocationButtons();

  document.querySelectorAll('.locbtn').forEach(button => {
    button.addEventListener('click', () => {
      selectedLocation = button.dataset.loc;
    });
  });

  hideAllInfoSections();
});

function updateEverything() {
  updateUI();
}