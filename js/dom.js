/* =========================================================================
   dom.js — Ferramentas para criar e manipular elementos na tela

   Este arquivo é o "kit de ferramentas" do app. Ele contém funções que
   todos os outros arquivos usam para criar coisas visíveis na tela
   (botões, caixas de texto, imagens, etc.) sem precisar repetir código.
   ========================================================================= */

/*
  FUNÇÃO: el (abreviação de "element" = elemento)

  O que faz:
    Cria qualquer coisa visível na tela (um botão, um parágrafo, um campo
    de texto, etc.) já com estilo, texto e ações configurados de uma vez só.

  Parâmetros (o que ela recebe):
    - tag:      o tipo do elemento HTML. Exemplos:
                  "div"    → caixa invisível para organizar outros elementos
                  "button" → botão clicável
                  "p"      → parágrafo de texto
                  "input"  → campo para o usuário digitar
                  "h1"     → título grande
                  "video"  → reprodutor de vídeo
    - opts:     configurações opcionais do elemento:
                  class  → nome do estilo visual (definido no CSS)
                  text   → texto que aparece dentro do elemento
                  html   → HTML completo que aparece dentro do elemento
                  style  → estilo CSS escrito diretamente
                  on     → ações que acontecem quando o usuário interage
                           ex: { click: minhaFuncao } → chama minhaFuncao quando clicado
                  attrs  → atributos extras como type="button", placeholder="Digite aqui"
    - children: lista de elementos que ficarão dentro deste elemento

  Exemplo de uso:
    el("button", { class: "btn-primary", text: "Entrar" })
    → cria um botão vermelho com o texto "Entrar"
*/
function el(tag, opts = {}, children = []) {
  // Cria o elemento HTML com o tipo especificado (div, button, p, etc.)
  const node = document.createElement(tag);

  // Se foi passado um nome de classe CSS, aplica o estilo visual
  if (opts.class) node.className = opts.class;

  // Se foi passado HTML interno, insere o HTML dentro do elemento
  if (opts.html != null) node.innerHTML = opts.html;

  // Se foi passado texto simples, insere o texto dentro do elemento
  if (opts.text != null) node.textContent = opts.text;

  // Se foi passado estilo CSS direto, aplica no elemento
  if (opts.style) node.style.cssText = opts.style;

  // Se foram passadas ações (eventos), registra cada uma
  // ex: on: { click: funcao } → chama 'funcao' quando o usuário clica
  if (opts.on) for (const [ev, fn] of Object.entries(opts.on)) node.addEventListener(ev, fn);

  // Se foram passados atributos extras, define cada um no elemento
  // ex: attrs: { type: "button", placeholder: "Digite aqui" }
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);

  // Adiciona os elementos filhos dentro deste elemento
  // (um filho pode ser outro elemento ou apenas um texto)
  for (const c of [].concat(children)) {
    if (c == null) continue; // ignora valores vazios
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }

  return node; // devolve o elemento criado para quem chamou a função
}

/*
  FUNÇÃO: clear (limpar)

  O que faz:
    Remove tudo que está dentro de um elemento da tela.
    Usada sempre que precisamos trocar o conteúdo de uma área
    (ex: quando o usuário muda de aba, limpamos a área de conteúdo
    e desenhamos o conteúdo novo).

  Parâmetro:
    - node: o elemento cuja área interna será apagada
*/
function clear(node) { node.replaceChildren(); }

/*
  FUNÇÃO: shuffle (embaralhar)

  O que faz:
    Embaralha uma lista de itens em ordem aleatória.
    Funciona como baralhar um baralho de cartas.
    O original não é modificado — ela cria uma cópia embaralhada.

  Parâmetro:
    - arr: a lista que será embaralhada (ex: lista de perguntas do quiz)

  Algoritmo usado: Fisher-Yates (método matemático garantido de ser aleatório)
*/
function shuffle(arr) {
  const a = [...arr]; // cria uma cópia da lista para não alterar o original
  for (let i = a.length - 1; i > 0; i--) {
    // Escolhe uma posição aleatória entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    // Troca o elemento na posição i com o da posição j
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a; // devolve a lista embaralhada
}

/*
  FUNÇÃO: getDriveEmbedUrl (obter URL de incorporação do Google Drive)

  O que faz:
    Converte um link normal do Google Drive (aquele que você copia para
    compartilhar um vídeo) em um link especial que permite reproduzir o
    vídeo diretamente dentro do app, sem precisar abrir o Google Drive.

  Parâmetro:
    - url: o link copiado do Google Drive
           ex: https://drive.google.com/file/d/ABC123/view

  Resultado:
    - Devolve o link de incorporação:
           ex: https://drive.google.com/file/d/ABC123/preview
    - Se o link não for do Google Drive, devolve o link original sem alterar
*/
function getDriveEmbedUrl(url) {
  // Procura o ID do arquivo dentro do link (a parte após "/d/")
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  // Se encontrou o ID, monta a URL de preview; senão, retorna o link original
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

/*
  FUNÇÃO: isLocalVideo (é um vídeo local?)

  O que faz:
    Verifica se um endereço (URL) aponta para um arquivo de vídeo que está
    salvo no próprio computador/servidor, em vez de estar no Google Drive.

  Parâmetro:
    - url: o endereço do vídeo a verificar

  Resultado:
    - true  → o endereço termina em .mp4, .webm ou .ogg (é um vídeo local)
    - false → não é um vídeo local (provavelmente é um link do Drive)
*/
function isLocalVideo(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

/*
  EXPORTAÇÃO: window.DOM

  Agrupa todas as funções deste arquivo em um objeto chamado "DOM" que
  fica disponível para qualquer outro arquivo JS do projeto usar.

  Uso em outros arquivos:
    const { el } = DOM;        → importa a função el
    DOM.clear(meuElemento);    → limpa um elemento
    DOM.shuffle(minhaLista);   → embaralha uma lista
*/
window.DOM = { el, clear, shuffle, getDriveEmbedUrl, isLocalVideo };
