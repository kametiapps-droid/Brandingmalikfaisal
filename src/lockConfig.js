const LOCK_KEY = "ktp_ls_v2";
const UNLOCK_KEY = "ktp_ul_v2";

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

// ================= ADMIN =================
const VALID_ADMIN_HASHES = [
  "275aa3cc4ae585a84b7752967113d20d",
  "52f6bfad21f71ad823e850dd253c75ad",
  "32030331427c9413457c4d6528e0a728"
];

// ================= CONFIG =================
export const UNLOCKED_CATEGORIES = ["teaAndCoffee", "breakfast"];
export const PAYMENT_LINK = "https://pay.ziina.com/faisalmalik1168/pNZ7rnwiu";
const SESSION_TIME = 60 * 1000; // 1 minute

// ================= CORE =================
export const isUnlocked = () => {
  try {
    const stored = localStorage.getItem(UNLOCK_KEY);
    if (!stored) return false;

    const parsed = JSON.parse(atob(stored));
    const expired = Date.now() - parsed.t >= SESSION_TIME;

    if (expired) {
      localStorage.removeItem(UNLOCK_KEY); // 🔒 auto lock
      return false;
    }

    const expectedHash = generateSecureHash(parsed.t + LOCK_KEY);
    return parsed.h === expectedHash;
  } catch {
    return false;
  }
};

// ================= UNLOCK =================
export const unlockWithCode = (code) => {
  const inputHash = generateSecureHash(code);

  if (VALID_ADMIN_HASHES.includes(inputHash)) {
    const timestamp = Date.now();

    localStorage.setItem(
      UNLOCK_KEY,
      btoa(JSON.stringify({
        t: timestamp,
        h: generateSecureHash(timestamp + LOCK_KEY),
        v: 2
      }))
    );

    return true;
  }
  return false;
};

// ================= COUNTDOWN (LOGIC ONLY) =================
export const getRemainingTime = () => {
  try {
    const stored = localStorage.getItem(UNLOCK_KEY);
    if (!stored) return 0;

    const parsed = JSON.parse(atob(stored));
    const remaining = SESSION_TIME - (Date.now() - parsed.t);

    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  } catch {
    return 0;
  }
};

// ================= MANUAL LOCK =================
export const lockApp = () => {
  localStorage.removeItem(UNLOCK_KEY);
};

// ================= CATEGORY =================
export const isCategoryLocked = (categoryKey) => {
  if (isUnlocked()) return false;
  return !UNLOCKED_CATEGORIES.includes(categoryKey);
};
