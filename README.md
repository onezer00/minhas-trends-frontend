# TrendPulse Frontend

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/MUI-5.15.0-007FFF.svg?style=flat&logo=mui&logoColor=white)](https://mui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Interface web moderna e responsiva para o TrendPulse, um agregador de tendências que reúne conteúdo popular do YouTube e Reddit em um só lugar.

## 🚀 Recursos

- **Design Responsivo:** Interface adaptável para desktop e dispositivos móveis
- **Temas Claro/Escuro:** Suporte a diferentes temas para melhor experiência visual
- **Filtragem Avançada:** Filtros por plataforma, categoria e período
- **Visualização em Tempo Real:** Atualização automática das tendências
- **Compartilhamento:** Botões para compartilhar tendências nas redes sociais
- **Pesquisa Instantânea:** Busca rápida por palavras-chave
- **Categorização Visual:** Ícones e cores para diferentes categorias de conteúdo

## 🛠️ Tecnologias

- **React 18:** Para construção da interface
- **TypeScript:** Tipagem estática para maior segurança
- **Material-UI (MUI):** Componentes de UI modernos
- **React Query:** Gerenciamento de estado e cache
- **React Router:** Navegação entre páginas
- **Axios:** Requisições HTTP
- **date-fns:** Formatação de datas
- **React Icons:** Biblioteca de ícones

## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/trendpulse-frontend.git
   cd trendpulse-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   # .env.development
   REACT_APP_API_URL=http://localhost:8000
   
   # .env.production
   REACT_APP_API_URL=https://trendpulse-api.onrender.com
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

## 🚀 Deploy

O frontend está configurado para deploy automático no GitHub Pages:

1. Atualize a propriedade `homepage` no `package.json`:
   ```json
   {
     "homepage": "https://seu-usuario.github.io/trendpulse-frontend"
   }
   ```

2. Execute o deploy:
   ```bash
   npm run deploy
   ```

## 🎨 Personalização

### Temas

O TrendPulse suporta temas claro e escuro. Para personalizar:

1. Edite os arquivos de tema em `src/theme/`:
   ```typescript
   // theme/light.ts ou theme/dark.ts
   export const lightTheme = {
     // Suas customizações aqui
   };
   ```

2. Use o hook de tema:
   ```typescript
   const { theme, toggleTheme } = useTheme();
   ```

### Estilos

- Componentes estilizados usando MUI `styled`:
  ```typescript
  const StyledCard = styled(Card)(({ theme }) => ({
    // Seus estilos aqui
  }));
  ```

## 📱 Layout Responsivo

O TrendPulse é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- **Desktop:** Layout em grid com 3-4 colunas
- **Tablet:** 2 colunas
- **Mobile:** 1 coluna com cards empilhados

## 🔄 Integração com Backend

A comunicação com a API é feita através do Axios:

```typescript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
```

## 📊 Análise de Código

O projeto utiliza várias ferramentas para garantir qualidade:

- **ESLint:** Análise estática de código
- **Prettier:** Formatação consistente
- **TypeScript:** Verificação de tipos
- **Husky:** Hooks de git para verificações pré-commit

## 🧪 Testes

Execute os testes com:

```bash
# Testes unitários
npm test

# Cobertura de testes
npm run test:coverage
```

## 📚 Documentação de Componentes

A documentação dos componentes é feita usando Storybook:

```bash
# Inicie o Storybook
npm run storybook
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- [Backend do TrendPulse](https://github.com/seu-usuario/trendpulse-backend)
- [Documentação da API](https://trendpulse-api.onrender.com/docs)
- [Material-UI Docs](https://mui.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
