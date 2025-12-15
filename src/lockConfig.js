const LOCK_KEY = "ktp_ls_v2";
const UNLOCK_KEY = "ktp_ul_v2";
const COUNTDOWN_KEY = "ktp_cd_v2";

// ================= HASH =================
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // unchanged
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

// ================= CONFIG =================
const VALID_ADMIN_HASHES = [
  "275aa3cc4ae585a84b7752967113d20d",
  "52f6bfad21f71ad823e850dd253c75ad",
  "32030331427c9413457c4d6528e0a728"
];

export const UNLOCKED_CATEGORIES = ["teaAndCoffee", "breakfast"];
export const PAYMENT_LINK = "https://pay.ziina.com/faisalmalik1168/pNZ7rnwiu";

// ================= CHECK =================
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

// ================= UNLOCK =================
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
    localStorage.setItem(COUNTDOWN_KEY, 60);

    // ⏱️ COUNTDOWN TIMER
    const interval = setInterval(() => {
      let seconds = Number(localStorage.getItem(COUNTDOWN_KEY));
      if (seconds > 0) {
        localStorage.setItem(COUNTDOWN_KEY, seconds - 1);
        window.dispatchEvent(new Event("countdown-update"));
      }
    }, 1000);

    // 🔒 AUTO LOCK AFTER 1 MINUTE
    setTimeout(() => {
      clearInterval(interval);
      localStorage.removeItem(UNLOCK_KEY);
      localStorage.removeItem(COUNTDOWN_KEY);
      window.dispatchEvent(new Event("app-lock"));
    }, 60 * 1000);

    return true;
  }
  return false;
};

// ================= MANUAL LOCK =================
export const lockApp = () => {
  localStorage.removeItem(UNLOCK_KEY);
  localStorage.removeItem(COUNTDOWN_KEY);
};

// ================= CATEGORY =================
export const isCategoryLocked = (categoryKey) => {
  if (isUnlocked()) return false;
  return !UNLOCKED_CATEGORIES.includes(categoryKey);
};

// ================= COUNTDOWN HELPER =================
export const getCountdown = () => {
  return Number(localStorage.getItem(COUNTDOWN_KEY) || 0);
};
