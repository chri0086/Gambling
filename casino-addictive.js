/**
 * casino-addictive.js
 * Shared addictive game mechanics across all casino games
 */
'use strict';

// ========== Win Streak System ==========
const StreakSystem = (() => {
  const STREAK_KEY = 'casino_streak_v1';
  let streak = 0;
  let maxStreak = 0;
  let lastOutcome = null;

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
      streak = data.streak || 0;
      maxStreak = data.maxStreak || 0;
    } catch {}
  }

  function save() {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify({ streak, maxStreak }));
    } catch {}
  }

  function win() {
    streak++;
    if (streak > maxStreak) maxStreak = streak;
    lastOutcome = 'win';
    save();
    updateUI();
    if (streak >= 3) showStreakToast();
  }

  function lose() {
    streak = 0;
    lastOutcome = 'loss';
    save();
    updateUI();
  }

  function updateUI() {
    const el = document.getElementById('streak-counter');
    if (!el) return;
    el.textContent = streak > 0 ? `🔥 ${streak}` : '–';
    el.className = 'streak-badge';
    if (streak >= 5) el.classList.add('hot');
    else if (streak >= 3) el.classList.add('warm');
  }

  function showStreakToast() {
    const mult = getMultiplier();
    showToast(`🔥 ${streak} Win Streak! ${mult}x Bonus!`, 'success');
  }

  function getMultiplier() {
    if (streak >= 10) return 2.0;
    if (streak >= 7) return 1.75;
    if (streak >= 5) return 1.5;
    if (streak >= 3) return 1.25;
    return 1.0;
  }

  function getStreak() { return streak; }
  function getMaxStreak() { return maxStreak; }

  load();
  return { win, lose, getStreak, getMaxStreak, getMultiplier, updateUI };
})();

// ========== Level/XP System ==========
const LevelSystem = (() => {
  const LEVEL_KEY = 'casino_level_v1';
  let xp = 0;
  let level = 1;

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(LEVEL_KEY) || '{}');
      xp = data.xp || 0;
      level = data.level || 1;
    } catch {}
  }

  function save() {
    try {
      localStorage.setItem(LEVEL_KEY, JSON.stringify({ xp, level }));
    } catch {}
  }

  function addXP(amount, reason = '') {
    xp += amount;
    checkLevelUp();
    save();
    updateUI();
  }

  function checkLevelUp() {
    const needed = getXPForLevel(level + 1);
    if (xp >= needed) {
      level++;
      showToast(`🎉 Level ${level} erreicht!`, 'level');
      playLevelUpSound();
    }
  }

  function getXPForLevel(lvl) {
    return Math.floor(100 * Math.pow(lvl, 1.5));
  }

  function updateUI() {
    const el = document.getElementById('level-display');
    if (!el) return;
    const needed = getXPForLevel(level + 1);
    const progress = (xp / needed) * 100;
    el.innerHTML = `
      <div class="level-num">Lv. ${level}</div>
      <div class="xp-bar">
        <div class="xp-fill" style="width:${progress}%"></div>
      </div>
      <div class="xp-text">${xp}/${needed} XP</div>
    `;
  }

  function playLevelUpSound() {
    // Placeholder for sound
  }

  load();
  return { addXP, getLevel: () => level, getXP: () => xp, updateUI };
})();

// ========== Statistics Tracking ==========
const StatsSystem = (() => {
  const STATS_KEY = 'casino_stats_v1';
  let stats = {
    totalWagered: 0,
    totalWon: 0,
    totalLost: 0,
    gamesPlayed: 0,
    biggestWin: 0,
    biggestLoss: 0,
    wins: 0,
    losses: 0
  };

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
      stats = { ...stats, ...data };
    } catch {}
  }

  function save() {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {}
  }

  function recordBet(amount) {
    stats.totalWagered += amount;
    stats.gamesPlayed++;
    save();
  }

  function recordWin(amount, profit) {
    stats.totalWon += amount;
    stats.wins++;
    if (profit > stats.biggestWin) stats.biggestWin = profit;
    save();
  }

  function recordLoss(amount) {
    stats.totalLost += amount;
    stats.losses++;
    if (amount > stats.biggestLoss) stats.biggestLoss = amount;
    save();
  }

  function getStats() { return { ...stats }; }

  function getWinRate() {
    if (stats.gamesPlayed === 0) return 0;
    return ((stats.wins / stats.gamesPlayed) * 100).toFixed(1);
  }

  load();
  return { recordBet, recordWin, recordLoss, getStats, getWinRate };
})();

// ========== Toast Notifications ==========
const ToastSystem = (() => {
  let container = null;

  function init() {
    if (container) return;
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  function show(message, type = 'info', duration = 3000) {
    init();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      background: rgba(14, 21, 32, 0.95);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 12px 16px;
      color: #e6edf3;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      pointer-events: auto;
      animation: slideInRight 300ms ease-out;
      min-width: 240px;
    `;

    if (type === 'success') {
      toast.style.borderColor = 'rgba(16,185,129,0.45)';
      toast.style.background = 'rgba(16,185,129,0.12)';
    } else if (type === 'level') {
      toast.style.borderColor = 'rgba(245,158,11,0.45)';
      toast.style.background = 'rgba(245,158,11,0.12)';
    }

    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 300ms ease-in';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return { show };
})();

// Global toast function
window.showToast = ToastSystem.show;

// ========== Recent Wins Ticker ==========
const TickerSystem = (() => {
  const wins = [
    { player: 'Max', game: 'Slots', amount: 5420 },
    { player: 'Anna', game: 'Crash', amount: 3280 },
    { player: 'Leon', game: 'Roulette', amount: 7100 },
    { player: 'Mia', game: 'Blackjack', amount: 1950 },
    { player: 'Tom', game: 'Dice', amount: 4600 }
  ];

  function init() {
    const el = document.getElementById('recent-wins-ticker');
    if (!el) return;

    setInterval(() => {
      const win = wins[Math.floor(Math.random() * wins.length)];
      const item = document.createElement('div');
      item.className = 'ticker-item';
      item.innerHTML = `<strong>${win.player}</strong> gewann <span class="win-amount">$${win.amount.toLocaleString()}</span> bei ${win.game}`;
      el.appendChild(item);

      setTimeout(() => item.remove(), 5000);
    }, 8000);
  }

  return { init };
})();

// ========== Screen Shake Effect ==========
function screenShake(intensity = 1) {
  const main = document.querySelector('main');
  if (!main) return;

  const duration = 500;
  const strength = 8 * intensity;
  let start = null;

  function shake(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = elapsed / duration;

    if (progress < 1) {
      const offset = Math.sin(progress * Math.PI * 8) * strength * (1 - progress);
      main.style.transform = `translate(${Math.cos(elapsed * 0.05) * offset}px, ${Math.sin(elapsed * 0.07) * offset}px)`;
      requestAnimationFrame(shake);
    } else {
      main.style.transform = '';
    }
  }

  requestAnimationFrame(shake);
}

// ========== Auto-inject UI elements ==========
function injectAddictiveUI() {
  // Add streak counter to balance bar
  const balance = document.querySelector('.balance');
  if (balance && !document.getElementById('streak-counter')) {
    const streak = document.createElement('div');
    streak.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      padding: 6px 10px;
      border-radius: 12px;
      font-weight: 700;
    `;
    streak.innerHTML = `
      <span style="color: #9aa4b2;">Streak:</span>
      <span id="streak-counter" class="streak-badge">–</span>
    `;
    balance.parentNode.insertBefore(streak, balance);
  }

  // Add level display
  const topbar = document.querySelector('.topbar');
  if (topbar && !document.getElementById('level-display')) {
    const level = document.createElement('div');
    level.id = 'level-display';
    level.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
    `;
    topbar.appendChild(level);
  }

  // Add CSS animations
  if (!document.getElementById('addictive-styles')) {
    const style = document.createElement('style');
    style.id = 'addictive-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
      .streak-badge { color: #9aa4b2; }
      .streak-badge.warm { color: #f59e0b; }
      .streak-badge.hot { color: #ef4444; animation: flicker 1s infinite; }
      @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      .xp-bar {
        width: 120px;
        height: 8px;
        background: rgba(255,255,255,0.08);
        border-radius: 999px;
        overflow: hidden;
      }
      .xp-fill {
        height: 100%;
        background: linear-gradient(90deg, #22d3ee, #0ea5e9);
        transition: width 400ms ease-out;
      }
      .level-num { color: #ffd166; font-weight: 800; }
      .xp-text { color: #9aa4b2; font-size: 10px; }
    `;
    document.head.appendChild(style);
  }

  StreakSystem.updateUI();
  LevelSystem.updateUI();
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectAddictiveUI);
} else {
  injectAddictiveUI();
}

// Export systems
window.CasinoAddictive = {
  Streak: StreakSystem,
  Level: LevelSystem,
  Stats: StatsSystem,
  Toast: ToastSystem,
  Ticker: TickerSystem,
  screenShake
};
