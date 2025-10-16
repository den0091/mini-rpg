// ===== ГЛОБАЛЬНІ ЗМІННІ ТА КОНФІГУРАЦІЯ =====

/**
 * Основний об'єкт стану гри
 * Зберігає всю інформацію про гравця, ворога та поточний стан гри
 */
const gameState = {
    player: {
        name: "Воїн",
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        gold: 150,
        weapon: "меч",
        armor: "без броні",
        location: "Ліс"
    },
    enemy: null,           // Поточний ворог
    inBattle: false,       // Чи триває бій
    battleRound: 0         // Номер поточного раунду
};

/**
 * Дані про характеристики зброї
 * Кожна зброя має свої унікальні параметри
 */
const weaponData = {
    "меч": {
        minDamage: 15,
        maxDamage: 20,
        speed: "середня",
        critChance: 15
    },
    "сокира": {
        minDamage: 18,
        maxDamage: 25,
        speed: "низька",
        critChance: 20
    },
    "лук": {
        minDamage: 12,
        maxDamage: 18,
        speed: "висока",
        critChance: 25
    }
};

/**
 * Дані про характеристики броні
 * Кожен тип броні має різні бонуси до захисту та інших параметрів
 */
const armorData = {
    "легка": {
        name: "Легка Броня",
        description: "Мобільність понад усе",
        defense: 10,
        dodge: 20,
        stats: [
            "Захист: +10%",
            "Шанс уникнення: +20%",
            "Швидкість атаки: +15%",
            "Критичний удар: +5%"
        ],
        locations: [
            "Шкіряна броня - Крамниця міста (200 золота)",
            "Кольчуга - Фортеця гномів (400 золота)",
            "Ельфійський обладунок - Таємничий ліс (600 золота)"
        ],
        upgrades: [
            "Покращення I: +5% до захисту (100 золота)",
            "Покращення II: +10% до шансу уникнення (200 золота)",
            "Покращення III: +8% до швидкості атаки (300 золота)"
        ]
    },
    "середня": {
        name: "Середня Броня",
        description: "Баланс захисту та мобільності",
        defense: 25,
        dodge: 10,
        stats: [
            "Захист: +25%",
            "Шанс уникнення: +10%",
            "Швидкість атаки: +5%",
            "Стійкість: +15%"
        ],
        locations: [
            "Кольчужний обладунок - Казарми (350 золота)",
            "Чешуйчата броня - Гірські печери (550 золота)",
            "Міфрилова броня - Кузня магії (750 золота)"
        ],
        upgrades: [
            "Покращення I: +8% до захисту (150 золота)",
            "Покращення II: +12% до стійкості (250 золота)",
            "Покращення III: +10% до шансу уникнення (350 золота)"
        ]
    },
    "важка": {
        name: "Важка Броня",
        description: "Максимальний захист",
        defense: 40,
        dodge: 5,
        stats: [
            "Захист: +40%",
            "Стійкість: +25%",
            "Блок: +15%",
            "Відображення шкоди: +10%"
        ],
        locations: [
            "Латний обладунок - Королівський арсенал (500 золота)",
            "Обладунок дракона - Лігво дракона (800 золота)",
            "Броня древніх - Забутий храм (1100 золота)"
        ],
        upgrades: [
            "Покращення I: +10% до захисту (200 золота)",
            "Покращення II: +15% до блоку (300 золота)",
            "Покращення III: +12% до відображення шкоди (400 золота)"
        ]
    },
    "без броні": {
        name: "Без Броні",
        description: "Повна мобільність",
        defense: 0,
        dodge: 30,
        stats: [
            "Швидкість атаки: +25%",
            "Критичний удар: +15%",
            "Маневреність: +20%",
            "Шанс уникнення: +30%"
        ],
        locations: [
            "Базові навички - Доступні з початку",
            "Техніки уникнення - Тренувальний майданчик",
            "Мистецтво контр-атаки - Школа бою"
        ],
        upgrades: [
            "Тренування I: +10% до швидкості (50 золота)",
            "Тренування II: +8% до критичного удару (100 золота)",
            "Тренування III: +12% до маневреності (150 золота)"
        ]
    }
};

/**
 * Дані про ворогів для кожної локації
 * Кожна локація має своїх унікальних ворогів з різними характеристиками
 */
const enemyData = {
    "Ліс": [
        { name: "Гоблін", health: 50, maxHealth: 50, damage: "8-12", defense: 15, xp: 25, gold: 10 },
        { name: "Вовк", health: 40, maxHealth: 40, damage: "10-15", defense: 10, xp: 20, gold: 8 },
        { name: "Лісовий троль", health: 80, maxHealth: 80, damage: "12-18", defense: 20, xp: 40, gold: 15 }
    ],
    "Гори": [
        { name: "Орк", health: 70, maxHealth: 70, damage: "15-20", defense: 25, xp: 35, gold: 12 },
        { name: "Гірський ведмідь", health: 90, maxHealth: 90, damage: "18-25", defense: 30, xp: 50, gold: 18 },
        { name: "Гном-варвар", health: 60, maxHealth: 60, damage: "20-28", defense: 35, xp: 45, gold: 20 }
    ],
    "Підземелля": [
        { name: "Скелет", health: 45, maxHealth: 45, damage: "10-16", defense: 5, xp: 30, gold: 15 },
        { name: "Привид", health: 55, maxHealth: 55, damage: "12-20", defense: 0, xp: 35, gold: 20 },
        { name: "Некромант", health: 70, maxHealth: 70, damage: "25-35", defense: 15, xp: 60, gold: 30 }
    ],
    "Пустеля": [
        { name: "Скорпіон", health: 40, maxHealth: 40, damage: "15-22", defense: 20, xp: 25, gold: 12 },
        { name: "Кобольд", health: 55, maxHealth: 55, damage: "18-25", defense: 25, xp: 35, gold: 18 },
        { name: "Пустельний дракон", health: 120, maxHealth: 120, damage: "30-45", defense: 40, xp: 100, gold: 50 }
    ]
};

// ===== ФУНКЦІЇ ДЛЯ РОБОТИ З ІНТЕРФЕЙСОМ =====

/**
 * Оновлює весь інтерфейс гри на основі поточного стану
 * Включає здоров'я, золото, рівень, характеристики зброї та броні
 */
function updateGameDisplay() {
    // Оновлення інформації про гравця
    document.getElementById('playerName').value = gameState.player.name;
    document.getElementById('playerHealth').textContent = `${gameState.player.health}/${gameState.player.maxHealth}`;
    document.getElementById('playerHealthBar').style.width = `${(gameState.player.health / gameState.player.maxHealth) * 100}%`;

    // Оновлення статусів
    document.getElementById('currentHealth').textContent = `${gameState.player.health}/${gameState.player.maxHealth}`;
    document.getElementById('currentHealthBar').style.width = `${(gameState.player.health / gameState.player.maxHealth) * 100}%`;
    document.getElementById('currentGold').textContent = gameState.player.gold;
    document.getElementById('playerLevel').textContent = gameState.player.level;
    document.getElementById('playerXP').textContent = `${gameState.player.xp}/${gameState.player.xpToNextLevel}`;

    // Оновлення характеристик зброї
    const weapon = weaponData[gameState.player.weapon];
    document.getElementById('currentAttack').textContent = `${weapon.minDamage}-${weapon.maxDamage}`;

    // Оновлення захисту
    const armor = armorData[gameState.player.armor];
    document.getElementById('currentDefense').textContent = `${armor.defense}%`;

    // Колір здоров'я (червоний при низькому здоров'ї, жовтий при середньому)
    const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
    const healthBar = document.getElementById('currentHealthBar');
    healthBar.className = 'health-fill';
    if (healthPercent < 30) {
        healthBar.classList.add('danger');
    } else if (healthPercent < 60) {
        healthBar.classList.add('warning');
    }
}

/**
 * Оновлює інформацію про броню в інформаційній секції
 * @param {string} armorType - Тип броні для відображення
 */
function updateArmorInfo(armorType) {
    const armor = armorData[armorType];
    if (!armor) return;

    const armorInfoHTML = `
        <div class="info-section">
            <h4>${armor.name}</h4>
            <p class="small">${armor.description}</p>

            <div class="armor-details">
                <div class="armor-card ${armorType}">
                    <h5>🛡️ Характеристики</h5>
                    <ul>
                        ${armor.stats.map(stat => `<li>${stat}</li>`).join('')}
                    </ul>
                </div>

                <div class="armor-card ${armorType}">
                    <h5>📍 Локації</h5>
                    <div class="location-grid">
                        ${armor.locations.map(location => `
                            <div class="location-item">
                                <h6>${location.split(' - ')[0]}</h6>
                                <span class="small">${location.split(' - ')[1] || ''}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="upgrade-info">
                <h5>⚡ Покращення</h5>
                ${armor.upgrades.map(upgrade => `
                    <div class="upgrade-item">
                        <span class="small">${upgrade}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const armorInfoContainer = document.getElementById('armorInfoContent');
    if (armorInfoContainer) {
        armorInfoContainer.innerHTML = armorInfoHTML;
    }
}

/**
 * Оновлює відображення інформації про ворога
 */
function updateEnemyDisplay() {
    if (!gameState.enemy) return;

    document.getElementById('enemyName').textContent = gameState.enemy.name;
    document.getElementById('enemyHealth').textContent = `${gameState.enemy.health}/${gameState.enemy.maxHealth}`;
    document.getElementById('enemyHealthBar').style.width = `${(gameState.enemy.health / gameState.enemy.maxHealth) * 100}%`;
    document.getElementById('enemyAttack').textContent = gameState.enemy.damage;
    document.getElementById('enemyDefense').textContent = `${gameState.enemy.defense}%`;

    // Колір здоров'я ворога
    const healthPercent = (gameState.enemy.health / gameState.enemy.maxHealth) * 100;
    const healthBar = document.getElementById('enemyHealthBar');
    healthBar.className = 'health-fill';
    if (healthPercent < 30) {
        healthBar.classList.add('danger');
    } else if (healthPercent < 60) {
        healthBar.classList.add('warning');
    }
}

/**
 * Додає запис до бойового журналу
 * @param {string} message - Повідомлення для додавання
 * @param {string} type - Тип повідомлення (player, enemy, victory, defeat, level, info)
 */
function addBattleLog(message, type) {
    const battleLog = document.getElementById('battleLog');
    const roundContainer = document.createElement('div');
    roundContainer.className = 'round-container';

    // Додаємо класи в залежності від типу повідомлення
    if (type === 'victory') {
        roundContainer.classList.add('battle-won');
    } else if (type === 'defeat') {
        roundContainer.classList.add('battle-lost');
    }

    // Створюємо заголовок раунду
    const roundHeader = document.createElement('div');
    roundHeader.className = 'round-header';

    const roundNumber = document.createElement('span');
    roundNumber.className = 'round-number';
    roundNumber.textContent = `Раунд ${gameState.battleRound}`;

    const roundResult = document.createElement('span');
    roundResult.className = 'round-result';

    // Встановлюємо колір та текст результату
    if (type === 'player' || type === 'victory' || type === 'level') {
        roundResult.classList.add('round-success');
        roundResult.textContent = 'Успіх';
    } else if (type === 'enemy' || type === 'defeat') {
        roundResult.classList.add('round-danger');
        roundResult.textContent = 'Небезпека';
    } else {
        roundResult.classList.add('round-warning');
        roundResult.textContent = 'Інфо';
    }

    roundHeader.appendChild(roundNumber);
    roundHeader.appendChild(roundResult);

    // Додаємо контент повідомлення
    const roundContent = document.createElement('div');
    roundContent.className = 'round-content';
    roundContent.innerHTML = message;

    roundContainer.appendChild(roundHeader);
    roundContainer.appendChild(roundContent);

    // Додаємо новий запис на початок журналу
    battleLog.insertBefore(roundContainer, battleLog.firstChild);

    // Обмежуємо кількість записів у журналі
    if (battleLog.children.length > 10) {
        battleLog.removeChild(battleLog.lastChild);
    }
}

// ===== БОЙОВІ ФУНКЦІЇ =====

/**
 * Починає новий бій з випадковим ворогом з поточної локації
 */
function startBattle() {
    const location = gameState.player.location;
    const enemies = enemyData[location];
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];

    // Ініціалізуємо ворога
    gameState.enemy = {...randomEnemy};
    gameState.inBattle = true;
    gameState.battleRound = 0;

    // Показуємо бойові елементи інтерфейсу
    document.getElementById('enemyStats').style.display = 'flex';
    document.getElementById('battleControls').style.display = 'flex';
    document.getElementById('mainControls').style.display = 'none';

    // Оновлюємо інформацію про ворога
    updateEnemyDisplay();

    // Додаємо запис у журнал
    addBattleLog(`Бій почався! Ви зустріли ${gameState.enemy.name}!`, 'info');
}

/**
 * Виконує атаку гравця
 * @param {string} type - Тип атаки ('basic' або 'power')
 */
function playerAttack(type) {
    if (!gameState.inBattle || !gameState.enemy) return;

    gameState.battleRound++;
    let playerDamage = 0;
    let message = "";

    // Розраховуємо базову шкоду від зброї
    const weapon = weaponData[gameState.player.weapon];
    const baseDamage = Math.floor(Math.random() * (weapon.maxDamage - weapon.minDamage + 1)) + weapon.minDamage;

    // Визначаємо тип атаки
    switch(type) {
        case 'basic':
            playerDamage = baseDamage;
            message = `Ви атакуєте ${gameState.enemy.name} і завдаєте <span class="damage-success">${playerDamage} шкоди</span>`;
            break;
        case 'power':
            playerDamage = Math.floor(baseDamage * 1.5);
            message = `Ви виконуєте силову атаку по ${gameState.enemy.name} і завдаєте <span class="damage-success">${playerDamage} шкоди</span>`;
            break;
    }

    // Застосовуємо захист ворога
    const defenseReduction = gameState.enemy.defense / 100;
    playerDamage = Math.max(1, Math.floor(playerDamage * (1 - defenseReduction)));

    // Завдаємо шкоди ворогу
    gameState.enemy.health -= playerDamage;
    addBattleLog(message, 'player');

    // Перевіряємо чи ворог мертвий
    if (gameState.enemy.health <= 0) {
        endBattle(true);
        return;
    }

    // Ворог атакує у відповідь
    enemyTurn();
}

/**
 * Хід ворога - атака гравця
 */
function enemyTurn() {
    if (!gameState.inBattle || !gameState.enemy) return;

    // Розраховуємо шкоду ворога
    const enemyDamageRange = gameState.enemy.damage.split('-').map(Number);
    const enemyDamage = Math.floor(Math.random() * (enemyDamageRange[1] - enemyDamageRange[0] + 1)) + enemyDamageRange[0];

    // Застосовуємо захист гравця
    const armor = armorData[gameState.player.armor];
    const defenseReduction = armor.defense / 100;
    const finalDamage = Math.max(1, Math.floor(enemyDamage * (1 - defenseReduction)));

    // Завдаємо шкоди гравцю
    gameState.player.health -= finalDamage;
    addBattleLog(`${gameState.enemy.name} атакує вас і завдає <span class="damage-danger">${finalDamage} шкоди</span>`, 'enemy');

    // Оновлюємо відображення здоров'я
    updateGameDisplay();

    // Перевіряємо чи гравець мертвий
    if (gameState.player.health <= 0) {
        endBattle(false);
    } else {
        updateEnemyDisplay();
    }
}

/**
 * Гравець використовує захист
 */
function playerDefend() {
    if (!gameState.inBattle || !gameState.enemy) return;

    gameState.battleRound++;
    addBattleLog(`Ви захищаєтесь, зменшуючи отримувану шкоду на 50%`, 'player');

    // Ворог атакує зі зменшеною шкодою
    const enemyDamageRange = gameState.enemy.damage.split('-').map(Number);
    const enemyDamage = Math.floor(Math.random() * (enemyDamageRange[1] - enemyDamageRange[0] + 1)) + enemyDamageRange[0];
    const finalDamage = Math.max(1, Math.floor(enemyDamage * 0.5));

    gameState.player.health -= finalDamage;
    addBattleLog(`${gameState.enemy.name} атакує вас і завдає <span class="damage-danger">${finalDamage} шкоди</span> (зменшено через захист)`, 'enemy');

    updateGameDisplay();

    if (gameState.player.health <= 0) {
        endBattle(false);
    } else {
        updateEnemyDisplay();
    }
}

/**
 * Гравець використовує зцілення
 */
function playerHeal() {
    if (!gameState.inBattle) return;

    gameState.battleRound++;
    const healAmount = 25;
    gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + healAmount);

    addBattleLog(`Ви використовуєте зілля здоров'я та відновлюєте <span class="damage-success">${healAmount} здоров'я</span>`, 'player');
    updateGameDisplay();

    // Ворог атакує після зцілення
    enemyTurn();
}

/**
 * Завершує бій
 * @param {boolean} victory - Чи гравець переміг
 */
function endBattle(victory) {
    if (victory) {
        // Нагороджуємо гравця за перемогу
        const xpGained = gameState.enemy.xp;
        const goldGained = gameState.enemy.gold;

        gameState.player.xp += xpGained;
        gameState.player.gold += goldGained;

        addBattleLog(`Ви перемогли ${gameState.enemy.name}! Отримано <span class="damage-success">${xpGained} досвіду</span> та <span class="damage-warning">${goldGained} золота</span>`, 'victory');

        // Перевіряємо підвищення рівня
        if (gameState.player.xp >= gameState.player.xpToNextLevel) {
            levelUp();
        }
    } else {
        addBattleLog(`Ви програли бій з ${gameState.enemy.name}. Ви відновлюєте здоров'я.`, 'defeat');
        // Відновлюємо здоров'я після поразки
        gameState.player.health = gameState.player.maxHealth;
    }

    // Ховаємо бойові елементи
    document.getElementById('enemyStats').style.display = 'none';
    document.getElementById('battleControls').style.display = 'none';
    document.getElementById('mainControls').style.display = 'flex';

    // Оновлюємо стан гри
    gameState.inBattle = false;
    gameState.enemy = null;
    updateGameDisplay();
}

/**
 * Підвищує рівень гравця
 */
function levelUp() {
    gameState.player.level++;
    gameState.player.xp -= gameState.player.xpToNextLevel;
    gameState.player.xpToNextLevel = Math.floor(gameState.player.xpToNextLevel * 1.5);
    gameState.player.maxHealth += 20;
    gameState.player.health = gameState.player.maxHealth;
    gameState.player.maxMana += 10;
    gameState.player.mana = gameState.player.maxMana;

    addBattleLog(`<span class="damage-success">Вітаємо! Ви досягли ${gameState.player.level} рівня!</span>`, 'level');
    updateGameDisplay();
}

/**
 * Функція дослідження локації
 * Знаходить випадкові події та нагороди
 */
function exploreLocation() {
    const events = [
        "Ви знайшли схованку з 10 золотими монетами!",
        "Ви натрапили на мирного мандрівника, який поділився з вами їжею.",
        "Ви відкрили древні руїни, але нічого цінного не знайшли.",
        "Ви знайшли зцілювальну траву. Здоров'я відновлено на 10 пунктів.",
        "Ви натрапили на торговця, який пропонує вигідні угоди."
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    addBattleLog(randomEvent, 'info');

    // Випадкові нагороди за дослідження
    if (Math.random() > 0.7) {
        const goldFound = Math.floor(Math.random() * 20) + 5;
        gameState.player.gold += goldFound;
        addBattleLog(`Ви знайшли ${goldFound} золота!`, 'victory');
        updateGameDisplay();
    }
}

// ===== ІНІЦІАЛІЗАЦІЯ ТА ОБРОБНИКИ ПОДІЙ =====

/**
 * Ініціалізація гри після завантаження DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація інтерфейсу
    updateGameDisplay();
    updateArmorInfo(gameState.player.armor);

    // ===== ОБРОБНИКИ КНОПОК ІНФОРМАЦІЇ =====
    const weaponInfoBtn = document.getElementById('weaponInfoBtn');
    const armorInfoBtn = document.getElementById('armorInfoBtn');
    const weaponInfoSection = document.getElementById('weaponInfo');
    const armorInfoSection = document.getElementById('armorInfo');

    /**
     * Перемикає між інформацією про зброю та броню
     * @param {boolean} showWeapon - Показувати інформацію про зброю (true) чи броню (false)
     */
    function toggleInfo(showWeapon) {
        if (showWeapon) {
            weaponInfoSection.style.display = 'block';
            armorInfoSection.style.display = 'none';
            weaponInfoBtn.classList.add('active');
            armorInfoBtn.classList.remove('active');
        } else {
            weaponInfoSection.style.display = 'none';
            armorInfoSection.style.display = 'block';
            weaponInfoBtn.classList.remove('active');
            armorInfoBtn.classList.add('active');
        }
    }

    weaponInfoBtn.addEventListener('click', () => toggleInfo(true));
    armorInfoBtn.addEventListener('click', () => toggleInfo(false));

    // ===== ОБРОБНИКИ ВИБОРУ СПОРЯДЖЕННЯ =====

    // Обробник зміни броні
    const armorSelect = document.getElementById('armor');
    armorSelect.addEventListener('change', function() {
        gameState.player.armor = this.value;
        updateArmorInfo(this.value);
        updateGameDisplay();
    });

    // Обробник зміни зброї
    const weaponSelect = document.getElementById('weapon');
    weaponSelect.addEventListener('change', function() {
        gameState.player.weapon = this.value;
        updateGameDisplay();
    });

    // Обробник зміни імені
    const playerNameInput = document.getElementById('playerName');
    playerNameInput.addEventListener('change', function() {
        gameState.player.name = this.value || "Воїн";
    });

    // ===== ОБРОБНИКИ ЛОКАЦІЙ =====
    const locationButtons = document.querySelectorAll('.locbtn');
    locationButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            locationButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            gameState.player.location = this.textContent;
        });
    });

    // ===== БОЙОВІ ОБРОБНИКИ =====
    document.getElementById('startBattle').addEventListener('click', startBattle);
    document.getElementById('endBattle').addEventListener('click', () => endBattle(false));
    document.getElementById('basicAttack').addEventListener('click', () => playerAttack('basic'));
    document.getElementById('powerAttack').addEventListener('click', () => playerAttack('power'));
    document.getElementById('defend').addEventListener('click', playerDefend);
    document.getElementById('heal').addEventListener('click', playerHeal);

    // ===== ОБРОБНИКИ ІНШИХ КНОПОК =====
    document.getElementById('explore').addEventListener('click', exploreLocation);
    document.getElementById('resetGame').addEventListener('click', function() {
        // Скидаємо стан гри до початкових значень
        gameState.player.health = gameState.player.maxHealth;
        gameState.player.gold = 150;
        gameState.player.xp = 0;
        gameState.player.level = 1;
        gameState.player.xpToNextLevel = 100;
        updateGameDisplay();
        document.getElementById('battleLog').innerHTML = '';
        addBattleLog('Гра скинута. Початок нової пригоди!', 'info');
    });

    // ===== ОБРОБНИКИ ІНСТРУКЦІЙ =====
    document.getElementById('showInstructions').addEventListener('click', function() {
        document.getElementById('instructionsOverlay').classList.add('active');
    });

    document.getElementById('closeInstructions').addEventListener('click', function() {
        document.getElementById('instructionsOverlay').classList.remove('active');
    });

    // Обробники табів інструкцій
    const instructionTabs = document.querySelectorAll('.instructions-tab');
    instructionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Видаляємо активний клас з усіх табів
            instructionTabs.forEach(t => t.classList.remove('active'));
            // Додаємо активний клас до поточного табу
            this.classList.add('active');

            // Ховаємо весь контент
            document.querySelectorAll('.instructions-content').forEach(content => {
                content.classList.remove('active');
            });

            // Показуємо відповідний контент
            document.getElementById(`${tabName}Content`).classList.add('active');
        });
    });

    // Додаємо початкове повідомлення у журнал
    addBattleLog('Ласкаво просимо до бойової системи RPG! Оберіть спорядження та почніть гру.', 'info');
});
// ===== ДАНІ ДЛЯ КРАМНИЦІ =====

/**
 * Товари доступні в крамниці
 */
const shopItems = {
    weapons: [
        {
            id: "iron_sword",
            name: "Залізний меч",
            type: "weapon",
            price: 100,
            weaponType: "меч",
            damage: "18-23",
            description: "Надійний залізний меч",
            stats: ["Шкода: 18-23", "Крит. шанс: 15%"]
        },
        {
            id: "steel_axe",
            name: "Сталева сокира",
            type: "weapon",
            price: 150,
            weaponType: "сокира",
            damage: "22-28",
            description: "Важка сталева сокира",
            stats: ["Шкода: 22-28", "Крит. шанс: 20%"]
        },
        {
            id: "long_bow",
            name: "Довгий лук",
            type: "weapon",
            price: 120,
            weaponType: "лук",
            damage: "15-20",
            description: "Ельфійський довгий лук",
            stats: ["Шкода: 15-20", "Крит. шанс: 25%"]
        },
        {
            id: "dragon_sword",
            name: "Меч дракона",
            type: "weapon",
            price: 500,
            weaponType: "меч",
            damage: "25-35",
            description: "Легендарний меч з кістки дракона",
            stats: ["Шкода: 25-35", "Крит. шанс: 20%", "Вогонь: +5"]
        }
    ],
    armor: [
        {
            id: "leather_armor",
            name: "Шкіряна броня",
            type: "armor",
            price: 200,
            armorType: "легка",
            defense: 15,
            description: "Легка шкіряна броня",
            stats: ["Захист: +15%", "Уникнення: +20%"]
        },
        {
            id: "chain_armor",
            name: "Кольчуга",
            type: "armor",
            price: 350,
            armorType: "середня",
            defense: 25,
            description: "Міцна кольчуга",
            stats: ["Захист: +25%", "Стійкість: +15%"]
        },
        {
            id: "plate_armor",
            name: "Латний обладунок",
            type: "armor",
            price: 500,
            armorType: "важка",
            defense: 40,
            description: "Важкий латний обладунок",
            stats: ["Захист: +40%", "Блок: +15%"]
        }
    ],
    potions: [
        {
            id: "health_potion",
            name: "Зілля здоров'я",
            type: "potion",
            price: 50,
            effect: "health",
            value: 30,
            description: "Відновлює 30 очок здоров'я",
            stats: ["Зцілення: +30 HP"]
        },
        {
            id: "mana_potion",
            name: "Зілля мани",
            type: "potion",
            price: 40,
            effect: "mana",
            value: 25,
            description: "Відновлює 25 очок мани",
            stats: ["Мана: +25 MP"]
        },
        {
            id: "strength_potion",
            name: "Зілля сили",
            type: "potion",
            price: 80,
            effect: "strength",
            value: 5,
            description: "Збільшує шкоду на 5 на 3 битви",
            stats: ["Сила: +5 на 3 битви"]
        }
    ],
    artifacts: [
        {
            id: "health_amulet",
            name: "Амулет здоров'я",
            type: "artifact",
            price: 300,
            effect: "maxHealth",
            value: 20,
            description: "Збільшує максимальне здоров'я",
            stats: ["Макс. здоров'я: +20"]
        },
        {
            id: "lucky_ring",
            name: "Кільце удачі",
            type: "artifact",
            price: 250,
            effect: "critChance",
            value: 10,
            description: "Збільшує шанс критичної атаки",
            stats: ["Крит. шанс: +10%"]
        }
    ]
};

// ===== ФУНКЦІЇ КРАМНИЦІ =====

/**
 * Відкриває крамницю та оновлює її вміст
 */
function openShop() {
    document.getElementById('shopOverlay').classList.add('active');
    document.getElementById('shopGold').textContent = gameState.player.gold;
    updateShopDisplay();
}

/**
 * Оновлює відображення всіх товарів у крамниці
 */
function updateShopDisplay() {
    updateShopCategory('weapons');
    updateShopCategory('armor');
    updateShopCategory('potions');
    updateShopCategory('artifacts');
}

/**
 * Оновлює товари в конкретній категорії крамниці
 * @param {string} category - Категорія товарів ('weapons', 'armor', 'potions', 'artifacts')
 */
function updateShopCategory(category) {
    const container = document.querySelector(`#${category}Shop .shop-items`);
    const items = shopItems[category];

    container.innerHTML = items.map(item => {
        const canAfford = gameState.player.gold >= item.price;
        const isEquipped = isItemEquipped(item);
        const inInventory = isItemInInventory(item.id);

        return `
            <div class="shop-item ${!canAfford ? 'disabled' : ''}">
                <div class="shop-item-header">
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-price">${item.price} золота</div>
                </div>
                <div class="shop-item-stats">
                    ${item.stats.map(stat => `<div>${stat}</div>`).join('')}
                </div>
                <div class="shop-item-description">${item.description}</div>
                <button class="shop-item-button"
                        onclick="buyItem('${item.id}')"
                        ${!canAfford || inInventory ? 'disabled' : ''}>
                    ${inInventory ? 'Придбано' : canAfford ? 'Купити' : 'Недостатньо золота'}
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Перевіряє, чи екіпіровано предмет
 * @param {Object} item - Предмет для перевірки
 * @returns {boolean} - Чи екіпіровано предмет
 */
function isItemEquipped(item) {
    if (item.type === 'weapon') {
        return gameState.player.weapon === item.weaponType;
    } else if (item.type === 'armor') {
        return gameState.player.armor === item.armorType;
    }
    return false;
}

/**
 * Перевіряє, чи є предмет в інвентарі
 * @param {string} itemId - ID предмета
 * @returns {boolean} - Чи є предмет в інвентарі
 */
function isItemInInventory(itemId) {
    return gameState.player.inventory.some(item => item.id === itemId);
}

/**
 * Купівля предмета в крамниці
 * @param {string} itemId - ID предмета для купівлі
 */
function buyItem(itemId) {
    // Знаходимо предмет у всіх категоріях
    let item = null;
    for (const category in shopItems) {
        item = shopItems[category].find(i => i.id === itemId);
        if (item) break;
    }

    if (!item) return;

    // Перевіряємо, чи вистачає золота
    if (gameState.player.gold < item.price) {
        addBattleLog(`Недостатньо золота для покупки ${item.name}!`, 'info');
        return;
    }

    // Перевіряємо, чи вже є предмет
    if (isItemInInventory(item.id)) {
        addBattleLog(`У вас вже є ${item.name}!`, 'info');
        return;
    }

    // Віднімаємо золото
    gameState.player.gold -= item.price;

    // Додаємо предмет в інвентар
    gameState.player.inventory.push({
        ...item,
        quantity: item.type === 'potion' ? 3 : 1 // Зілля даємо по 3 штуки
    });

    // Застосовуємо ефекти артефактів одразу
    if (item.type === 'artifact') {
        applyArtifactEffect(item);
    }

    // Оновлюємо інтерфейс
    updateGameDisplay();
    updateShopDisplay();
    updateInventoryDisplay();

    // Додаємо повідомлення в журнал
    addBattleLog(`Ви купили ${item.name} за ${item.price} золота!`, 'victory');
}

/**
 * Застосовує ефект артефакту
 * @param {Object} artifact - Артефакт для застосування
 */
function applyArtifactEffect(artifact) {
    switch(artifact.effect) {
        case 'maxHealth':
            gameState.player.maxHealth += artifact.value;
            gameState.player.health += artifact.value;
            addBattleLog(`Максимальне здоров'я збільшено на ${artifact.value}!`, 'level');
            break;
        case 'critChance':
            // Додаємо бонус до критичної шкоди
            if (!gameState.player.critBonus) gameState.player.critBonus = 0;
            gameState.player.critBonus += artifact.value;
            addBattleLog(`Шанс критичної атаки збільшено на ${artifact.value}%!`, 'level');
            break;
    }
}

/**
 * Використання предмета з інвентаря
 * @param {string} itemId - ID предмета для використання
 */
function useItem(itemId) {
    const itemIndex = gameState.player.inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const item = gameState.player.inventory[itemIndex];

    switch(item.type) {
        case 'potion':
            usePotion(item, itemIndex);
            break;
        case 'weapon':
            equipWeapon(item);
            break;
        case 'armor':
            equipArmor(item);
            break;
    }
}

/**
 * Використання зілля
 * @param {Object} potion - Зілля для використання
 * @param {number} index - Індекс зілля в інвентарі
 */
function usePotion(potion, index) {
    switch(potion.effect) {
        case 'health':
            const healthHeal = Math.min(potion.value, gameState.player.maxHealth - gameState.player.health);
            gameState.player.health += healthHeal;
            addBattleLog(`Ви використали ${potion.name} та відновили ${healthHeal} здоров'я!`, 'player');
            break;
        case 'mana':
            const manaHeal = Math.min(potion.value, gameState.player.maxMana - gameState.player.mana);
            gameState.player.mana += manaHeal;
            addBattleLog(`Ви використали ${potion.name} та відновили ${manaHeal} мани!`, 'player');
            break;
        case 'strength':
            // Додаємо тимчасовий бонус сили
            if (!gameState.player.tempStrength) gameState.player.tempStrength = 0;
            gameState.player.tempStrength += potion.value;
            gameState.player.strengthDuration = 3; // На 3 битви
            addBattleLog(`Ви використали ${potion.name} та отримали +${potion.value} до шкоди на 3 битви!`, 'player');
            break;
    }

    // Зменшуємо кількість або видаляємо зілля
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        gameState.player.inventory.splice(index, 1);
    }

    updateGameDisplay();
    updateInventoryDisplay();
}

/**
 * Екіпірування зброї
 * @param {Object} weapon - Зброя для екіпірування
 */
function equipWeapon(weapon) {
    const oldWeapon = gameState.player.weapon;
    gameState.player.weapon = weapon.weaponType;

    // Оновлюємо дані зброї
    weaponData[weapon.weaponType] = {
        minDamage: parseInt(weapon.damage.split('-')[0]),
        maxDamage: parseInt(weapon.damage.split('-')[1]),
        speed: "середня",
        critChance: 15 + (gameState.player.critBonus || 0)
    };

    addBattleLog(`Ви екіпірували ${weapon.name}!`, 'player');
    updateGameDisplay();
}

/**
 * Екіпірування броні
 * @param {Object} armor - Броня для екіпірування
 */
function equipArmor(armor) {
    const oldArmor = gameState.player.armor;
    gameState.player.armor = armor.armorType;

    // Оновлюємо дані броні
    armorData[armor.armorType].defense = armor.defense;

    addBattleLog(`Ви екіпірували ${armor.name}!`, 'player');
    updateGameDisplay();
    updateArmorInfo(armor.armorType);
}

/**
 * Оновлює відображення інвентаря
 */
function updateInventoryDisplay() {
    const inventoryContainer = document.querySelector('.inventory-items');
    if (!inventoryContainer) return;

    inventoryContainer.innerHTML = gameState.player.inventory.map(item => {
        const itemClass = item.type === 'potion' ? 'consumable' :
                         item.type === 'artifact' ? 'artifact' : 'equipment';

        return `
            <div class="inventory-item ${itemClass}" onclick="useItem('${item.id}')">
                <strong>${item.name}</strong>
                ${item.quantity > 1 ? ` (${item.quantity})` : ''}
                <div class="small">${item.description}</div>
            </div>
        `;
    }).join('');
}

// ===== ОНОВЛЕНА ІНІЦІАЛІЗАЦІЯ ГРИ =====

document.addEventListener('DOMContentLoaded', function() {
    // ... інший код ініціалізації ...

    // Додаємо інвентар до стану гравця
    gameState.player.inventory = [
        {
            id: "health_potion",
            name: "Зілля здоров'я",
            type: "potion",
            effect: "health",
            value: 30,
            description: "Відновлює 30 очок здоров'я",
            quantity: 3
        },
        {
            id: "mana_potion",
            name: "Зілля мани",
            type: "potion",
            effect: "mana",
            value: 25,
            description: "Відновлює 25 очок мани",
            quantity: 2
        }
    ];

    // ===== ОБРОБНИКИ КРАМНИЦІ =====

    // Відкриття крамниці
    document.getElementById('visitShop').addEventListener('click', openShop);

    // Закриття крамниці
    document.getElementById('closeShop').addEventListener('click', function() {
        document.getElementById('shopOverlay').classList.remove('active');
    });

    // Перемикання табів у крамниці
    const shopTabs = document.querySelectorAll('[data-shop-tab]');
    shopTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-shop-tab');

            // Видаляємо активний клас з усіх табів
            shopTabs.forEach(t => t.classList.remove('active'));
            // Додаємо активний клас до поточного табу
            this.classList.add('active');

            // Ховаємо весь контент
            document.querySelectorAll('.shop-content').forEach(content => {
                content.classList.remove('active');
            });

            // Показуємо відповідний контент
            document.getElementById(`${tabName}Shop`).classList.add('active');
        });
    });

    // Оновлюємо інвентар при завантаженні
    updateInventoryDisplay();

    // ... решта коду ініціалізації ...
});