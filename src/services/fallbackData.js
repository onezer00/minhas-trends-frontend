// Dados de fallback para quando a API falhar ou retornar dados em um formato inesperado

export const fallbackCategories = [
  { name: 'tecnologia', count: 157 },
  { name: 'entretenimento', count: 5 },
  { name: 'finanças', count: 3 },
  { name: 'política', count: 10 },
  { name: 'ciência', count: 6 },
  { name: 'outros', count: 93 }
];

export const fallbackTrends = [
  {
    id: 1,
    title: "Inteligência Artificial Revoluciona Diagnósticos Médicos",
    description: "Novos algoritmos de IA estão conseguindo detectar doenças com precisão superior a médicos especialistas.",
    platform: "reddit",
    category: "tecnologia",
    author: "TechInsider",
    views: 15000,
    likes: 2300,
    comments: 450,
    timeAgo: "3 horas",
    tags: ["IA", "medicina", "tecnologia", "saúde"],
    url: "https://reddit.com/r/technology/ai-medical-diagnostics"
  },
  {
    id: 2,
    title: "Novo Framework JavaScript Promete Revolucionar Desenvolvimento Web",
    description: "Desenvolvedores estão migrando rapidamente para esta nova ferramenta que combina o melhor do React e Vue.",
    platform: "twitter",
    category: "tecnologia",
    author: "WebDevTrends",
    views: 8500,
    likes: 1200,
    comments: 320,
    timeAgo: "5 horas",
    tags: ["javascript", "webdev", "programação", "frontend"],
    url: "https://twitter.com/webdevtrends/status/123456789"
  },
  {
    id: 3,
    title: "Cientistas Descobrem Novo Método para Captura de Carbono",
    description: "A técnica pode remover CO2 da atmosfera com 40% mais eficiência que métodos atuais.",
    platform: "youtube",
    category: "ciência",
    author: "ScienceToday",
    views: 25000,
    likes: 4500,
    comments: 780,
    timeAgo: "1 dia",
    tags: ["climatechange", "ciência", "sustentabilidade", "meioambiente"],
    url: "https://youtube.com/watch?v=carbon-capture-new"
  },
  {
    id: 4,
    title: "Nova Série Bate Recordes de Audiência em Streaming",
    description: "Críticos e público estão elogiando a produção que mistura ficção científica e drama histórico.",
    platform: "reddit",
    category: "entretenimento",
    author: "StreamingFan",
    views: 32000,
    likes: 6700,
    comments: 1200,
    timeAgo: "2 dias",
    tags: ["streaming", "séries", "entretenimento", "ficçãocientífica"],
    url: "https://reddit.com/r/television/new-series-breaks-records"
  },
  {
    id: 5,
    title: "Criptomoedas Verdes Ganham Destaque no Mercado",
    description: "Investidores estão migrando para tokens que utilizam protocolos de consenso com baixo impacto ambiental.",
    platform: "twitter",
    category: "finanças",
    author: "CryptoAnalyst",
    views: 18000,
    likes: 3200,
    comments: 560,
    timeAgo: "6 horas",
    tags: ["crypto", "investimentos", "sustentabilidade", "blockchain"],
    url: "https://twitter.com/cryptoanalyst/status/987654321"
  },
  {
    id: 6,
    title: "Novo Estudo Revela Benefícios Surpreendentes da Meditação",
    description: "Pesquisadores descobriram que apenas 10 minutos diários podem reduzir significativamente o estresse e melhorar a cognição.",
    platform: "youtube",
    category: "saúde",
    author: "MindfulLiving",
    views: 12000,
    likes: 2800,
    comments: 430,
    timeAgo: "1 dia",
    tags: ["meditação", "saúdemental", "bemestar", "mindfulness"],
    url: "https://youtube.com/watch?v=meditation-benefits"
  }
]; 