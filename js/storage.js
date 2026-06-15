/* =========================================================================
   storage.js — Persistência via localStorage
   Única responsabilidade: ler/gravar dados do app.
   ========================================================================= */

const KEYS = {
  USERS: "sef_users",
  SESSION: "sef_session",
  VIDEOS: "sef_videos",
  SORTEIOS: "sef_sorteios",
  QUIZ_RESULTS: "sef_quiz_results",
};

/** Lê e parseia uma chave; devolve fallback em caso de erro. */
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Grava valor serializado em uma chave. */
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Usuários ───────────────────────────────────────────────────────────────
const getUsers = () => read(KEYS.USERS, []);
const saveUsers = (users) => write(KEYS.USERS, users);

// ── Sessão ─────────────────────────────────────────────────────────────────
const getSession = () => read(KEYS.SESSION, null);
function saveSession(user) {
  if (user) write(KEYS.SESSION, user);
  else localStorage.removeItem(KEYS.SESSION);
}

// ── Vídeos (mapa numTema -> url) ─────────────────────────────────────────────
const getVideos = () => read(KEYS.VIDEOS, {});
const saveVideos = (videos) => write(KEYS.VIDEOS, videos);

// ── Sorteios ─────────────────────────────────────────────────────────────────
const getSorteios = () => read(KEYS.SORTEIOS, []);
function addSorteio(sorteio) {
  const arr = getSorteios();
  arr.push(sorteio);
  write(KEYS.SORTEIOS, arr);
}

// ── Resultados de quiz/joguinho/simulado ─────────────────────────────────────
const getQuizResults = () => read(KEYS.QUIZ_RESULTS, []);
function saveQuizResult(result) {
  const arr = getQuizResults();
  arr.push(result);
  write(KEYS.QUIZ_RESULTS, arr);
}

window.Storage = {
  getUsers, saveUsers,
  getSession, saveSession,
  getVideos, saveVideos,
  getSorteios, addSorteio,
  getQuizResults, saveQuizResult,
};
