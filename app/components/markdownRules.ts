// markdownRules.ts

export interface MarkdownRule {
  name: string;
  pattern: RegExp;
  renderReplacement: string;
  highlightReplacement: string;
}

export const markdownRules: MarkdownRule[] = [
  /* 1) Code Blocks (triple backticks) 
     ---------------------------------
     On capte tout ce qui se trouve entre:
       ``` (quelque-chose) ```
     dans le texte multi-ligne.
     ATTENTION : risque de capturer de gros blocs, 
     et d’empêcher l’analyse interne (on ne remplace 
     pas le markdown interne du bloc). 
     Ordre : on le met en premier pour éviter 
     que d’autres règles n’interfèrent. 
  */
  {
    name: "codeBlock",
    // Capturer tout ce qui se trouve entre ```
    // [^]+? -> .+ multiline, non-greedy
    pattern: /```([^]+?)```/g,
    // On isole le contenu dans <pre><code>...</code></pre>
    renderReplacement: "<pre><code>$1</code></pre>",
    // On entoure les backticks de .opacity-50
    // et on affiche le contenu en brut
    highlightReplacement:
      '<span class="opacity-50">```</span>$1<span class="opacity-50">```</span>'
  },

  /* 2) Titres (6 niveaux) 
     ---------------------
     Ordre : du plus gros (h6) au plus petit (h1),
     ou inversement, selon votre préférence. 
     Ici, on va du h6 vers h1 pour éviter les conflits.
  */
  {
    name: "heading6",
    pattern: /^###### (.*)$/gm,
    renderReplacement: "<h6>$1</h6>",
    highlightReplacement: '<span class="opacity-50">######</span> $1'
  },
  {
    name: "heading5",
    pattern: /^##### (.*)$/gm,
    renderReplacement: "<h5>$1</h5>",
    highlightReplacement: '<span class="opacity-50">#####</span> $1'
  },
  {
    name: "heading4",
    pattern: /^#### (.*)$/gm,
    renderReplacement: "<h4>$1</h4>",
    highlightReplacement: '<span class="opacity-50">####</span> $1'
  },
  {
    name: "heading3",
    pattern: /^### (.*)$/gm,
    renderReplacement: "<h3>$1</h3>",
    highlightReplacement: '<span class="opacity-50">###</span> $1'
  },
  {
    name: "heading2",
    pattern: /^## (.*)$/gm,
    renderReplacement: "<h2>$1</h2>",
    highlightReplacement: '<span class="opacity-50">##</span> $1'
  },
  {
    name: "heading1",
    pattern: /^# (.*)$/gm,
    renderReplacement: "<h1>$1</h1>",
    highlightReplacement: '<span class="opacity-50">#</span> $1'
  },

  /* 3) Blockquotes (lignes commençant par '> ')
     ------------------------------------------- 
     RegExp multi-ligne, on remplace tout ce qui 
     est à la ligne et commence par '> '.
  */
  {
    name: "blockquote",
    pattern: /^> (.*)$/gm,
    renderReplacement: "<blockquote>$1</blockquote>",
    highlightReplacement: '<span class="opacity-50">&gt;</span> $1'
  },

  /* 4) Listes à puces (ligne commençant par '- ')
     ---------------------------------------------
     Simple exemple : '- item'
     (Ne gère pas l’imbrication et pas les '* ' ou '+ ')
  */
  {
    name: "ulist",
    pattern: /^- (.*)$/gm,
    renderReplacement: "<ul><li>$1</li></ul>",
    highlightReplacement: '<span class="opacity-50">-</span> $1'
  },

  /* 5) Listes ordonnées (ligne commençant par 'X. ')
     ------------------------------------------------
     Simple exemple : '1. item'
     (Ne gère pas l’imbrication, etc.)
  */
  {
    name: "olist",
    pattern: /^(\d+)\\. (.*)$/gm,
    renderReplacement: '<ol start="$1"><li>$2</li></ol>',
    highlightReplacement: '<span class="opacity-50">$1.</span> $2'
  },

  /* 6) Images ![alt](url)
     ---------------------
     On capte '! [quelque-chose] (url)' 
     et on remplace par <img src="url" alt="alt"/>
  */
  {
    name: "image",
    pattern: /!\[(.*?)\]\((.*?)\)/g,
    renderReplacement: '<img src="$2" alt="$1" />',
    highlightReplacement:
      '<span class="opacity-50">![</span>$1<span class="opacity-50">](</span>$2<span class="opacity-50">)</span>'
  },

  /* 7) Liens [texte](url)
     ---------------------
     On capte '[texte](url)' => <a href="url">texte</a>
  */
  {
    name: "link",
    pattern: /\[(.*?)\]\((.*?)\)/g,
    renderReplacement: '<a href="$2" target="_blank" rel="noopener">$1</a>',
    highlightReplacement:
      '<span class="opacity-50">[</span>$1<span class="opacity-50">](</span>$2<span class="opacity-50">)</span>'
  },

  /* 8) Gras **texte**
     -----------------
     2 étoiles autour du contenu => <strong>
     On gère la capture en 3 groupes 
     (**) (contenu) (**)
  */
  {
    name: "bold",
    pattern: /(\*\*)(.+?)(\*\*)/g,
    renderReplacement: "<strong>$2</strong>",
    highlightReplacement:
      '<span class="opacity-50">$1</span>$2<span class="opacity-50">$3</span>'
  },

  /* 9) Italique *texte*
     -------------------
     Idem, 3 groupes 
  */
  {
    name: "italic",
    pattern: /(\*)(.+?)(\*)/g,
    renderReplacement: "<em>$2</em>",
    highlightReplacement:
      '<span class="opacity-50">$1</span>$2<span class="opacity-50">$3</span>'
  },

  /* 10) Barré ~~texte~~
      -------------------
  */
  {
    name: "strikethrough",
    pattern: /(~~)(.+?)(~~)/g,
    renderReplacement: "<del>$2</del>",
    highlightReplacement:
      '<span class="opacity-50">$1</span>$2<span class="opacity-50">$3</span>'
  },

  /* 11) Code inline `code`
      ---------------------
      On remplace `quelque-chose` par <code>quelque-chose</code>
      On le fait après les blocs triple backticks pour éviter 
      de casser le code déjà transformé.
  */
  {
    name: "inlineCode",
    pattern: /`([^`]+)`/g,
    renderReplacement: "<code>$1</code>",
    highlightReplacement:
      '<span class="opacity-50">`</span>$1<span class="opacity-50">`</span>'
  }
];
