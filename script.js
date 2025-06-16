
let clicks = 10;
let clickPower = 1;
let upgradeCost = 25;
let autoClickers = 0;
let autoClickerCost = 100;
let multiplier = 1;
let multiplierCost = 500;

// Factory system
let miners = 0;
let minerCost = 1000;
let minerPower = 10;
let drills = 0;
let drillCost = 5000;
let drillPower = 50;
let factories = 0;
let factoryCost = 25000;
let factoryPower = 200;

// Research system
let research = {
  efficiency: false,
  automation: false,
  multiplication: false,
  boss: false
};

// Boss system
let currentBoss = null;
let bossUnlocked = false;

// Daily challenge
let dailyChallenge = {
  target: 500,
  progress: 0,
  completed: false,
  reward: 1000
};

// Ascension system
let ascensionLevel = 0;
let ascensionMultiplier = 1;
let ascensionRequirement = 100000; // Base requirement for first ascension

// Achievement tracking
let achievements = {
  firstClick: false,
  hundred: false,
  thousand: false,
  tenThousand: false,
  firstUpgrade: false,
  firstAuto: false,
  firstMultiplier: false,
  speedClicker: false,
  researcher: false,
  bossSlayer: false,
  factoryOwner: false,
  challengeComplete: false,
  firstAscension: false
};

let earnedAchievements = [];

// Sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Element references
  const clickCountEl = document.getElementById("click-count");
  const clickButton = document.getElementById("click-button");
  const clickPowerEl = document.getElementById("click-power");
  const upgradeCostEl = document.getElementById("upgrade-cost");
  const upgradeButton = document.getElementById("upgrade-button");
  const autoClickersEl = document.getElementById("auto-clickers");
  const autoCostEl = document.getElementById("auto-cost");
  const autoButton = document.getElementById("auto-button");
  const multiplierEl = document.getElementById("multiplier");
  const multiplierCostEl = document.getElementById("multiplier-cost");
  const multiplierButton = document.getElementById("multiplier-button");
  const achievementPopup = document.getElementById("achievement-popup");
  const achievementText = document.getElementById("achievement-text");
  const achievementsList = document.getElementById("achievements-list");
  const yourScore = document.getElementById("your-score");
  const vibrationContainer = document.getElementById("vibration-container");

  // Factory elements
  const minersEl = document.getElementById("miners");
  const minerCostEl = document.getElementById("miner-cost");
  const buyMinerBtn = document.getElementById("buy-miner");
  const drillsEl = document.getElementById("drills");
  const drillCostEl = document.getElementById("drill-cost");
  const buyDrillBtn = document.getElementById("buy-drill");
  const factoriesEl = document.getElementById("factories");
  const factoryCostEl = document.getElementById("factory-cost");
  const buyFactoryBtn = document.getElementById("buy-factory");

  // Boss elements
  const bossBattle = document.getElementById("boss-battle");
  const bossName = document.getElementById("boss-name");
  const bossHealth = document.getElementById("boss-health");
  const bossHealthText = document.getElementById("boss-health-text");
  const attackBossBtn = document.getElementById("attack-boss");

  // Challenge elements
  const challengeProgress = document.getElementById("challenge-progress");
  const challengeText = document.getElementById("challenge-text");

  // Research elements
  const researchButtons = {
    efficiency: document.getElementById("research-efficiency"),
    automation: document.getElementById("research-automation"),
    multiplication: document.getElementById("research-multiplication"),
    boss: document.getElementById("research-boss")
  };

  // Tab system
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      const targetTabElement = document.getElementById(targetTab + '-tab');
      if (targetTabElement) {
        targetTabElement.classList.add('active');
      }
    });
  });

  // Load saved game
  function loadGame() {
    const saved = localStorage.getItem('clickerGame');
    if (saved) {
      const data = JSON.parse(saved);
      clicks = data.clicks || 10;
      clickPower = data.clickPower || 1;
      upgradeCost = data.upgradeCost || 25;
      autoClickers = data.autoClickers || 0;
      autoClickerCost = data.autoClickerCost || 100;
      multiplier = data.multiplier || 1;
      multiplierCost = data.multiplierCost || 500;
      
      miners = data.miners || 0;
      minerCost = data.minerCost || 1000;
      drills = data.drills || 0;
      drillCost = data.drillCost || 5000;
      factories = data.factories || 0;
      factoryCost = data.factoryCost || 25000;
      
      research = { ...research, ...data.research };
      achievements = { ...achievements, ...data.achievements };
      earnedAchievements = data.earnedAchievements || [];
      dailyChallenge = { ...dailyChallenge, ...data.dailyChallenge };
      bossUnlocked = data.bossUnlocked || false;
      currentBoss = data.currentBoss || null;
      
      // Ascension data
      ascensionLevel = data.ascensionLevel || 0;
      ascensionMultiplier = data.ascensionMultiplier || 1;
      ascensionRequirement = data.ascensionRequirement || 100000;
    }
  }

  // Save game
  function saveGame() {
    const data = {
      clicks, clickPower, upgradeCost, autoClickers, autoClickerCost,
      multiplier, multiplierCost, miners, minerCost, drills, drillCost,
      factories, factoryCost, research, achievements, earnedAchievements,
      dailyChallenge, bossUnlocked, currentBoss, ascensionLevel,
      ascensionMultiplier, ascensionRequirement
    };
    localStorage.setItem('clickerGame', JSON.stringify(data));
  }

  // Create vibration effect around button
  function createVibration() {
    if (vibrationContainer) {
      const vibration = document.createElement('div');
      vibration.className = 'vibration-ring';
      vibrationContainer.appendChild(vibration);
      
      setTimeout(() => {
        vibration.remove();
      }, 500);
    }
  }

  // Show achievement
  function showAchievement(title) {
    if (!earnedAchievements.includes(title)) {
      earnedAchievements.push(title);
      if (achievementText) achievementText.textContent = title;
      if (achievementPopup) achievementPopup.classList.add('show');
      playSound(800, 0.3);
      
      // Add to achievements list
      if (achievementsList) {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';
        achievementItem.textContent = title;
        achievementsList.appendChild(achievementItem);
      }
      
      setTimeout(() => {
        if (achievementPopup) achievementPopup.classList.remove('show');
      }, 3000);
    }
  }

  // Ascension function
  function ascend() {
    if (clicks >= ascensionRequirement) {
      ascensionLevel++;
      ascensionMultiplier += 0.5; // Each ascension adds 0.5x multiplier
      
      // Reset everything except ascension stats and achievements
      clicks = 10;
      clickPower = 1;
      upgradeCost = 25;
      autoClickers = 0;
      autoClickerCost = 100;
      multiplier = 1;
      multiplierCost = 500;
      
      miners = 0;
      minerCost = 1000;
      drills = 0;
      drillCost = 5000;
      factories = 0;
      factoryCost = 25000;
      
      research = {
        efficiency: false,
        automation: false,
        multiplication: false,
        boss: false
      };
      
      bossUnlocked = false;
      currentBoss = null;
      
      dailyChallenge = {
        target: 500,
        progress: 0,
        completed: false,
        reward: 1000
      };
      
      // Increase next ascension requirement
      ascensionRequirement = Math.floor(ascensionRequirement * 2.5);
      
      if (!achievements.firstAscension) {
        achievements.firstAscension = true;
        showAchievement("First Ascension - The journey begins anew!");
      }
      
      showAchievement(`Ascended to Level ${ascensionLevel}! Multiplier: ${ascensionMultiplier.toFixed(1)}x`);
      
      // Reset UI elements
      const bossBattle = document.getElementById("boss-battle");
      if (bossBattle) bossBattle.classList.add('hidden');
      
      updateDisplay();
      saveGame();
    }
  }

  // Full reset function
  function fullReset() {
    if (confirm("Are you sure you want to completely reset everything? This will remove all progress including ascension levels!")) {
      // Reset absolutely everything
      clicks = 10;
      clickPower = 1;
      upgradeCost = 25;
      autoClickers = 0;
      autoClickerCost = 100;
      multiplier = 1;
      multiplierCost = 500;
      
      miners = 0;
      minerCost = 1000;
      drills = 0;
      drillCost = 5000;
      factories = 0;
      factoryCost = 25000;
      
      research = {
        efficiency: false,
        automation: false,
        multiplication: false,
        boss: false
      };
      
      achievements = {
        firstClick: false,
        hundred: false,
        thousand: false,
        tenThousand: false,
        firstUpgrade: false,
        firstAuto: false,
        firstMultiplier: false,
        speedClicker: false,
        researcher: false,
        bossSlayer: false,
        factoryOwner: false,
        challengeComplete: false,
        firstAscension: false
      };
      
      earnedAchievements = [];
      bossUnlocked = false;
      currentBoss = null;
      
      dailyChallenge = {
        target: 500,
        progress: 0,
        completed: false,
        reward: 1000
      };
      
      ascensionLevel = 0;
      ascensionMultiplier = 1;
      ascensionRequirement = 100000;
      
      // Clear achievements list
      const achievementsList = document.getElementById("achievements-list");
      if (achievementsList) {
        achievementsList.innerHTML = '';
      }
      
      // Hide boss battle
      const bossBattle = document.getElementById("boss-battle");
      if (bossBattle) bossBattle.classList.add('hidden');
      
      updateDisplay();
      saveGame();
      
      alert("Game completely reset!");
    }
  }

  // Check achievements
  function checkAchievements() {
    if (!achievements.firstClick && clicks > 10) {
      achievements.firstClick = true;
      showAchievement("First Click!");
    }
    if (!achievements.hundred && clicks >= 100) {
      achievements.hundred = true;
      showAchievement("Century Club - 100 clicks!");
    }
    if (!achievements.thousand && clicks >= 1000) {
      achievements.thousand = true;
      showAchievement("Millennium - 1,000 clicks!");
    }
    if (!achievements.tenThousand && clicks >= 10000) {
      achievements.tenThousand = true;
      showAchievement("Ten Thousand Strong!");
    }
    if (!achievements.firstUpgrade && clickPower > 1) {
      achievements.firstUpgrade = true;
      showAchievement("Power Up - First upgrade!");
    }
    if (!achievements.firstAuto && autoClickers > 0) {
      achievements.firstAuto = true;
      showAchievement("Automation - First auto clicker!");
    }
    if (!achievements.firstMultiplier && multiplier > 1) {
      achievements.firstMultiplier = true;
      showAchievement("Multiplied - First multiplier!");
    }
    if (!achievements.researcher && Object.values(research).includes(true)) {
      achievements.researcher = true;
      showAchievement("Researcher - First research!");
    }
    if (!achievements.factoryOwner && (miners > 0 || drills > 0 || factories > 0)) {
      achievements.factoryOwner = true;
      showAchievement("Factory Owner - Built first factory!");
    }
    if (!achievements.challengeComplete && dailyChallenge.completed) {
      achievements.challengeComplete = true;
      showAchievement("Challenge Master - Daily challenge complete!");
    }
  }

  // Create floating number effect
  function createFloatingNumber(value, x, y) {
    const floatingNumber = document.createElement('div');
    floatingNumber.className = 'floating-number';
    floatingNumber.textContent = `+${value}`;
    floatingNumber.style.left = x + 'px';
    floatingNumber.style.top = y + 'px';
    
    const clickArea = document.querySelector('.click-area');
    if (clickArea) {
      clickArea.appendChild(floatingNumber);
      
      setTimeout(() => {
        floatingNumber.remove();
      }, 1000);
    }
  }

  // Create ripple effect
  function createRipple(event) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    
    const size = 100;
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    
    if (vibrationContainer) {
      vibrationContainer.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  }

  // Boss system
  function spawnBoss() {
    const bosses = [
      { name: "Shadow Beast", health: 1000, reward: 5000 },
      { name: "Ice Titan", health: 2000, reward: 10000 },
      { name: "Fire Dragon", health: 5000, reward: 25000 },
      { name: "Dark Lord", health: 10000, reward: 50000 }
    ];
    
    currentBoss = bosses[Math.floor(Math.random() * bosses.length)];
    currentBoss.maxHealth = currentBoss.health;
    
    if (bossName) bossName.textContent = currentBoss.name;
    if (bossHealthText) bossHealthText.textContent = `${currentBoss.health}/${currentBoss.maxHealth} HP`;
    if (bossHealth) bossHealth.style.width = '100%';
    if (bossBattle) bossBattle.classList.remove('hidden');
  }

  function attackBoss() {
    if (!currentBoss) return;
    
    const damage = clickPower * multiplier * (research.boss ? 2 : 1);
    currentBoss.health -= damage;
    
    if (currentBoss.health <= 0) {
      currentBoss.health = 0;
      clicks += currentBoss.reward;
      showAchievement(`Boss Slayer - Defeated ${currentBoss.name}!`);
      if (bossBattle) bossBattle.classList.add('hidden');
      currentBoss = null;
      
      // Chance to spawn another boss
      setTimeout(() => {
        if (Math.random() < 0.3) {
          spawnBoss();
        }
      }, 30000);
    }
    
    const healthPercent = (currentBoss.health / currentBoss.maxHealth) * 100;
    if (bossHealth) bossHealth.style.width = healthPercent + '%';
    if (bossHealthText) bossHealthText.textContent = `${currentBoss.health}/${currentBoss.maxHealth} HP`;
    
    playSound(220, 0.2);
  }

  // Cheat menu system
  let cheatMenuOpen = false;

  function openCheatMenu() {
    const password = prompt("Enter cheat code:");
    if (password === "31Cekmece") {
      cheatMenuOpen = true;
      showCheatMenu();
    } else if (password !== null) {
      alert("Access denied! Wrong password.");
    }
  }

  function showCheatMenu() {
    const cheatMenu = document.getElementById('cheat-menu');
    if (cheatMenu) {
      cheatMenu.classList.remove('hidden');
    }
  }

  function closeCheatMenu() {
    const cheatMenu = document.getElementById('cheat-menu');
    if (cheatMenu) {
      cheatMenu.classList.add('hidden');
    }
  }

  // Enhanced cheat functions
  function addClicks() {
    const amount = parseInt(document.getElementById('cheat-clicks').value) || 0;
    clicks += amount;
    updateDisplay();
    saveGame();
  }

  function removeClicks() {
    const amount = parseInt(document.getElementById('cheat-clicks').value) || 0;
    clicks = Math.max(0, clicks - amount);
    updateDisplay();
    saveGame();
  }

  function addClickPower() {
    const amount = parseInt(document.getElementById('cheat-power').value) || 0;
    clickPower += amount;
    updateDisplay();
    saveGame();
  }

  function removeClickPower() {
    const amount = parseInt(document.getElementById('cheat-power').value) || 0;
    clickPower = Math.max(1, clickPower - amount);
    updateDisplay();
    saveGame();
  }

  function addMultiplier() {
    const amount = parseInt(document.getElementById('cheat-multiplier').value) || 0;
    multiplier += amount;
    updateDisplay();
    saveGame();
  }

  function removeMultiplier() {
    const amount = parseInt(document.getElementById('cheat-multiplier').value) || 0;
    multiplier = Math.max(1, multiplier - amount);
    updateDisplay();
    saveGame();
  }

  function addAutoClickers() {
    const amount = parseInt(document.getElementById('cheat-auto').value) || 0;
    autoClickers += amount;
    updateDisplay();
    saveGame();
  }

  function removeAutoClickers() {
    const amount = parseInt(document.getElementById('cheat-auto').value) || 0;
    autoClickers = Math.max(0, autoClickers - amount);
    updateDisplay();
    saveGame();
  }

  // Username system functions
  function setPlayerName() {
    const newName = prompt("Enter your username:", playerName);
    if (newName && newName.trim()) {
      playerName = newName.trim();
      localStorage.setItem('playerName', playerName);
      updateDisplay();
      updateLeaderboard();
    }
  }

  // Enhanced cheat functions for other players
  function addClicksToPlayer() {
    const targetName = document.getElementById('cheat-target-name').value.trim();
    const amount = parseInt(document.getElementById('cheat-clicks-other').value) || 0;
    
    if (targetName && amount !== 0) {
      if (!allPlayers[targetName]) {
        allPlayers[targetName] = {
          clicks: 0,
          clickPower: 1,
          multiplier: 1,
          autoClickers: 0
        };
      }
      allPlayers[targetName].clicks = Math.max(0, allPlayers[targetName].clicks + amount);
      localStorage.setItem('allPlayers', JSON.stringify(allPlayers));
      updateLeaderboard();
      alert(`${amount > 0 ? 'Added' : 'Removed'} ${Math.abs(amount)} clicks ${amount > 0 ? 'to' : 'from'} ${targetName}`);
    }
  }

  function addPowerToPlayer() {
    const targetName = document.getElementById('cheat-target-name').value.trim();
    const amount = parseInt(document.getElementById('cheat-power-other').value) || 0;
    
    if (targetName && amount !== 0) {
      if (!allPlayers[targetName]) {
        allPlayers[targetName] = {
          clicks: 0,
          clickPower: 1,
          multiplier: 1,
          autoClickers: 0
        };
      }
      allPlayers[targetName].clickPower = Math.max(1, allPlayers[targetName].clickPower + amount);
      localStorage.setItem('allPlayers', JSON.stringify(allPlayers));
      alert(`${amount > 0 ? 'Added' : 'Removed'} ${Math.abs(amount)} click power ${amount > 0 ? 'to' : 'from'} ${targetName}`);
    }
  }

  function addMultiplierToPlayer() {
    const targetName = document.getElementById('cheat-target-name').value.trim();
    const amount = parseInt(document.getElementById('cheat-multiplier-other').value) || 0;
    
    if (targetName && amount !== 0) {
      if (!allPlayers[targetName]) {
        allPlayers[targetName] = {
          clicks: 0,
          clickPower: 1,
          multiplier: 1,
          autoClickers: 0
        };
      }
      allPlayers[targetName].multiplier = Math.max(1, allPlayers[targetName].multiplier + amount);
      localStorage.setItem('allPlayers', JSON.stringify(allPlayers));
      alert(`${amount > 0 ? 'Added' : 'Removed'} ${Math.abs(amount)} multiplier ${amount > 0 ? 'to' : 'from'} ${targetName}`);
    }
  }

  function addAutoToPlayer() {
    const targetName = document.getElementById('cheat-target-name').value.trim();
    const amount = parseInt(document.getElementById('cheat-auto-other').value) || 0;
    
    if (targetName && amount !== 0) {
      if (!allPlayers[targetName]) {
        allPlayers[targetName] = {
          clicks: 0,
          clickPower: 1,
          multiplier: 1,
          autoClickers: 0
        };
      }
      allPlayers[targetName].autoClickers = Math.max(0, allPlayers[targetName].autoClickers + amount);
      localStorage.setItem('allPlayers', JSON.stringify(allPlayers));
      alert(`${amount > 0 ? 'Added' : 'Removed'} ${Math.abs(amount)} auto clickers ${amount > 0 ? 'to' : 'from'} ${targetName}`);
    }
  }

  function clearTargetName() {
    const targetInput = document.getElementById('cheat-target-name');
    if (targetInput) {
      targetInput.value = '';
    }
  }

  // Real leaderboard with random scores that update
  let leaderboard = [
    { name: "ProClicker99", score: Math.floor(Math.random() * 50000) + 20000 },
    { name: "ClickMaster", score: Math.floor(Math.random() * 40000) + 15000 },
    { name: "AutoBot2024", score: Math.floor(Math.random() * 35000) + 12000 },
    { name: "SpeedyClicks", score: Math.floor(Math.random() * 30000) + 10000 },
    { name: "ClickKing", score: Math.floor(Math.random() * 25000) + 8000 }
  ];

  function updateLeaderboard() {
    // Create full leaderboard with current player and all other players
    const allPlayerEntries = Object.entries(allPlayers).map(([name, data]) => ({
      name: name,
      score: data.clicks || 0
    }));
    
    const playerEntry = { name: playerName, score: clicks };
    const fullLeaderboard = [playerEntry, ...allPlayerEntries, ...leaderboard]
      .sort((a, b) => b.score - a.score);
    
    const leaderboardEl = document.getElementById('leaderboard');
    if (leaderboardEl) {
      leaderboardEl.innerHTML = '';
      
      fullLeaderboard.slice(0, 10).forEach((entry, index) => {
        const div = document.createElement('div');
        div.className = 'leader-entry';
        if (entry.name === playerName) {
          div.style.background = '#e3f2fd';
          div.style.fontWeight = 'bold';
        }
        div.innerHTML = `<span>${index + 1}. ${entry.name}: ${entry.score.toLocaleString()}</span>`;
        leaderboardEl.appendChild(div);
      });
    }
  }

  // Username system
  let playerName = localStorage.getItem('playerName') || 'Player';
  let allPlayers = JSON.parse(localStorage.getItem('allPlayers') || '{}');

  // Research system
  function unlockResearch(type) {
    const costs = {
      efficiency: 2000,
      automation: 5000,
      multiplication: 10000,
      boss: 15000
    };
    
    if (clicks >= costs[type] && !research[type]) {
      clicks -= costs[type];
      research[type] = true;
      
      const node = document.getElementById(`${type}-research`);
      if (node) {
        node.classList.remove('unlocked');
        node.classList.add('completed');
      }
      
      const button = researchButtons[type];
      if (button) {
        button.textContent = 'Completed';
        button.disabled = true;
      }
      
      // Unlock next research
      if (type === 'efficiency') {
        const automationNode = document.getElementById('automation-research');
        if (automationNode) {
          automationNode.classList.remove('locked');
          automationNode.classList.add('unlocked');
        }
        if (researchButtons.automation) researchButtons.automation.disabled = false;
      } else if (type === 'automation') {
        const multiplicationNode = document.getElementById('multiplication-research');
        if (multiplicationNode) {
          multiplicationNode.classList.remove('locked');
          multiplicationNode.classList.add('unlocked');
        }
        if (researchButtons.multiplication) researchButtons.multiplication.disabled = false;
      } else if (type === 'multiplication') {
        const bossNode = document.getElementById('boss-research');
        if (bossNode) {
          bossNode.classList.remove('locked');
          bossNode.classList.add('unlocked');
        }
        if (researchButtons.boss) researchButtons.boss.disabled = false;
      } else if (type === 'boss') {
        bossUnlocked = true;
        spawnBoss();
      }
      
      playSound(770, 0.4);
      updateDisplay();
      checkAchievements();
      saveGame();
    }
  }

  // Daily challenge system
  function updateDailyChallenge() {
    if (!dailyChallenge.completed && challengeProgress && challengeText) {
      const progress = Math.min(dailyChallenge.progress, dailyChallenge.target);
      const percentage = (progress / dailyChallenge.target) * 100;
      challengeProgress.style.width = percentage + '%';
      
      if (progress >= dailyChallenge.target && !dailyChallenge.completed) {
        dailyChallenge.completed = true;
        clicks += dailyChallenge.reward;
        challengeText.textContent = "Challenge Complete! ✓";
        showAchievement("Daily Challenge Complete!");
      }
    }
  }

  // Factory purchases
  function buyFactory(type) {
    const costs = { miner: minerCost, drill: drillCost, factory: factoryCost };
    
    if (clicks >= costs[type]) {
      clicks -= costs[type];
      
      if (type === 'miner') {
        miners++;
        minerCost = Math.floor(minerCost * 1.5);
      } else if (type === 'drill') {
        drills++;
        drillCost = Math.floor(drillCost * 1.5);
      } else if (type === 'factory') {
        factories++;
        factoryCost = Math.floor(factoryCost * 1.5);
      }
      
      playSound(550, 0.2);
      updateDisplay();
      checkAchievements();
      saveGame();
    }
  }

  // Event listeners
  if (clickButton) {
    clickButton.addEventListener("click", (event) => {
      const earnedClicks = clickPower * multiplier * ascensionMultiplier * (research.efficiency ? 1.2 : 1);
      clicks += earnedClicks;
      
      // Update daily challenge
      dailyChallenge.progress++;
      updateDailyChallenge();
      
      // Visual and audio effects
      createRipple(event);
      createVibration();
      createFloatingNumber(Math.floor(earnedClicks), event.clientX - 600, event.clientY - 300);
      playSound(440, 0.1);
      
      updateDisplay();
      checkAchievements();
      saveGame();
    });
  }

  if (upgradeButton) {
    upgradeButton.addEventListener("click", () => {
      if (clicks >= upgradeCost) {
        clicks -= upgradeCost;
        clickPower++;
        
        if (upgradeCost < 50) {
          upgradeCost = 50;
        } else if (upgradeCost < 75) {
          upgradeCost = 75;
        } else if (upgradeCost < 100) {
          upgradeCost = 100;
        } else {
          upgradeCost = Math.floor(upgradeCost * 1.5);
        }
        
        playSound(660, 0.2);
        updateDisplay();
        checkAchievements();
        saveGame();
      }
    });
  }

  if (autoButton) {
    autoButton.addEventListener("click", () => {
      if (clicks >= autoClickerCost) {
        clicks -= autoClickerCost;
        autoClickers++;
        
        if (autoClickerCost < 200) {
          autoClickerCost = 200;
        } else if (autoClickerCost < 300) {
          autoClickerCost = 300;
        } else {
          autoClickerCost = Math.floor(autoClickerCost * 1.5);
        }
        
        playSound(550, 0.2);
        updateDisplay();
        checkAchievements();
        saveGame();
      }
    });
  }

  if (multiplierButton) {
    multiplierButton.addEventListener("click", () => {
      if (clicks >= multiplierCost) {
        clicks -= multiplierCost;
        multiplier++;
        
        multiplierCost = Math.floor(multiplierCost * 2.5);
        
        playSound(880, 0.3);
        updateDisplay();
        checkAchievements();
        saveGame();
      }
    });
  }

  // Factory event listeners
  if (buyMinerBtn) buyMinerBtn.addEventListener("click", () => buyFactory('miner'));
  if (buyDrillBtn) buyDrillBtn.addEventListener("click", () => buyFactory('drill'));
  if (buyFactoryBtn) buyFactoryBtn.addEventListener("click", () => buyFactory('factory'));

  // Research event listeners
  if (researchButtons.efficiency) researchButtons.efficiency.addEventListener("click", () => unlockResearch('efficiency'));
  if (researchButtons.automation) researchButtons.automation.addEventListener("click", () => unlockResearch('automation'));
  if (researchButtons.multiplication) researchButtons.multiplication.addEventListener("click", () => unlockResearch('multiplication'));
  if (researchButtons.boss) researchButtons.boss.addEventListener("click", () => unlockResearch('boss'));

  // Boss attack listener
  if (attackBossBtn) attackBossBtn.addEventListener("click", attackBoss);

  // Cheat menu listeners
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      openCheatMenu();
    }
  });

  // Cheat menu button listeners
  const closeCheatBtn = document.getElementById('close-cheat');
  if (closeCheatBtn) closeCheatBtn.addEventListener('click', closeCheatMenu);

  // Self cheat buttons
  const addClicksBtn = document.getElementById('add-clicks-btn');
  if (addClicksBtn) addClicksBtn.addEventListener('click', addClicks);

  const removeClicksBtn = document.getElementById('remove-clicks-btn');
  if (removeClicksBtn) removeClicksBtn.addEventListener('click', removeClicks);

  const addPowerBtn = document.getElementById('add-power-btn');
  if (addPowerBtn) addPowerBtn.addEventListener('click', addClickPower);

  const removePowerBtn = document.getElementById('remove-power-btn');
  if (removePowerBtn) removePowerBtn.addEventListener('click', removeClickPower);

  const addMultiplierBtn = document.getElementById('add-multiplier-btn');
  if (addMultiplierBtn) addMultiplierBtn.addEventListener('click', addMultiplier);

  const removeMultiplierBtn = document.getElementById('remove-multiplier-btn');
  if (removeMultiplierBtn) removeMultiplierBtn.addEventListener('click', removeMultiplier);

  const addAutoBtn = document.getElementById('add-auto-btn');
  if (addAutoBtn) addAutoBtn.addEventListener('click', addAutoClickers);

  const removeAutoBtn = document.getElementById('remove-auto-btn');
  if (removeAutoBtn) removeAutoBtn.addEventListener('click', removeAutoClickers);

  // Other player cheat buttons
  const addClicksPlayerBtn = document.getElementById('add-clicks-player-btn');
  if (addClicksPlayerBtn) addClicksPlayerBtn.addEventListener('click', addClicksToPlayer);

  const addPowerPlayerBtn = document.getElementById('add-power-player-btn');
  if (addPowerPlayerBtn) addPowerPlayerBtn.addEventListener('click', addPowerToPlayer);

  const addMultiplierPlayerBtn = document.getElementById('add-multiplier-player-btn');
  if (addMultiplierPlayerBtn) addMultiplierPlayerBtn.addEventListener('click', addMultiplierToPlayer);

  const addAutoPlayerBtn = document.getElementById('add-auto-player-btn');
  if (addAutoPlayerBtn) addAutoPlayerBtn.addEventListener('click', addAutoToPlayer);

  const clearTargetBtn = document.getElementById('clear-target-btn');
  if (clearTargetBtn) clearTargetBtn.addEventListener('click', clearTargetName);

  // Username change button
  window.setPlayerName = setPlayerName;
  
  // Ascension and reset buttons
  const ascendButton = document.getElementById('ascend-button');
  if (ascendButton) ascendButton.addEventListener('click', ascend);
  
  const resetButton = document.getElementById('reset-button');
  if (resetButton) resetButton.addEventListener('click', fullReset);

  function updateDisplay() {
    if (clickCountEl) clickCountEl.textContent = `Clicks: ${clicks.toLocaleString()}`;
    if (clickPowerEl) clickPowerEl.textContent = Math.floor(clickPower * (research.efficiency ? 1.2 : 1));
    if (upgradeCostEl) upgradeCostEl.textContent = upgradeCost.toLocaleString();
    if (autoClickersEl) autoClickersEl.textContent = autoClickers;
    if (autoCostEl) autoCostEl.textContent = autoClickerCost.toLocaleString();
    if (multiplierEl) multiplierEl.textContent = Math.floor(multiplier * (research.multiplication ? 1.5 : 1));
    if (multiplierCostEl) multiplierCostEl.textContent = multiplierCost.toLocaleString();
    
    // Factory displays
    if (minersEl) minersEl.textContent = miners;
    if (minerCostEl) minerCostEl.textContent = minerCost.toLocaleString();
    if (drillsEl) drillsEl.textContent = drills;
    if (drillCostEl) drillCostEl.textContent = drillCost.toLocaleString();
    if (factoriesEl) factoriesEl.textContent = factories;
    if (factoryCostEl) factoryCostEl.textContent = factoryCost.toLocaleString();
    
    // Update leaderboard
    updateLeaderboard();
    
    // Update button states
    if (upgradeButton) upgradeButton.disabled = clicks < upgradeCost;
    if (autoButton) autoButton.disabled = clicks < autoClickerCost;
    if (multiplierButton) multiplierButton.disabled = clicks < multiplierCost;
    if (buyMinerBtn) buyMinerBtn.disabled = clicks < minerCost;
    if (buyDrillBtn) buyDrillBtn.disabled = clicks < drillCost;
    if (buyFactoryBtn) buyFactoryBtn.disabled = clicks < factoryCost;
    
    // Research button states
    if (researchButtons.efficiency) {
      researchButtons.efficiency.disabled = clicks < 2000 || research.efficiency;
    }
    if (researchButtons.automation) {
      researchButtons.automation.disabled = clicks < 5000 || research.automation || !research.efficiency;
    }
    if (researchButtons.multiplication) {
      researchButtons.multiplication.disabled = clicks < 10000 || research.multiplication || !research.automation;
    }
    if (researchButtons.boss) {
      researchButtons.boss.disabled = clicks < 15000 || research.boss || !research.multiplication;
    }
    
    // Update player name display
    const playerNameEl = document.getElementById('player-name');
    if (playerNameEl) {
      playerNameEl.textContent = playerName;
    }
    
    // Update ascension display
    const ascensionLevelEl = document.getElementById('ascension-level');
    if (ascensionLevelEl) ascensionLevelEl.textContent = ascensionLevel;
    
    const ascensionMultiplierEl = document.getElementById('ascension-multiplier');
    if (ascensionMultiplierEl) ascensionMultiplierEl.textContent = ascensionMultiplier.toFixed(1);
    
    const ascensionRequirementEl = document.getElementById('ascension-requirement');
    if (ascensionRequirementEl) ascensionRequirementEl.textContent = ascensionRequirement.toLocaleString();
    
    const ascendButtonEl = document.getElementById('ascend-button');
    if (ascendButtonEl) ascendButtonEl.disabled = clicks < ascensionRequirement;
    
    // Update your score display safely
    if (yourScore) {
      yourScore.textContent = clicks.toLocaleString();
    }
  }

  // Auto systems
  setInterval(() => {
    if (autoClickers > 0) {
      const autoEarnings = autoClickers * multiplier * ascensionMultiplier * (research.automation ? 1.25 : 1);
      clicks += autoEarnings;
    }
    
    if (miners > 0) {
      clicks += miners * minerPower * ascensionMultiplier;
    }
    
    if (drills > 0) {
      clicks += drills * drillPower * ascensionMultiplier;
    }
    
    if (factories > 0) {
      clicks += factories * factoryPower * ascensionMultiplier;
    }
    
    updateDisplay();
    saveGame();
  }, 1000);

  // Update leaderboard scores periodically
  setInterval(() => {
    leaderboard = leaderboard.map(player => ({
      ...player,
      score: player.score + Math.floor(Math.random() * 100) + 10
    }));
  }, 30000);

  // Initialize achievements list
  function initializeAchievements() {
    earnedAchievements.forEach(achievement => {
      if (achievementsList) {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';
        achievementItem.textContent = achievement;
        achievementsList.appendChild(achievementItem);
      }
    });
  }

  // Cheat menu tab system
  window.showCheatTab = function(tabName) {
    const tabs = document.querySelectorAll('.cheat-tab-content');
    const buttons = document.querySelectorAll('.cheat-tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const targetTab = document.getElementById(tabName + '-cheats');
    if (targetTab) targetTab.classList.add('active');
    
    // Find the clicked button and activate it
    buttons.forEach(btn => {
      if (btn.textContent.toLowerCase() === tabName) {
        btn.classList.add('active');
      }
    });
  }

  // Make cheat menu draggable
  function makeDraggable() {
    const cheatMenu = document.getElementById('cheat-menu');
    const header = cheatMenu.querySelector('h3');
    
    if (cheatMenu && header) {
      let isDragging = false;
      let startX, startY, initialX, initialY;
      
      header.style.cursor = 'move';
      header.style.userSelect = 'none';
      
      header.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = cheatMenu.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        
        cheatMenu.style.position = 'fixed';
        cheatMenu.style.left = initialX + 'px';
        cheatMenu.style.top = initialY + 'px';
        cheatMenu.style.transform = 'none';
      });
      
      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          
          cheatMenu.style.left = (initialX + deltaX) + 'px';
          cheatMenu.style.top = (initialY + deltaY) + 'px';
        }
      });
      
      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  }

  // Initialize game
  loadGame();
  updateDisplay();
  initializeAchievements();
  updateDailyChallenge();
  makeDraggable();

  if (bossUnlocked && !currentBoss && Math.random() < 0.5) {
    spawnBoss();
  }

  // Auto-save every 10 seconds
  setInterval(saveGame, 10000);
});
