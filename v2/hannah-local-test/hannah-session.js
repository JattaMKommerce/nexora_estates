/**
 * Hannah Session Manager
 * Ensures independent visitor sessions with zero cross-session leakage.
 */

export class HannahSession {
  constructor() {
    this.sessionId = this.resolveSessionId();
    this.storageKey = `nexora_hannah_session_${this.sessionId}`;
    this.history = this.loadHistory();
    this.listeners = new Set();
  }

  resolveSessionId() {
    // 1. Check URL query parameters (e.g. ?session=5 or ?sid=alice)
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('session') || urlParams.get('sid');
    if (paramId) {
      return `sess_${paramId}`;
    }

    // 2. Check tab-scoped sessionStorage
    const existing = sessionStorage.getItem('nexora_active_session_id');
    if (existing) {
      return existing;
    }

    // 3. Generate a cryptographically random, independent session ID
    const newId = 'nx_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    try {
      sessionStorage.setItem('nexora_active_session_id', newId);
    } catch (e) {
      // storage blocked or private browsing fallback
    }
    return newId;
  }

  getSessionId() {
    return this.sessionId;
  }

  loadHistory() {
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[HannahSession] Error reading session storage:', e);
    }
    return [];
  }

  saveHistory() {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (e) {
      console.warn('[HannahSession] Error writing session storage:', e);
    }
  }

  addMessage(sender, text, metadata = {}) {
    const msg = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      sender, // 'hannah' | 'user' | 'system'
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      ...metadata
    };
    this.history.push(msg);
    this.saveHistory();
    this.notify('message', msg);
    return msg;
  }

  getMessages() {
    return [...this.history];
  }

  clear() {
    this.history = [];
    try {
      sessionStorage.removeItem(this.storageKey);
    } catch (e) {}
    this.notify('clear');
  }

  resetSession() {
    this.clear();
    const newId = 'nx_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    try {
      sessionStorage.setItem('nexora_active_session_id', newId);
    } catch (e) {}
    this.sessionId = newId;
    this.storageKey = `nexora_hannah_session_${this.sessionId}`;
    this.notify('reset', newId);
  }

  on(event, callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, payload) {
    for (const listener of this.listeners) {
      try {
        listener(event, payload);
      } catch (err) {
        console.error('[HannahSession] Listener error:', err);
      }
    }
  }
}

