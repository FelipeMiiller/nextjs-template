# Next.js 15 Template

Este template oferece uma base robusta para desenvolvimento com Next.js 15, incluindo integração com React Query 5, VLibras, e uma estrutura de testes completa.

## 🚀 Tecnologias Principais

- **Next.js 15.3.2** - Framework React com foco em performance e SEO
- **React 19** - Biblioteca JavaScript para UI
- **React Query 5** - Gerenciamento de estado assincronos, com persistência via IndexedDB
- **VLibras** - Plugin de acessibilidade para libras
- **Tailwind CSS** - Framework de estilização
- **Axios** - Cliente HTTP
- **Zustand** - Gerenciamento de estados manipulaveis
- **Jest e React Testing Library** - Frameworks de testes
- **TypeScript** - Tipagem estática
- **ESLint** - Linter para código JavaScript/TypeScript

## ✨ Funcionalidades

### 🔐 Autenticação
- Sistema de autenticação completo 
- Páginas de login e cadastro responsivas
- Suporte a autenticação via Google
- Proteção de rotas autenticadas
- Gerenciamento de sessão seguro
- Validação de formulários em tempo real
- Feedback visual para erros de validação
- Estados de carregamento durante as requisições
- Tratamento de erros detalhado
- Redirecionamento inteligente pós-autenticação

### 🌐 Internacionalização (i18n)
- Suporte a múltiplos idiomas (inglês e português)
- Sistema de dicionários centralizado
- Roteamento com suporte a idiomas
- Troca de idioma dinâmica

## 📁 Estrutura de Pastas

```
src/
├── app/                      # Páginas e rotas do Next.js
│   └── [lang]/               # Rotas com suporte a múltiplos idiomas
│       ├── auth/             # Páginas de autenticação
│       │   ├── sign-in/      # Página de login
│       │   └── sign-up/      # Página de cadastro
│       └── ...
├── components/               # Componentes reutilizáveis
│ 
├── config/                  # Configurações do projeto
│   ├── env.ts              # Variáveis de ambiente
│   ├── hrefs.ts            # URLs do projeto
│   └── routes.ts           # Configurações de rotas
├── lib/                     # Bibliotecas e utilitários
│   ├── constants/          # Constantes do projeto
│   └── utils/              # Funções utilitárias
├── services/                # Serviços e integrações
│   ├── fetch/              # Serviços de requisição HTTP
│   ├── i18n/               # Configuração de internacionalização
│   ├── reactQuery/         # Configuração do React Query
│   └── requests/           # Configuração de requisições
└── types/                  # Tipos TypeScript
```

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ e Yarn



### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/felipemiiller/nextjs-template.git
   cd nextjs-template
   ```

2. Instale as dependências:
   ```bash
   yarn install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```

4. Gere uma chave de criptografia segura para sessões:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

5. Adicione a chave gerada ao arquivo `.env.local`:
   ```env
   ENCRYPTION_KEY=sua_chave_gerada_aqui
   ```
   
   > **Importante**: A chave deve ter exatamente 32 bytes (256 bits) quando decodificada. O comando acima gera uma chave segura no formato base64url apropriado.

6. Preencha as demais variáveis de ambiente no arquivo `.env.local`

## 🛠️ Scripts Disponíveis

```bash
# Iniciar o servidor de desenvolvimento
yarn dev

# Construir para produção
yarn build

# Iniciar em modo produção
yarn start

# Limpar cache e formatar código
yarn clean

# Formatar código
yarn format

# Executar lint
yarn lint

# Executar testes
yarn test

# Executar testes em modo watch
yarn test:watch

```

## 🚨 Notificações de Erro no Slack

Este projeto envia automaticamente mensagens de erro e warning para um canal do Slack, facilitando o monitoramento de problemas em produção.

### Como configurar

1. Gere um Webhook do Slack e copie a URL.
2. Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_CHANNEL=nome-do-canal-ou-#canal
SLACK_USERNAME=Nome do Bot (opcional)
SLACK_ICON_EMOJI=:emoji: (opcional)
```

- As mensagens são automaticamente sanitizadas e truncadas para evitar erros de payload no Slack.
- O envio só ocorre se `SLACK_WEBHOOK_URL` estiver configurado.
- Os níveis de log enviados por padrão são `error` e `warn`.

---

## 📚 Documentação

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do React Query](https://tanstack.com/query/latest/docs)
- [Next-Intl (i18n)](https://next-intl-docs.vercel.app/)
- [Next-Auth](https://next-auth.js.org/)
- [Documentação do VLibras](https://vlibras.gov.br/)

## 🌍 Idiomas Suportados

- Português (Brasil)
- Inglês (Estados Unidos)

## 🤝 Contribuição

1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
