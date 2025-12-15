const LOCK_KEY = "ktp_ls_v2";
const UNLOCK_KEY = "ktp_ul_v2";
const LOCK_DURATION = 60 * 1000;

let lockTimer = null;
let countdownInterval = null;
let countdownCallback = null;

const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

const generateSecureHash = (input) => {
  const salt = "KTP2024SecureMenuLock";
  const combined = salt + input + salt.split('').reverse().join('');
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += hashCode(combined + i + result);
  }
  return result;
};

const VALID_ADMIN_HASHES = [
  "275aa3cc4ae585a84b7752967113d20d",
  "52f6bfad21f71ad823e850dd253c75ad",
  "32030331427c9413457c4d6528e0a728"
];

export const UNLOCKED_CATEGORIES = ["teaAndCoffee", "breakfast"];

export const PAYMENT_LINK = "https://pay.ziina.com/faisalmalik1168/pNZ7rnwiu";

const clearTimers = () => {
  if (lockTimer) {
    clearTimeout(lockTimer);
    lockTimer = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

const startAutoLockTimer = () => {
  clearTimers();
  
  const unlockTime = Date.now();
  
  countdownInterval = setInterval(() => {
    const elapsed = Date.now() - unlockTime;
    const remaining = Math.max(0, LOCK_DURATION - elapsed);
    const secondsLeft = Math.ceil(remaining / 1000);
    
    if (countdownCallback) {
      countdownCallback(secondsLeft);
    }
    
    if (remaining <= 0) {
      lockApp();
    }
  }, 1000);
  
  lockTimer = setTimeout(() => {
    lockApp();
  }, LOCK_DURATION);
};

export const setCountdownCallback = (callback) => {
  countdownCallback = callback;
};

export const getRemainingTime = () => {
  try {
    const stored = localStorage.getItem(UNLOCK_KEY);
    if (!stored) return 0;
    const parsed = JSON.parse(atob(stored));
    const expectedHash = generateSecureHash(parsed.t + LOCK_KEY);
    if (parsed.h !== expectedHash) return 0;
    const remaining = Math.max(0, LOCK_DURATION - (Date.now() - parsed.t));
    return Math.ceil(remaining / 1000);
  } catch {
    return 0;
  }
};

export const isUnlocked = () => {
  try {
    const stored = localStorage.getItem(UNLOCK_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(atob(stored));
    const expectedHash = generateSecureHash(parsed.t + LOCK_KEY);
    return parsed.h === expectedHash && Date.now() - parsed.t < LOCK_DURATION;
  } catch {
    return false;
  }
};

export const unlockWithCode = (code) => {
  const inputHash = generateSecureHash(code);
  if (VALID_ADMIN_HASHES.includes(inputHash)) {
    const timestamp = Date.now();
    const data = {
      t: timestamp,
      h: generateSecureHash(timestamp + LOCK_KEY),
      v: 2
    };
    localStorage.setItem(UNLOCK_KEY, btoa(JSON.stringify(data)));
    startAutoLockTimer();
    return true;
  }
  return false;
};

export const lockApp = () => {
  clearTimers();
  localStorage.removeItem(UNLOCK_KEY);
  if (countdownCallback) {
    countdownCallback(0);
  }
};

export const isCategoryLocked = (categoryKey) => {
  if (isUnlocked()) return false;
  return !UNLOCKED_CATEGORIES.includes(categoryKey);
};

export const initAutoLock = () => {
  if (isUnlocked()) {
    const remaining = getRemainingTime();
    if (remaining > 0) {
      clearTimers();
      
      countdownInterval = setInterval(() => {
        const currentRemaining = getRemainingTime();
        if (countdownCallback) {
          countdownCallback(currentRemaining);
        }
        if (currentRemaining <= 0) {
          lockApp();
        }
      }, 1000);
      
      lockTimer = setTimeout(() => {
        lockApp();
      }, remaining * 1000);
    } else {
      lockApp();
    }
  }
};
