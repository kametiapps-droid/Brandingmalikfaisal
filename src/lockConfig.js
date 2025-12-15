// ===== KTP debug + watcher (paste into console) =====
(function(){
  if (window.__ktp_lock_debug_running) {
    console.log("KTP watcher already running.");
    return;
  }
  window.__ktp_lock_debug_running = true;

  const LOCK_KEY = "ktp_ls_v2";
  const UNLOCK_KEY = "ktp_ul_v2";
  const SESSION_TIME = 60 * 1000; // 1 minute

  // --- local hash (same approach as your code) ---
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };
  const generateSecureHash_local = (input) => {
    const salt = "KTP2024SecureMenuLock";
    const combined = salt + input + salt.split('').reverse().join('');
    let result = "";
    for (let i = 0; i < 4; i++) result += hashCode(combined + i + result);
    return result;
  };

  // --- helper: read parsed unlock data or null ---
  function readUnlock() {
    try {
      const raw = localStorage.getItem(UNLOCK_KEY);
      if (!raw) return null;
      return JSON.parse(atob(raw));
    } catch(e){
      return null;
    }
  }

  // --- compute remaining ms (0 if expired) ---
  function remainingMs() {
    const parsed = readUnlock();
    if (!parsed) return 0;
    const rem = SESSION_TIME - (Date.now() - parsed.t);
    return rem > 0 ? rem : 0;
  }

  // --- isUnlocked simple check (same semantics) ---
  function isUnlocked_local() {
    const parsed = readUnlock();
    if (!parsed) return false;
    // validate hash if possible (using local generator)
    try {
      const expected = generateSecureHash_local(parsed.t + LOCK_KEY);
      if (parsed.h !== expected) return false;
    } catch {}
    return Date.now() - parsed.t < SESSION_TIME;
  }

  // --- set a valid unlock for testing (DO NOT use in production) ---
  window.setKtpTestUnlock = function() {
    const ts = Date.now();
    const payload = {
      t: ts,
      h: generateSecureHash_local(ts + LOCK_KEY),
      v: 2
    };
    localStorage.setItem(UNLOCK_KEY, btoa(JSON.stringify(payload)));
    console.log("KTP test unlock set (60s).");
  };

  // --- watch loop: polls every 500ms and dispatches app-lock when expires ---
  let lastState = isUnlocked_local();
  function watcherTick() {
    const nowUnlocked = isUnlocked_local();
    if (lastState && !nowUnlocked) {
      // transitioned from unlocked -> locked
      console.log("KTP: lock detected, dispatching app-lock event.");
      window.dispatchEvent(new Event("app-lock"));
    }
    // if unlocked, optionally log remaining seconds
    if (nowUnlocked) {
      const sec = Math.ceil(remainingMs() / 1000);
      // console.log("KTP remaining:", sec, "s"); // uncomment to see live seconds
    }
    lastState = nowUnlocked;
  }

  let watcherInterval = null;
  window.startKtpLockWatcher = function() {
    if (watcherInterval) {
      console.log("KTP watcher already started.");
      return;
    }
    lastState = isUnlocked_local();
    watcherInterval = setInterval(watcherTick, 500);
    // also listen to storage events (other tabs)
    window.addEventListener("storage", () => {
      // immediate re-check
      watcherTick();
    });
    console.log("KTP watcher started. Current unlocked:", lastState);
  };

  window.stopKtpLockWatcher = function() {
    if (watcherInterval) clearInterval(watcherInterval);
    watcherInterval = null;
    window.__ktp_lock_debug_running = false;
    console.log("KTP watcher stopped.");
  };

  // expose utility getters
  window.ktpRemainingSeconds = function(){ return Math.ceil(remainingMs()/1000); };
  window.ktpIsUnlocked = isUnlocked_local;
  window.ktpReadUnlock = readUnlock;

  // auto-start watcher for convenience
  window.startKtpLockWatcher();

  // inform user
  console.log("KTP debug tools ready. Use setKtpTestUnlock() to simulate unlock, ktpIsUnlocked(), ktpRemainingSeconds() to check.");
})();
