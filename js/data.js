/* =========================================================================
   data.js — Banco de dados estático (20 temas + 60 questões)
   Gerado a partir do projeto original. Mantido como JS para funcionar
   offline via file:// (fetch de JSON é bloqueado pelo navegador).
   ========================================================================= */

const THEMES = [
  {
    "num": 1,
    "nome": "Hipertensão",
    "badge": "Doenças Crônicas",
    "icon": "🫀",
    "c1": "#7a1515",
    "c2": "#b52b2b",
    "desc": "A pressão alta afeta 1 em cada 3 adultos brasileiros — principal causa de AVC e infarto.",
    "intro": "A hipertensão arterial sistêmica (HAS) é uma condição crônica em que a pressão nas artérias se mantém elevada. Silenciosa na maioria dos casos, danifica coração, rins, cérebro e vasos.",
    "stats": [
      {
        "v": "36%",
        "l": "Adultos brasileiros"
      },
      {
        "v": "300 mi",
        "l": "Casos no mundo"
      },
      {
        "v": "50%",
        "l": "Não sabem que têm"
      }
    ],
    "riscos": [
      "AVC (derrame)",
      "Infarto",
      "Insuficiência renal",
      "Perda de visão",
      "Aneurisma"
    ],
    "prev": [
      "Reduzir sal",
      "Exercícios",
      "Evitar álcool/cigarro",
      "Medir pressão",
      "Controlar estresse"
    ],
    "roteiro": "<strong>Início:</strong> 36% dos adultos têm hipertensão. <strong>Meio:</strong> Doença silenciosa e órgãos afetados. <strong>Final:</strong> Dieta DASH e medição regular."
  },
  {
    "num": 2,
    "nome": "Diabetes",
    "badge": "Doenças Crônicas",
    "icon": "🩸",
    "c1": "#6b3d00",
    "c2": "#b86800",
    "desc": "16 milhões de diabéticos no Brasil — 3º país com mais casos no mundo.",
    "intro": "O diabetes tipo 2 representa 90% dos casos. Sem tratamento causa cegueira, amputações e falência renal.",
    "stats": [
      {
        "v": "16 mi",
        "l": "Brasileiros"
      },
      {
        "v": "3º",
        "l": "No mundo"
      },
      {
        "v": "30%",
        "l": "Sem diagnóstico"
      }
    ],
    "riscos": [
      "Cegueira",
      "Amputação",
      "Doença renal",
      "AVC",
      "Cicatrização lenta"
    ],
    "prev": [
      "Baixo índice glicêmico",
      "Exercício diário",
      "Controle do peso",
      "Glicemia anual",
      "Menos açúcar"
    ],
    "roteiro": "<strong>Início:</strong> 3º país com mais diabéticos. <strong>Meio:</strong> Tipo 1 vs tipo 2. <strong>Final:</strong> Dieta e exercício revertem pré-diabetes."
  },
  {
    "num": 3,
    "nome": "Automedicação",
    "badge": "Segurança",
    "icon": "💊",
    "c1": "#14336b",
    "c2": "#2060b0",
    "desc": "35% dos brasileiros se automedicam — mais de 3.000 mortes por ano.",
    "intro": "A automedicação é a 1ª causa de intoxicação no Brasil, causando resistência a antibióticos e mascaramento de doenças.",
    "stats": [
      {
        "v": "35%",
        "l": "Se automedicam"
      },
      {
        "v": "3.200",
        "l": "Mortes/ano"
      },
      {
        "v": "1ª",
        "l": "Causa de intox."
      }
    ],
    "riscos": [
      "Intoxicação",
      "Resistência antibiótica",
      "Doenças mascaradas",
      "Interações",
      "Dependência"
    ],
    "prev": [
      "Consultar médico",
      "Não compartilhar",
      "Ler bulas",
      "Guardar receita",
      "Descartar vencidos"
    ],
    "roteiro": "<strong>Início:</strong> Dor de cabeça e remédio sem receita. <strong>Meio:</strong> Intoxicação e resistência bacteriana. <strong>Final:</strong> UBS, farmacêutico, telemedicina."
  },
  {
    "num": 4,
    "nome": "Ansiedade e Estresse",
    "badge": "Saúde Mental",
    "icon": "🧠",
    "c1": "#280f54",
    "c2": "#5c2d91",
    "desc": "Brasil é o país mais ansioso do mundo — 9,3% da população.",
    "intro": "O Brasil lidera o ranking global de transtornos ansiosos. A ansiedade crônica compromete sistema imunológico, cardiovascular e qualidade de vida.",
    "stats": [
      {
        "v": "9,3%",
        "l": "Da população"
      },
      {
        "v": "1º",
        "l": "País mais ansioso"
      },
      {
        "v": "264 mi",
        "l": "No mundo"
      }
    ],
    "riscos": [
      "Insônia",
      "Doenças cardiovasc.",
      "Imunidade baixa",
      "Depressão",
      "Burnout"
    ],
    "prev": [
      "Meditação",
      "Exercício",
      "Menos redes sociais",
      "Terapia TCC",
      "Sono de qualidade"
    ],
    "roteiro": "<strong>Início:</strong> Situações do dia a dia. <strong>Meio:</strong> Normal vs. patológica. <strong>Final:</strong> Respiração 4-7-8, grounding."
  },
  {
    "num": 5,
    "nome": "Depressão",
    "badge": "Saúde Mental",
    "icon": "🌧️",
    "c1": "#122040",
    "c2": "#1e3a7a",
    "desc": "12 milhões de brasileiros com depressão — principal causa de incapacidade no mundo.",
    "intro": "A depressão altera a química cerebral e pode ser fatal. Ainda carrega enorme estigma, impedindo o tratamento.",
    "stats": [
      {
        "v": "12 mi",
        "l": "Brasileiros"
      },
      {
        "v": "800 mil",
        "l": "Suicídios/ano"
      },
      {
        "v": "70%",
        "l": "Melhoram com tratamento"
      }
    ],
    "riscos": [
      "Pensamentos suicidas",
      "Isolamento",
      "Perda de emprego",
      "Drogas",
      "Doenças físicas"
    ],
    "prev": [
      "Apoio psicológico",
      "Vínculos sociais",
      "Exercício",
      "Luz solar",
      "Falar sobre sentimentos"
    ],
    "roteiro": "<strong>Início:</strong> Depressão não é frescura. <strong>Meio:</strong> Fadiga, dores, insônia. <strong>Final:</strong> CVV 188, CAPS, UBS."
  },
  {
    "num": 6,
    "nome": "Sedentarismo",
    "badge": "Estilo de Vida",
    "icon": "🏃",
    "c1": "#0f3d0f",
    "c2": "#1e8449",
    "desc": "47% dos brasileiros são sedentários — 4ª maior causa de morte no mundo.",
    "intro": "O sedentarismo é a 4ª maior causa de morte no planeta. Quase metade dos adultos brasileiros não atinge as recomendações mínimas.",
    "stats": [
      {
        "v": "47%",
        "l": "Sedentários"
      },
      {
        "v": "4ª",
        "l": "Causa de morte"
      },
      {
        "v": "150 min",
        "l": "Mínimo/semana"
      }
    ],
    "riscos": [
      "Obesidade",
      "Diabetes tipo 2",
      "Doenças cardíacas",
      "Osteoporose",
      "Depressão"
    ],
    "prev": [
      "30 min caminhada/dia",
      "Subir escadas",
      "Exercício em grupo",
      "Apps de atividade",
      "Pausas ativas"
    ],
    "roteiro": "<strong>Início:</strong> Você se mexe o suficiente? <strong>Meio:</strong> Inatividade no corpo. <strong>Final:</strong> Atividades sem academia."
  },
  {
    "num": 7,
    "nome": "Obesidade",
    "badge": "Nutrição",
    "icon": "🥗",
    "c1": "#3d1f00",
    "c2": "#c0651a",
    "desc": "57% dos brasileiros acima do peso — R$ 2,1 bi/ano ao SUS.",
    "intro": "A obesidade está associada a mais de 200 condições médicas e gera R$ 2,1 bi de custo anual ao SUS.",
    "stats": [
      {
        "v": "57%",
        "l": "Com sobrepeso"
      },
      {
        "v": "22%",
        "l": "Com obesidade"
      },
      {
        "v": "R$2,1bi",
        "l": "Custo/ano"
      }
    ],
    "riscos": [
      "Diabetes",
      "Hipertensão",
      "Apneia do sono",
      "Articulações",
      "Câncer"
    ],
    "prev": [
      "Menos ultraprocessados",
      "Mais fibras",
      "Exercício",
      "Nutricionista",
      "Mindful eating"
    ],
    "roteiro": "<strong>Início:</strong> Semáforo nutricional. <strong>Meio:</strong> Ambiente obesogênico. <strong>Final:</strong> Prato saudável."
  },
  {
    "num": 8,
    "nome": "Dengue",
    "badge": "Infectologia",
    "icon": "🦟",
    "c1": "#0a3d2a",
    "c2": "#0e8a6a",
    "desc": "6,9 milhões de casos em 2024 — pior surto da história do Brasil.",
    "intro": "Com 4 sorotipos, a reinfecção pode ser grave e fatal. 2024 foi o pior surto da história.",
    "stats": [
      {
        "v": "6,9 mi",
        "l": "Casos 2024"
      },
      {
        "v": "5.400",
        "l": "Mortes"
      },
      {
        "v": "4",
        "l": "Sorotipos"
      }
    ],
    "riscos": [
      "Dengue hemorrágica",
      "Choque",
      "Sangramento",
      "Reinfecção grave",
      "Trombocitopenia"
    ],
    "prev": [
      "Eliminar água parada",
      "Repelente",
      "Telas",
      "Vacina Qdenga",
      "Dengue Zero"
    ],
    "roteiro": "<strong>Início:</strong> Números de 2024. <strong>Meio:</strong> Sinais de alarme. <strong>Final:</strong> 10 focos de água parada."
  },
  {
    "num": 9,
    "nome": "Falta de Vacinação",
    "badge": "Imunização",
    "icon": "💉",
    "c1": "#002a52",
    "c2": "#0055a5",
    "desc": "Cobertura vacinal caiu para 70% — sarampo voltou em 2019.",
    "intro": "A cobertura caiu drasticamente, com o retorno de doenças como sarampo e poliomielite.",
    "stats": [
      {
        "v": "70%",
        "l": "Cobertura atual"
      },
      {
        "v": "95%",
        "l": "Meta ideal"
      },
      {
        "v": "20",
        "l": "Vacinas no calendário"
      }
    ],
    "riscos": [
      "Surtos de sarampo",
      "Retorno da pólio",
      "Coqueluche",
      "Mortes evitáveis",
      "Sem imunidade coletiva"
    ],
    "prev": [
      "Caderneta atualizada",
      "Postos gratuitos",
      "Combater fake news",
      "Campanhas",
      "Calendário MS"
    ],
    "roteiro": "<strong>Início:</strong> Doenças que a vacina eliminou. <strong>Meio:</strong> Imunidade de rebanho. <strong>Final:</strong> Como e onde vacinar."
  },
  {
    "num": 10,
    "nome": "Saúde da Mulher",
    "badge": "Ginecologia",
    "icon": "🎗️",
    "c1": "#5a0f2e",
    "c2": "#a02050",
    "desc": "6.400 mortes/ano por câncer do colo do útero — quase totalmente evitável.",
    "intro": "O câncer do colo do útero é altamente prevenível pelo Papanicolau e vacina HPV.",
    "stats": [
      {
        "v": "6.400",
        "l": "Mortes/ano"
      },
      {
        "v": "3º",
        "l": "Câncer mais comum"
      },
      {
        "v": "100%",
        "l": "Evitável"
      }
    ],
    "riscos": [
      "Câncer cervical",
      "HPV não tratado",
      "Diagnóstico tardio",
      "Câncer de mama",
      "Osteoporose"
    ],
    "prev": [
      "Papanicolau 3 anos",
      "Vacina HPV",
      "Mamografia >50",
      "Autoexame",
      "Ginecologista anual"
    ],
    "roteiro": "<strong>Início:</strong> 5 minutos salvam vidas. <strong>Meio:</strong> HPV e Papanicolau. <strong>Final:</strong> Grátis no SUS."
  },
  {
    "num": 11,
    "nome": "Gravidez na Adolescência",
    "badge": "Saúde Sexual",
    "icon": "🤰",
    "c1": "#3d1500",
    "c2": "#8c3a00",
    "desc": "3ª maior taxa na América Latina — 20% dos partos são de adolescentes.",
    "intro": "A gravidez na adolescência interrompe trajetórias escolares e perpetua ciclos de pobreza.",
    "stats": [
      {
        "v": "3º",
        "l": "América Latina"
      },
      {
        "v": "20%",
        "l": "Dos partos"
      },
      {
        "v": "66%",
        "l": "Baixa renda"
      }
    ],
    "riscos": [
      "Pré-eclâmpsia",
      "Parto prematuro",
      "Evasão escolar",
      "Depressão pós-parto",
      "Pobreza"
    ],
    "prev": [
      "Ed. sexual",
      "Contraceptivos",
      "Diálogo familiar",
      "CRAS",
      "Combate ao abuso"
    ],
    "roteiro": "<strong>Início:</strong> 1 em 5 partos: adolescente. <strong>Meio:</strong> Impactos na saúde. <strong>Final:</strong> Contraceptivos gratuitos no SUS."
  },
  {
    "num": 12,
    "nome": "ISTs",
    "badge": "Saúde Sexual",
    "icon": "🔬",
    "c1": "#0a2e2e",
    "c2": "#0a6b5a",
    "desc": "Sífilis cresceu 3.000% em 10 anos — crise silenciosa.",
    "intro": "A sífilis ressurgiu em proporções alarmantes e o HIV ainda infecta 40.000 brasileiros por ano.",
    "stats": [
      {
        "v": "3.000%",
        "l": "Aumento sífilis"
      },
      {
        "v": "40.000",
        "l": "Novos HIV/ano"
      },
      {
        "v": "1 mi",
        "l": "Com HIV"
      }
    ],
    "riscos": [
      "HIV/AIDS",
      "Sífilis congênita",
      "HPV/câncer",
      "Infertilidade",
      "Herpes neonatal"
    ],
    "prev": [
      "Preservativo",
      "Testagem",
      "PrEP no SUS",
      "Vacina HPV",
      "Diálogo"
    ],
    "roteiro": "<strong>Início:</strong> Dados da sífilis. <strong>Meio:</strong> ISTs assintomáticas. <strong>Final:</strong> PrEP, testagem gratuita."
  },
  {
    "num": 13,
    "nome": "Álcool e Drogas",
    "badge": "Saúde Mental",
    "icon": "🍺",
    "c1": "#231500",
    "c2": "#6b3d00",
    "desc": "Álcool: 3ª causa de morte evitável — 50% dos acidentes fatais.",
    "intro": "O álcool está em 50% dos acidentes fatais. A dependência química é doença que exige tratamento.",
    "stats": [
      {
        "v": "3ª",
        "l": "Morte evitável"
      },
      {
        "v": "50%",
        "l": "Acidentes fatais"
      },
      {
        "v": "12%",
        "l": "Leitos do SUS"
      }
    ],
    "riscos": [
      "Cirrose",
      "Acidentes",
      "Psicose",
      "Violência doméstica",
      "Overdose"
    ],
    "prev": [
      "CAPS-AD",
      "Apoio familiar",
      "Terapia TCC",
      "AA e NA",
      "Acolhimento"
    ],
    "roteiro": "<strong>Início:</strong> Normalização do álcool. <strong>Meio:</strong> Dependência é doença. <strong>Final:</strong> CAPS-AD, CVV 188."
  },
  {
    "num": 14,
    "nome": "Higiene Pessoal",
    "badge": "Prevenção Básica",
    "icon": "🧼",
    "c1": "#002a40",
    "c2": "#005b8a",
    "desc": "Lavar as mãos certo: 40% menos infecções resp. e 50% menos diarreias.",
    "intro": "A lavagem das mãos é a medida de saúde pública mais custo-efetiva do mundo.",
    "stats": [
      {
        "v": "40%",
        "l": "Menos infecções"
      },
      {
        "v": "50%",
        "l": "Menos diarreias"
      },
      {
        "v": "1,4 mi",
        "l": "Crianças/ano"
      }
    ],
    "riscos": [
      "Diarreias",
      "Infecções resp.",
      "Hepatite A",
      "Conjuntivite",
      "Pediculose"
    ],
    "prev": [
      "Mãos: 7 passos",
      "Dentes 3x/dia",
      "Banho regular",
      "Não compartilhar",
      "Lavar roupas"
    ],
    "roteiro": "<strong>Início:</strong> Germes no celular, maçaneta, dinheiro. <strong>Meio:</strong> 7 passos ao vivo. <strong>Final:</strong> Higiene em família."
  },
  {
    "num": 15,
    "nome": "Saúde do Idoso",
    "badge": "Geriatria",
    "icon": "👴",
    "c1": "#252500",
    "c2": "#6b6b00",
    "desc": "1 em cada 3 idosos cai por ano — principal causa de morte acidental.",
    "intro": "Os idosos representam 15% da população. As quedas são preveníveis com adaptações no ambiente.",
    "stats": [
      {
        "v": "1 em 3",
        "l": "Cai/ano"
      },
      {
        "v": "30%",
        "l": "Da pop. em 2050"
      },
      {
        "v": "15%",
        "l": "Da pop. atual"
      }
    ],
    "riscos": [
      "Fraturas de quadril",
      "Isolamento",
      "Polifarmácia",
      "Demência",
      "Desnutrição"
    ],
    "prev": [
      "Remover tapetes",
      "Barras de apoio",
      "Equilíbrio",
      "Revisar remédios",
      "Vacinação"
    ],
    "roteiro": "<strong>Início:</strong> Uma queda muda tudo. <strong>Meio:</strong> Riscos em casa. <strong>Final:</strong> 3 adaptações simples."
  },
  {
    "num": 16,
    "nome": "Alimentação Infantil",
    "badge": "Nutrição",
    "icon": "🍎",
    "c1": "#0f3d00",
    "c2": "#2e8b00",
    "desc": "Os primeiros 1.000 dias de vida definem a saúde para sempre.",
    "intro": "A introdução precoce de ultraprocessados forma uma geração com sobrepeso e deficiências.",
    "stats": [
      {
        "v": "1.000",
        "l": "Dias decisivos"
      },
      {
        "v": "45%",
        "l": "<2a com ultraproc."
      },
      {
        "v": "6 meses",
        "l": "Amamentação exclusiva"
      }
    ],
    "riscos": [
      "Obesidade infantil",
      "Anemia",
      "Cáries precoces",
      "Alergias",
      "Atraso no desenvolvimento"
    ],
    "prev": [
      "Amamentação 6 meses",
      "Sem açúcar",
      "Sem ultraproc.",
      "Puericultura",
      "Alimentação colorida"
    ],
    "roteiro": "<strong>Início:</strong> Açúcar oculto no rótulo infantil. <strong>Meio:</strong> Os 1.000 dias. <strong>Final:</strong> BLW e alimentação responsiva."
  },
  {
    "num": 17,
    "nome": "Saúde Bucal",
    "badge": "Odontologia",
    "icon": "🦷",
    "c1": "#002929",
    "c2": "#005555",
    "desc": "Cárie: doença mais prevalente do mundo — 90% dos adultos já tiveram.",
    "intro": "Doenças na boca estão associadas a problemas cardíacos, diabetes e doenças respiratórias.",
    "stats": [
      {
        "v": "90%",
        "l": "Com histórico de cárie"
      },
      {
        "v": "1ª",
        "l": "Mais prevalente"
      },
      {
        "v": "47%",
        "l": "Sem dentista"
      }
    ],
    "riscos": [
      "Cárie",
      "Doença periodontal",
      "Infecção sistêmica",
      "Câncer bucal",
      "Mastigação"
    ],
    "prev": [
      "Escovar 3x/dia",
      "Fio dental",
      "Dentista 6 meses",
      "Menos açúcar",
      "Não fumar"
    ],
    "roteiro": "<strong>Início:</strong> Saúde bucal e coração. <strong>Meio:</strong> Técnica de escovação. <strong>Final:</strong> CEO do SUS."
  },
  {
    "num": 18,
    "nome": "Insônia",
    "badge": "Qualidade de Vida",
    "icon": "😴",
    "c1": "#080820",
    "c2": "#14145e",
    "desc": "73% dos brasileiros com problemas de sono — R$ 14 bi de prejuízo/ano.",
    "intro": "A insônia crônica compromete imunidade, aumenta risco cardiovascular e é gatilho da depressão.",
    "stats": [
      {
        "v": "73%",
        "l": "Prob. de sono"
      },
      {
        "v": "R$14bi",
        "l": "Prejuízo/ano"
      },
      {
        "v": "7-9h",
        "l": "Sono ideal"
      }
    ],
    "riscos": [
      "Depressão",
      "Obesidade",
      "Doenças cardíacas",
      "Acidentes",
      "Cognitivo comprometido"
    ],
    "prev": [
      "Horário fixo",
      "Sem telas 1h antes",
      "Quarto escuro",
      "Sem cafeína",
      "Relaxamento"
    ],
    "roteiro": "<strong>Início:</strong> Acorda cansado? <strong>Meio:</strong> Fases do sono. <strong>Final:</strong> 5 regras de ouro."
  },
  {
    "num": 19,
    "nome": "Desidratação",
    "badge": "Hidratação",
    "icon": "💧",
    "c1": "#001e40",
    "c2": "#004d99",
    "desc": "60-70% das pessoas vivem em desidratação leve crônica sem saber.",
    "intro": "A desidratação leve já compromete concentração, humor, rins e circulação.",
    "stats": [
      {
        "v": "60-70%",
        "l": "Desidratados"
      },
      {
        "v": "2-3L",
        "l": "Recomendados/dia"
      },
      {
        "v": "2%",
        "l": "Prejudica cognição"
      }
    ],
    "riscos": [
      "Cálculo renal",
      "Infecção urinária",
      "Queda de pressão",
      "Cefaleia",
      "UTI (grave)"
    ],
    "prev": [
      "Beber ao acordar",
      "Garrafa sempre",
      "Frutas",
      "Monitorar urina",
      "Mais no calor"
    ],
    "roteiro": "<strong>Início:</strong> Teste da cor da urina. <strong>Meio:</strong> Sede = já desidratado. <strong>Final:</strong> Hábitos para beber mais água."
  },
  {
    "num": 20,
    "nome": "COVID-19 e Respiratórias",
    "badge": "Infectologia",
    "icon": "🫁",
    "c1": "#180028",
    "c2": "#3d006e",
    "desc": "3ª maior causa de morte no Brasil — 700 mil mortes por COVID.",
    "intro": "A COVID-19 matou mais de 700 mil brasileiros. Gripe, pneumonia, asma e DPOC afetam milhões.",
    "stats": [
      {
        "v": "700 mil",
        "l": "Mortes COVID"
      },
      {
        "v": "3ª",
        "l": "Causa de morte"
      },
      {
        "v": "10 mi",
        "l": "Com asma"
      }
    ],
    "riscos": [
      "Pneumonia",
      "Pós-COVID",
      "DPOC",
      "Asma mal controlada",
      "Sepse"
    ],
    "prev": [
      "Vacina gripe",
      "Vacina COVID",
      "Máscara",
      "Ventilação",
      "Não fumar"
    ],
    "roteiro": "<strong>Início:</strong> COVID vs. outras respiratórias. <strong>Meio:</strong> Grupos de risco. <strong>Final:</strong> Sintomas de alerta e vacinação."
  }
];

const QUESTIONS = [
  {
    "id": 1,
    "themeNum": 1,
    "type": "mc",
    "question": "Qual percentual de adultos brasileiros sofre de hipertensão arterial?",
    "options": [
      "15%",
      "22%",
      "36%",
      "51%"
    ],
    "correct": 2,
    "explanation": "Cerca de 36% dos adultos brasileiros têm hipertensão, tornando-a uma das condições crônicas mais prevalentes no país."
  },
  {
    "id": 2,
    "themeNum": 1,
    "type": "tf",
    "question": "A hipertensão arterial costuma ser chamada de 'assassina silenciosa' porque na maioria dos casos não apresenta sintomas.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A hipertensão raramente causa sintomas perceptíveis, por isso metade dos hipertensos não sabe que tem a doença."
  },
  {
    "id": 3,
    "themeNum": 1,
    "type": "mc",
    "question": "Qual das alternativas NÃO é uma complicação direta da hipertensão não tratada?",
    "options": [
      "AVC (derrame)",
      "Insuficiência renal",
      "Catarata",
      "Infarto do miocárdio"
    ],
    "correct": 2,
    "explanation": "A catarata não é uma complicação direta da hipertensão. AVC, infarto e insuficiência renal são complicações clássicas."
  },
  {
    "id": 4,
    "themeNum": 2,
    "type": "mc",
    "question": "Quantos brasileiros vivem com diabetes segundo estimativas recentes?",
    "options": [
      "5 milhões",
      "10 milhões",
      "16 milhões",
      "25 milhões"
    ],
    "correct": 2,
    "explanation": "O Brasil tem aproximadamente 16 milhões de diabéticos, sendo o 3º país com mais casos no mundo."
  },
  {
    "id": 5,
    "themeNum": 2,
    "type": "tf",
    "question": "O diabetes tipo 2 representa cerca de 90% de todos os casos de diabetes.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. O tipo 2, relacionado ao estilo de vida, representa aproximadamente 90% dos diagnósticos de diabetes."
  },
  {
    "id": 6,
    "themeNum": 2,
    "type": "mc",
    "question": "Qual das opções é uma complicação grave do diabetes não controlado?",
    "options": [
      "Hipertrofia muscular",
      "Amputação de membros",
      "Ganho de massa óssea",
      "Melhora da visão"
    ],
    "correct": 1,
    "explanation": "A amputação de membros inferiores é uma das complicações mais graves do diabetes não tratado, causada pela neuropatia e má circulação."
  },
  {
    "id": 7,
    "themeNum": 3,
    "type": "mc",
    "question": "A automedicação é a primeira causa de qual tipo de incidente no Brasil?",
    "options": [
      "Acidentes de trânsito",
      "Intoxicação",
      "Infecção hospitalar",
      "Queda"
    ],
    "correct": 1,
    "explanation": "A automedicação é a principal causa de intoxicação no Brasil, levando a mais de 3.200 mortes por ano."
  },
  {
    "id": 8,
    "themeNum": 3,
    "type": "tf",
    "question": "O uso indiscriminado de antibióticos pode gerar resistência bacteriana, dificultando tratamentos futuros.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A resistência aos antibióticos é uma das maiores ameaças à saúde pública, causada em grande parte pelo uso inadequado."
  },
  {
    "id": 9,
    "themeNum": 3,
    "type": "mc",
    "question": "Qual é o percentual de brasileiros que praticam automedicação regularmente?",
    "options": [
      "10%",
      "20%",
      "35%",
      "60%"
    ],
    "correct": 2,
    "explanation": "Aproximadamente 35% dos brasileiros se automedicam, muitas vezes sem orientação médica ou farmacêutica."
  },
  {
    "id": 10,
    "themeNum": 4,
    "type": "mc",
    "question": "Qual país lidera o ranking mundial de transtornos de ansiedade?",
    "options": [
      "EUA",
      "China",
      "Brasil",
      "Índia"
    ],
    "correct": 2,
    "explanation": "O Brasil é o país mais ansioso do mundo, com 9,3% da população afetada por transtornos ansiosos."
  },
  {
    "id": 11,
    "themeNum": 4,
    "type": "tf",
    "question": "A ansiedade crônica pode comprometer o sistema imunológico e aumentar o risco de doenças cardiovasculares.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A ansiedade crônica eleva cortisol e adrenalina cronicamente, prejudicando imunidade e saúde cardiovascular."
  },
  {
    "id": 12,
    "themeNum": 4,
    "type": "mc",
    "question": "Quantas pessoas no mundo são afetadas por transtornos de ansiedade?",
    "options": [
      "64 milhões",
      "130 milhões",
      "264 milhões",
      "400 milhões"
    ],
    "correct": 2,
    "explanation": "Segundo a OMS, cerca de 264 milhões de pessoas no mundo sofrem de transtornos ansiosos."
  },
  {
    "id": 13,
    "themeNum": 5,
    "type": "mc",
    "question": "Quantos brasileiros sofrem de depressão segundo estimativas da OMS?",
    "options": [
      "3 milhões",
      "7 milhões",
      "12 milhões",
      "20 milhões"
    ],
    "correct": 2,
    "explanation": "Aproximadamente 12 milhões de brasileiros vivem com depressão, a principal causa de incapacidade no mundo."
  },
  {
    "id": 14,
    "themeNum": 5,
    "type": "tf",
    "question": "Cerca de 70% dos pacientes com depressão melhoram significativamente com o tratamento adequado.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. Com tratamento combinando psicoterapia e/ou medicação, a maioria dos pacientes apresenta melhora."
  },
  {
    "id": 15,
    "themeNum": 5,
    "type": "mc",
    "question": "Qual canal de apoio em crise está disponível 24h pelo número 188 no Brasil?",
    "options": [
      "SAMU",
      "CVV – Centro de Valorização da Vida",
      "CAPS",
      "INSS"
    ],
    "correct": 1,
    "explanation": "O CVV (Centro de Valorização da Vida) oferece apoio emocional gratuito 24h pelo número 188."
  },
  {
    "id": 16,
    "themeNum": 6,
    "type": "mc",
    "question": "Qual é a recomendação mínima de atividade física por semana para adultos segundo a OMS?",
    "options": [
      "60 minutos",
      "90 minutos",
      "150 minutos",
      "300 minutos"
    ],
    "correct": 2,
    "explanation": "A OMS recomenda pelo menos 150 minutos de atividade física moderada por semana para adultos."
  },
  {
    "id": 17,
    "themeNum": 6,
    "type": "tf",
    "question": "O sedentarismo é a 4ª maior causa de morte no mundo.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A inatividade física figura como a 4ª maior causa de morte globalmente segundo a OMS."
  },
  {
    "id": 18,
    "themeNum": 6,
    "type": "mc",
    "question": "Qual o percentual de adultos brasileiros classificados como sedentários?",
    "options": [
      "20%",
      "33%",
      "47%",
      "60%"
    ],
    "correct": 2,
    "explanation": "Cerca de 47% dos adultos brasileiros não atingem as recomendações mínimas de atividade física."
  },
  {
    "id": 19,
    "themeNum": 7,
    "type": "mc",
    "question": "Qual percentual da população brasileira está acima do peso ideal?",
    "options": [
      "35%",
      "45%",
      "57%",
      "70%"
    ],
    "correct": 2,
    "explanation": "57% dos brasileiros estão com sobrepeso, representando um custo de R$ 2,1 bilhões por ano ao SUS."
  },
  {
    "id": 20,
    "themeNum": 7,
    "type": "tf",
    "question": "A obesidade está associada ao aumento do risco de mais de 200 condições médicas diferentes.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A obesidade aumenta risco de diabetes, hipertensão, câncer, apneia do sono e muitas outras condições."
  },
  {
    "id": 21,
    "themeNum": 7,
    "type": "mc",
    "question": "Qual percentual da população brasileira apresenta obesidade (não apenas sobrepeso)?",
    "options": [
      "10%",
      "15%",
      "22%",
      "30%"
    ],
    "correct": 2,
    "explanation": "Aproximadamente 22% dos brasileiros têm obesidade (IMC ≥ 30), além dos que estão com sobrepeso."
  },
  {
    "id": 22,
    "themeNum": 8,
    "type": "mc",
    "question": "Quantos casos de dengue o Brasil registrou em 2024, o pior surto de sua história?",
    "options": [
      "1,2 milhão",
      "3,5 milhões",
      "6,9 milhões",
      "10 milhões"
    ],
    "correct": 2,
    "explanation": "Em 2024 o Brasil registrou 6,9 milhões de casos de dengue, com mais de 5.400 mortes, o pior surto da história."
  },
  {
    "id": 23,
    "themeNum": 8,
    "type": "tf",
    "question": "O vírus da dengue possui 4 sorotipos diferentes, e a reinfecção por um sorotipo diferente pode causar dengue grave.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A segunda infecção por um sorotipo diferente pode levar à dengue hemorrágica ou choque, com risco de morte."
  },
  {
    "id": 24,
    "themeNum": 8,
    "type": "mc",
    "question": "Qual vacina contra dengue foi incluída no calendário vacinal brasileiro?",
    "options": [
      "Dengvaxia",
      "Qdenga",
      "DengueVax",
      "TDR-VAC"
    ],
    "correct": 1,
    "explanation": "A vacina Qdenga (TAK-003) foi aprovada e incorporada ao SUS, indicada para crianças e adolescentes de 6 a 16 anos."
  },
  {
    "id": 25,
    "themeNum": 9,
    "type": "mc",
    "question": "Qual é a meta de cobertura vacinal ideal para garantir imunidade de rebanho?",
    "options": [
      "70%",
      "80%",
      "95%",
      "100%"
    ],
    "correct": 2,
    "explanation": "A meta de cobertura vacinal é de 95% para garantir a imunidade coletiva e impedir a circulação de doenças."
  },
  {
    "id": 26,
    "themeNum": 9,
    "type": "tf",
    "question": "O sarampo voltou a circular no Brasil em 2019 após queda na cobertura vacinal.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. O Brasil perdeu o certificado de eliminação do sarampo após surtos relacionados à queda na vacinação."
  },
  {
    "id": 27,
    "themeNum": 9,
    "type": "mc",
    "question": "Quantas vacinas compõem o calendário nacional de vacinação brasileiro?",
    "options": [
      "8",
      "12",
      "20",
      "30"
    ],
    "correct": 2,
    "explanation": "O calendário vacinal do Ministério da Saúde inclui 20 vacinas oferecidas gratuitamente no SUS em todas as fases da vida."
  },
  {
    "id": 28,
    "themeNum": 10,
    "type": "mc",
    "question": "Quantas mortes por câncer do colo do útero ocorrem no Brasil anualmente?",
    "options": [
      "1.200",
      "3.500",
      "6.400",
      "12.000"
    ],
    "correct": 2,
    "explanation": "O câncer do colo do útero mata cerca de 6.400 mulheres por ano no Brasil, sendo quase totalmente prevenível."
  },
  {
    "id": 29,
    "themeNum": 10,
    "type": "tf",
    "question": "O Papanicolau e a vacina contra o HPV são estratégias eficazes para prevenir o câncer do colo do útero.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. O rastreamento com Papanicolau e a vacinação contra HPV são as principais ferramentas de prevenção."
  },
  {
    "id": 30,
    "themeNum": 10,
    "type": "mc",
    "question": "Com que frequência a mulher deve realizar o exame Papanicolau preventivo?",
    "options": [
      "A cada 6 meses",
      "A cada 1 ano até os 30 anos, depois a cada 3 anos",
      "A cada 5 anos",
      "Apenas se tiver sintomas"
    ],
    "correct": 1,
    "explanation": "Recomenda-se Papanicolau anual nas primeiras consultas, e após dois exames normais, a cada 3 anos segundo o INCA."
  },
  {
    "id": 31,
    "themeNum": 11,
    "type": "mc",
    "question": "Qual percentual dos partos no Brasil ocorre em adolescentes?",
    "options": [
      "5%",
      "12%",
      "20%",
      "35%"
    ],
    "correct": 2,
    "explanation": "Aproximadamente 20% dos partos no Brasil são de adolescentes, tornando o país o 3º com maior taxa na América Latina."
  },
  {
    "id": 32,
    "themeNum": 11,
    "type": "tf",
    "question": "A gravidez na adolescência está associada ao aumento do risco de pré-eclâmpsia e parto prematuro.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. Adolescentes gestantes têm maior risco de complicações obstétricas como pré-eclâmpsia e prematuridade."
  },
  {
    "id": 33,
    "themeNum": 11,
    "type": "mc",
    "question": "Qual percentual das gestações na adolescência no Brasil ocorre em famílias de baixa renda?",
    "options": [
      "30%",
      "50%",
      "66%",
      "85%"
    ],
    "correct": 2,
    "explanation": "Cerca de 66% das gestações adolescentes no Brasil acontecem em famílias de baixa renda, reforçando a desigualdade social."
  },
  {
    "id": 34,
    "themeNum": 12,
    "type": "mc",
    "question": "Em quanto aumentaram os casos de sífilis no Brasil nos últimos 10 anos?",
    "options": [
      "300%",
      "800%",
      "1.500%",
      "3.000%"
    ],
    "correct": 3,
    "explanation": "Os casos de sífilis cresceram 3.000% em 10 anos no Brasil, configurando uma crise de saúde pública."
  },
  {
    "id": 35,
    "themeNum": 12,
    "type": "tf",
    "question": "A PrEP (profilaxia pré-exposição ao HIV) é disponibilizada gratuitamente pelo SUS.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. O SUS oferece PrEP gratuitamente para pessoas em situação de vulnerabilidade ao HIV."
  },
  {
    "id": 36,
    "themeNum": 12,
    "type": "mc",
    "question": "Quantas novas infecções por HIV ocorrem no Brasil a cada ano?",
    "options": [
      "5.000",
      "15.000",
      "40.000",
      "80.000"
    ],
    "correct": 2,
    "explanation": "Aproximadamente 40.000 novas infecções por HIV são registradas anualmente no Brasil."
  },
  {
    "id": 37,
    "themeNum": 13,
    "type": "mc",
    "question": "O álcool está presente em qual percentual dos acidentes de trânsito fatais no Brasil?",
    "options": [
      "20%",
      "35%",
      "50%",
      "70%"
    ],
    "correct": 2,
    "explanation": "O álcool está associado a aproximadamente 50% dos acidentes de trânsito fatais no Brasil."
  },
  {
    "id": 38,
    "themeNum": 13,
    "type": "tf",
    "question": "A dependência química ao álcool é considerada uma doença e deve ser tratada como tal.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A OMS e o CID reconhecem a dependência química como doença, que exige tratamento médico e psicossocial."
  },
  {
    "id": 39,
    "themeNum": 13,
    "type": "mc",
    "question": "O álcool é considerada a ______ causa de morte evitável no Brasil.",
    "options": [
      "1ª",
      "2ª",
      "3ª",
      "5ª"
    ],
    "correct": 2,
    "explanation": "O álcool é a 3ª causa de morte evitável no Brasil, estando ligado a cirrose, acidentes e violência."
  },
  {
    "id": 40,
    "themeNum": 14,
    "type": "mc",
    "question": "A lavagem correta das mãos pode reduzir em quanto as infecções respiratórias?",
    "options": [
      "10%",
      "25%",
      "40%",
      "60%"
    ],
    "correct": 2,
    "explanation": "A lavagem adequada das mãos pode reduzir em até 40% as infecções respiratórias e em 50% as diarreias."
  },
  {
    "id": 41,
    "themeNum": 14,
    "type": "tf",
    "question": "A lavagem das mãos é considerada a medida de saúde pública mais custo-efetiva do mundo.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. O impacto da higiene das mãos na redução de doenças infecciosas a torna uma das intervenções mais custo-efetivas."
  },
  {
    "id": 42,
    "themeNum": 14,
    "type": "mc",
    "question": "Quantas etapas tem a técnica correta de lavagem das mãos recomendada pela OMS?",
    "options": [
      "3 passos",
      "5 passos",
      "7 passos",
      "10 passos"
    ],
    "correct": 2,
    "explanation": "A técnica de lavagem das mãos da OMS compreende 7 passos para garantir limpeza completa de todas as superfícies."
  },
  {
    "id": 43,
    "themeNum": 15,
    "type": "mc",
    "question": "Qual a frequência de quedas em idosos no Brasil?",
    "options": [
      "1 em 10 por ano",
      "1 em 3 por ano",
      "1 em 2 por ano",
      "2 em 3 por ano"
    ],
    "correct": 1,
    "explanation": "Estatisticamente, 1 em cada 3 idosos sofre pelo menos uma queda por ano, sendo a principal causa de morte acidental nessa faixa etária."
  },
  {
    "id": 44,
    "themeNum": 15,
    "type": "tf",
    "question": "O uso de múltiplos medicamentos (polifarmácia) em idosos aumenta o risco de quedas e outros efeitos adversos.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A polifarmácia pode causar tontura, hipotensão postural e interações medicamentosas, aumentando o risco de quedas."
  },
  {
    "id": 45,
    "themeNum": 15,
    "type": "mc",
    "question": "Qual adaptação simples em casa é mais eficaz para prevenir quedas em idosos?",
    "options": [
      "Comprar móveis novos",
      "Instalar barras de apoio no banheiro",
      "Aumentar a iluminação",
      "Remover todos os tapetes e instalar barras de apoio"
    ],
    "correct": 3,
    "explanation": "A combinação de remover tapetes escorregadios e instalar barras de apoio no banheiro são as adaptações mais eficazes."
  },
  {
    "id": 46,
    "themeNum": 16,
    "type": "mc",
    "question": "Qual é o período considerado 'os primeiros 1.000 dias' na alimentação infantil?",
    "options": [
      "Do nascimento até os 2 anos",
      "Da concepção até os 2 anos",
      "Do nascimento até os 3 anos",
      "Da concepção até os 3 anos"
    ],
    "correct": 1,
    "explanation": "Os 1.000 dias contam da concepção (gestação) até os 2 anos da criança, período mais crítico para o desenvolvimento."
  },
  {
    "id": 47,
    "themeNum": 16,
    "type": "tf",
    "question": "O Ministério da Saúde recomenda aleitamento materno exclusivo nos primeiros 6 meses de vida.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. O leite materno exclusivo por 6 meses fornece todos os nutrientes e proteção imunológica necessários."
  },
  {
    "id": 48,
    "themeNum": 16,
    "type": "mc",
    "question": "Qual percentual de crianças menores de 2 anos no Brasil já consome alimentos ultraprocessados?",
    "options": [
      "15%",
      "30%",
      "45%",
      "60%"
    ],
    "correct": 2,
    "explanation": "Cerca de 45% das crianças menores de 2 anos consomem ultraprocessados, contribuindo para obesidade infantil."
  },
  {
    "id": 49,
    "themeNum": 17,
    "type": "mc",
    "question": "Qual percentual de adultos brasileiros já tiveram cárie dentária?",
    "options": [
      "60%",
      "75%",
      "90%",
      "99%"
    ],
    "correct": 2,
    "explanation": "Cerca de 90% dos adultos brasileiros já tiveram alguma experiência com cárie, a doença mais prevalente do mundo."
  },
  {
    "id": 50,
    "themeNum": 17,
    "type": "tf",
    "question": "Doenças periodontais (na gengiva) podem estar associadas a doenças cardiovasculares e diabetes.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. Inflamações bucais crônicas liberam mediadores inflamatórios que afetam o coração e dificultam o controle glicêmico."
  },
  {
    "id": 51,
    "themeNum": 17,
    "type": "mc",
    "question": "Com que frequência o dentista deve ser consultado para manutenção da saúde bucal?",
    "options": [
      "A cada 3 meses",
      "A cada 6 meses",
      "Apenas quando sentir dor",
      "Uma vez por ano"
    ],
    "correct": 1,
    "explanation": "A consulta ao dentista a cada 6 meses permite detectar cáries e doenças periodontais precocemente."
  },
  {
    "id": 52,
    "themeNum": 18,
    "type": "mc",
    "question": "Qual percentual de brasileiros tem problemas de sono?",
    "options": [
      "30%",
      "52%",
      "73%",
      "88%"
    ],
    "correct": 2,
    "explanation": "73% dos brasileiros relatam problemas de sono, gerando um prejuízo estimado de R$ 14 bilhões ao ano."
  },
  {
    "id": 53,
    "themeNum": 18,
    "type": "tf",
    "question": "A insônia crônica é um fator de risco para depressão, obesidade e doenças cardiovasculares.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. A privação de sono altera hormônios como leptina e grelina, aumenta inflamação e eleva risco cardiovascular."
  },
  {
    "id": 54,
    "themeNum": 18,
    "type": "mc",
    "question": "Qual é a quantidade ideal de horas de sono por noite para um adulto saudável?",
    "options": [
      "5–6 horas",
      "6–7 horas",
      "7–9 horas",
      "9–11 horas"
    ],
    "correct": 2,
    "explanation": "A National Sleep Foundation recomenda entre 7 e 9 horas de sono por noite para adultos saudáveis."
  },
  {
    "id": 55,
    "themeNum": 19,
    "type": "mc",
    "question": "A partir de qual nível de desidratação já ocorre prejuízo na função cognitiva?",
    "options": [
      "0,5%",
      "1%",
      "2%",
      "5%"
    ],
    "correct": 2,
    "explanation": "Uma perda de apenas 2% do peso corporal em água já é suficiente para comprometer concentração, memória e humor."
  },
  {
    "id": 56,
    "themeNum": 19,
    "type": "tf",
    "question": "Sentir sede é um sinal precoce e confiável de hidratação adequada do organismo.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 1,
    "explanation": "Falso. A sede aparece quando o corpo já está em nível leve de desidratação, portanto não deve ser o único guia."
  },
  {
    "id": 57,
    "themeNum": 19,
    "type": "mc",
    "question": "Qual é a quantidade diária de água recomendada para adultos saudáveis?",
    "options": [
      "0,5–1 litro",
      "1–1,5 litro",
      "2–3 litros",
      "4–5 litros"
    ],
    "correct": 2,
    "explanation": "A recomendação geral é de 2 a 3 litros de água por dia, podendo variar com o clima, atividade física e peso."
  },
  {
    "id": 58,
    "themeNum": 20,
    "type": "mc",
    "question": "Quantas mortes por COVID-19 foram registradas no Brasil desde o início da pandemia?",
    "options": [
      "100 mil",
      "350 mil",
      "700 mil",
      "1,2 milhão"
    ],
    "correct": 2,
    "explanation": "O Brasil registrou mais de 700 mil mortes por COVID-19, sendo o 2º país com maior número de óbitos no mundo."
  },
  {
    "id": 59,
    "themeNum": 20,
    "type": "tf",
    "question": "A COVID-19 é atualmente a 3ª maior causa de morte no Brasil.",
    "options": [
      "Verdadeiro",
      "Falso"
    ],
    "correct": 0,
    "explanation": "Verdadeiro. Mesmo após o pico pandêmico, o COVID-19 continua figurando entre as principais causas de morte no país."
  },
  {
    "id": 60,
    "themeNum": 20,
    "type": "mc",
    "question": "Quantos brasileiros vivem com asma, segundo estimativas?",
    "options": [
      "2 milhões",
      "5 milhões",
      "10 milhões",
      "18 milhões"
    ],
    "correct": 2,
    "explanation": "Aproximadamente 10 milhões de brasileiros têm asma, tornando-a uma das doenças respiratórias crônicas mais prevalentes."
  }
];

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

window.AppData = { THEMES, QUESTIONS, ESTADOS };
