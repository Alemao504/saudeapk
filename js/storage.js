/* =========================================================================
   storage.js — Memória do app: salva e lê dados no navegador

   Este arquivo é responsável por guardar e recuperar todas as informações
   do app no "localStorage" — uma espécie de memória do navegador que
   persiste mesmo depois de fechar e reabrir a página.

   O que é guardado aqui:
     • Lista de usuários cadastrados (nome, e-mail, senha, faculdade...)
     • Sessão atual (quem está logado no momento)
     • Links dos vídeos de cada tema
     • Histórico de sorteios (qual tema cada usuário sortejou)
     • Resultados dos quizzes, joguinhos e simulados

   IMPORTANTE: os dados ficam apenas no navegador do usuário.
   Se o usuário limpar o cache ou usar outro dispositivo, os dados somem.
   ========================================================================= */

/*
  CHAVES (KEYS): nomes usados para identificar cada tipo de dado no localStorage.

  Funciona como etiquetas em pastas: cada dado é guardado com um nome único
  para poder ser encontrado depois.

  Nomes usados:
    sef_users        → lista de todos os usuários cadastrados
    sef_session      → dados do usuário que está logado agora
    sef_videos       → links dos vídeos de cada tema (configurados no painel admin)
    sef_sorteios     → registro de todos os sorteios realizados
    sef_quiz_results → resultados de quizzes, joguinhos e simulados
*/
const KEYS = {
  USERS: "sef_users",
  SESSION: "sef_session",
  VIDEOS: "sef_videos",
  SORTEIOS: "sef_sorteios",
  QUIZ_RESULTS: "sef_quiz_results",
};

/*
  FUNÇÃO: read (ler)

  O que faz:
    Busca um dado guardado no localStorage pelo nome (chave).
    Se o dado existir, devolve ele. Se não existir ou der erro, devolve
    um valor padrão (fallback) que você define.

  Parâmetros:
    - key:      o nome da "etiqueta" (ex: "sef_users")
    - fallback: o que devolver se não encontrar nada
                ex: [] para uma lista vazia, null para nenhum dado

  Por que tem o try/catch?
    Às vezes o dado salvo fica corrompido. O try/catch evita que isso
    quebre o app — se der erro, simplesmente devolve o fallback.
*/
function read(key, fallback) {
  try {
    // Busca o dado salvo (está em formato de texto, ex: '[{"nome":"João"}]')
    const raw = localStorage.getItem(key);
    // Converte o texto de volta para objeto/lista JavaScript
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    // Se der algum erro na leitura, devolve o valor padrão
    return fallback;
  }
}

/*
  FUNÇÃO: write (escrever/salvar)

  O que faz:
    Guarda um dado no localStorage com um nome (chave).
    O dado é convertido para texto (JSON) antes de ser salvo,
    porque o localStorage só aceita texto.

  Parâmetros:
    - key:   o nome da "etiqueta" para identificar o dado
    - value: o dado a ser salvo (pode ser um objeto, lista, número, etc.)
*/
function write(key, value) {
  // JSON.stringify converte o dado para texto
  // ex: [{nome:"João"}] vira a string '[{"nome":"João"}]'
  localStorage.setItem(key, JSON.stringify(value));
}

/* ── USUÁRIOS ──────────────────────────────────────────────────────────────

   Gerencia a lista de pessoas cadastradas no app.
   Cada usuário tem: email, senha, nome, univ, estado, cidade, criadoEm
*/

// Lê a lista de usuários. Se não houver nenhum, devolve lista vazia [].
const getUsers = () => read(KEYS.USERS, []);

// Salva a lista de usuários (sobrescreve a lista anterior).
const saveUsers = (users) => write(KEYS.USERS, users);

/* ── SESSÃO ────────────────────────────────────────────────────────────────

   Controla quem está logado no momento.
   Quando o usuário faz login, os dados dele são salvos aqui.
   Quando faz logout, esse dado é apagado.
*/

// Lê quem está logado. Devolve null se ninguém estiver logado.
const getSession = () => read(KEYS.SESSION, null);

// Salva ou remove a sessão atual:
//   saveSession(usuario) → guarda que esse usuário está logado
//   saveSession(null)    → apaga a sessão (logout)
function saveSession(user) {
  if (user) write(KEYS.SESSION, user);   // guarda os dados do usuário
  else localStorage.removeItem(KEYS.SESSION); // apaga a sessão
}

/* ── VÍDEOS ────────────────────────────────────────────────────────────────

   Guarda os links dos vídeos de cada tema, configurados no painel admin.
   Funciona como um dicionário: número do tema → link do vídeo.

   Exemplo do que fica guardado:
     { "1": "https://drive.google.com/...", "5": "video/depressao.mp4" }
*/

// Lê o mapeamento de vídeos. Devolve {} (vazio) se nenhum foi configurado.
const getVideos = () => read(KEYS.VIDEOS, {});

// Salva o mapeamento de vídeos (substitui o anterior completo).
const saveVideos = (videos) => write(KEYS.VIDEOS, videos);

/* ── SORTEIOS ──────────────────────────────────────────────────────────────

   Guarda um histórico de todos os sorteios realizados.
   Cada registro tem: qual tema saiu (num), quando foi (ts) e quem sorteou (user).

   Exemplo:
     [
       { num: 3, ts: "2025-06-01T14:00:00Z", user: "joao@email.com" },
       { num: 7, ts: "2025-06-01T15:30:00Z", user: "maria@email.com" }
     ]
*/

// Lê a lista de sorteios. Devolve [] se não houver nenhum.
const getSorteios = () => read(KEYS.SORTEIOS, []);

// Adiciona um novo sorteio à lista (sem apagar os anteriores).
function addSorteio(sorteio) {
  const arr = getSorteios(); // busca a lista atual
  arr.push(sorteio);         // adiciona o novo sorteio no final
  write(KEYS.SORTEIOS, arr); // salva a lista atualizada
}

/* ── RESULTADOS DE QUIZ / JOGUINHO / SIMULADO ──────────────────────────────

   Guarda o histórico de resultados dos jogos.
   Cada resultado tem: tipo do jogo, acertos, total, data, usuário e detalhes.
*/

// Lê a lista de resultados. Devolve [] se não houver nenhum.
const getQuizResults = () => read(KEYS.QUIZ_RESULTS, []);

// Adiciona um novo resultado (sem apagar os anteriores).
function saveQuizResult(result) {
  const arr = getQuizResults(); // busca os resultados anteriores
  arr.push(result);             // adiciona o novo resultado
  write(KEYS.QUIZ_RESULTS, arr);// salva a lista atualizada
}

/*
  EXPORTAÇÃO: window.Storage

  Agrupa todas as funções deste arquivo em um objeto chamado "Storage",
  disponível para todos os outros arquivos JS do projeto.

  Uso em outros arquivos:
    Storage.getUsers()          → lista todos os usuários
    Storage.saveSession(user)   → salva quem está logado
    Storage.addSorteio({...})   → registra um sorteio
    etc.
*/
window.Storage = {
  getUsers, saveUsers,
  getSession, saveSession,
  getVideos, saveVideos,
  getSorteios, addSorteio,
  getQuizResults, saveQuizResult,
};
