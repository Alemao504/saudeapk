/* =========================================================================
   dom.js — Funções utilitárias de criação de elementos
   ========================================================================= */

/** Cria elemento com classes, atributos e filhos. */
function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.html != null) node.innerHTML = opts.html;
  if (opts.text != null) node.textContent = opts.text;
  if (opts.style) node.style.cssText = opts.style;
  if (opts.on) for (const [ev, fn] of Object.entries(opts.on)) node.addEventListener(ev, fn);
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

/** Esvazia um container. */
function clear(node) { node.replaceChildren(); }

/** Embaralha (Fisher-Yates) sem mutar o original. */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Converte link do Google Drive em URL de preview embutível. */
function getDriveEmbedUrl(url) {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

/** Detecta arquivo de vídeo local (mp4/webm/ogg). */
function isLocalVideo(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

window.DOM = { el, clear, shuffle, getDriveEmbedUrl, isLocalVideo };
