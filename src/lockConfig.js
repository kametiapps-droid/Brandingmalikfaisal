const LOCK_KEY = "ktp_ls_v2";
const UNLOCK_KEY = "ktp_ul_v2";

let autoLockTimer = null;
let countdownInterval = null;
let onCountdownUpdate = null;
let onLockStatusChange = null;

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

export const setOnCountdownUpdate = (callback) => {
  onCountdownUpdate = callback;
};

export const setOnLockStatusChange = (callback) => {
  onLockStatusChange = callback;
};

const startAutoLock = (remainingSeconds = 60) => {
  if (autoLockTimer) clearTimeout(autoLockTimer);
  if (countdownInterval) clearInterval(countdownInterval);

  let secondsLeft = remainingSeconds;

  if (onCountdownUpdate) onCountdownUpdate(secondsLeft);

  countdownInterval = setInterval(() => {
    secondsLeft--;
    if (onCountdownUpdate) onCountdownUpdate(secondsLeft);
    if (secondsLeft <= 0) {
      lockApp();
    }
  }, 1000);

  autoLockTimer = setTimeout(() => {
    lockApp();
  }, remainingSeconds * 1000);
};

export const isUnlocked = () => {
  try {
    const stored = localStorage.getItem(UNLOCK_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(atob(stored));
    const expectedHash = generateSecureHash(parsed.t + LOCK_KEY);
    return parsed.h === expectedHash && Date.now() - parsed.t < 60 * 1000;
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
    startAutoLock(60);
    if (onLockStatusChange) onLockStatusChange(true);
    return true;
  }
  return false;
};

export const lockApp = () => {
  if (autoLockTimer) clearTimeout(autoLockTimer);
  if (countdownInterval) clearInterval(countdownInterval);
  autoLockTimer = null;
  countdownInterval = null;
  localStorage.removeItem(UNLOCK_KEY);
  if (onCountdownUpdate) onCountdownUpdate(0);
  if (onLockStatusChange) onLockStatusChange(false);
};

export const isCategoryLocked = (categoryKey) => {
  if (isUnlocked()) return false;
  return !UNLOCKED_CATEGORIES.includes(categoryKey);
};

export const initAutoLock = () => {
  try {
    const stored = localStorage.getItem(UNLOCK_KEY);
    if (!stored) return;
    const parsed = JSON.parse(atob(stored));
    const expectedHash = generateSecureHash(parsed.t + LOCK_KEY);
    if (parsed.h !== expectedHash) return;
    
    const elapsed = Date.now() - parsed.t;
    const remaining = Math.ceil((60 * 1000 - elapsed) / 1000);
    
    if (remaining > 0) {
      startAutoLock(remaining);
      if (onLockStatusChange) onLockStatusChange(true);
    } else {
      lockApp();
    }
  } catch {
    lockApp();
  }
};

setOnCountdownUpdate((seconds) => {
  console.log("Auto-lock in:", seconds, "seconds");
});

setOnLockStatusChange((unlocked) => {
  if (!unlocked) {
    window.location.reload();
  }
});

initAutoLock();
