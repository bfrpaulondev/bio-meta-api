# BiôMeta API - Modular Monolith

Uma API RESTful completa para aplicativo de fitness desenvolvida com **Fastify**, **TypeScript**, **MongoDB** e **arquitetura Modular Monolith**.

## 🚀 Funcionalidades

### 🏋️ Treinos e Exercícios
- ✅ CRUD completo de treinos personalizados
- ✅ Biblioteca de exercícios com instruções detalhadas
- ✅ Logs de treino com métricas de performance
- ✅ Templates de treino públicos e privados
- ✅ Estatísticas e análises de progresso

### 📊 Dashboard Inteligente
- ✅ Dashboard personalizado com widgets configuráveis
- ✅ Estatísticas detalhadas de progresso
- ✅ Insights personalizados com IA
- ✅ Comparações entre períodos
- ✅ Alertas e notificações

### 🛒 Lista de Compras Inteligente
- ✅ Gerenciamento de listas de compras
- ✅ Controle de orçamento mensal
- ✅ Histórico de preços
- ✅ Alertas de gastos
- ✅ Categorização automática

### 📏 Medidas Corporais
- ✅ Registro de medidas corporais
- ✅ Fotos de progresso
- ✅ Metas de medidas
- ✅ Perfil de saúde completo
- ✅ Comparações antes/depois

### 🎯 Metas e Lembretes
- ✅ Sistema de metas SMART
- ✅ Lembretes personalizáveis
- ✅ Conquistas e gamificação
- ✅ Dicas diárias
- ✅ Análise de progresso

### 📱 Galeria e Mídia
- ✅ Upload de fotos e vídeos
- ✅ Comparações antes/depois
- ✅ Álbuns organizados
- ✅ Compartilhamento social
- ✅ Backup automático

### ⏱️ Cronômetros e Timers
- ✅ Timers de treino
- ✅ Cronômetros de descanso
- ✅ Templates de intervalos
- ✅ Histórico de sessões
- ✅ Notificações sonoras

### 🤖 Integração com IA (ChatGPT)
- ✅ Insights personalizados de fitness
- ✅ Recomendações de treino
- ✅ Conselhos nutricionais
- ✅ Mensagens motivacionais
- ✅ Chat livre com assistente IA
- ✅ Análise de progresso automatizada

### ⚙️ Configurações Avançadas
- ✅ Configurações personalizáveis
- ✅ Integrações externas (Google Fit, HealthKit)
- ✅ Backup e sincronização
- ✅ Exportação de dados
- ✅ Múltiplos idiomas

## 🛠️ Tecnologias

- **Backend**: Fastify + TypeScript
- **Banco de Dados**: MongoDB + Mongoose
- **Autenticação**: JWT + Refresh Tokens
- **Validação**: TypeBox + Zod
- **Documentação**: Swagger/OpenAPI 3.0
- **Upload**: Multipart + Sharp
- **Segurança**: Helmet + Rate Limiting
- **IA**: OpenAI ChatGPT
- **Logs**: Pino
- **Testes**: Jest + Supertest

## 📁 Arquitetura

```
src/
├── modules/              # Módulos de negócio
│   ├── auth/            # Autenticação e autorização
│   ├── dashboard/       # Dashboard e estatísticas
│   ├── workouts/        # Treinos e exercícios
│   ├── shopping/        # Lista de compras
│   ├── measurements/    # Medidas corporais
│   ├── gallery/         # Galeria de mídia
│   ├── timer/           # Cronômetros
│   ├── goals/           # Metas e lembretes
│   ├── settings/        # Configurações
│   └── ai/              # Integração com IA
├── shared/              # Código compartilhado
│   ├── middleware/      # Middlewares
│   ├── utils/           # Utilitários
│   ├── types/           # Tipos TypeScript
│   ├── schemas/         # Esquemas de validação
│   ├── services/        # Serviços externos
│   ├── plugins/         # Plugins Fastify
│   └── database/        # Conexão com banco
├── config/              # Configurações
└── server.ts            # Servidor principal
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- MongoDB 5+
- NPM ou Yarn

### 1. Clone o repositório

```bash
git clone https://github.com/bfrpaulondev/bio-meta-api.git
cd bio-meta-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fitness-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

### 4. Inicie o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Documentação da API

Após iniciar o servidor, acesse:

- **Swagger UI**: http://localhost:3000/docs
- **OpenAPI JSON**: http://localhost:3000/docs/openapi.json
- **OpenAPI YAML**: http://localhost:3000/docs/openapi.yaml
- **Health Check**: http://localhost:3000/health

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação:

### 1. Registrar usuário
```bash
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "123456",
  "confirmPassword": "123456",
  "acceptTerms": true
}
```

### 2. Fazer login
```bash
POST /api/auth/login
{
  "email": "joao@example.com",
  "password": "123456"
}
```

### 3. Usar o token
```bash
Authorization: Bearer <seu-jwt-token>
```

## 🤖 Integração com ChatGPT

A API inclui integração completa com ChatGPT para funcionalidades de IA:

### Endpoints disponíveis:

- `POST /api/ai/insights` - Insights personalizados
- `POST /api/ai/workout-recommendation` - Recomendações de treino
- `POST /api/ai/nutrition-advice` - Conselhos nutricionais
- `POST /api/ai/motivational-message` - Mensagens motivacionais
- `GET /api/ai/daily-tip` - Dica diária
- `POST /api/ai/analyze-progress` - Análise de progresso
- `POST /api/ai/chat` - Chat livre com IA
- `GET /api/ai/status` - Status da integração

### Exemplo de uso:

```bash
POST /api/ai/insights
{
  "userProfile": {
    "age": 30,
    "gender": "male",
    "weight": 80,
    "height": 175,
    "activityLevel": "moderately_active",
    "fitnessGoals": ["weight_loss", "muscle_gain"]
  },
  "recentData": {
    "workouts": [...],
    "measurements": [...],
    "goals": [...]
  },
  "question": "Como posso melhorar meu desempenho nos treinos?"
}
```

## 📊 Principais Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard` - Dados do dashboard
- `GET /api/dashboard/stats` - Estatísticas
- `GET /api/dashboard/insights` - Insights com IA

### Treinos
- `GET /api/workouts` - Listar treinos
- `POST /api/workouts` - Criar treino
- `GET /api/workouts/:id` - Obter treino
- `PUT /api/workouts/:id` - Atualizar treino
- `DELETE /api/workouts/:id` - Deletar treino
- `POST /api/workouts/:id/start` - Iniciar sessão

### Lista de Compras
- `GET /api/shopping/items` - Listar itens
- `POST /api/shopping/items` - Criar item
- `GET /api/shopping/budget` - Orçamento
- `GET /api/shopping/stats` - Estatísticas

### Medidas Corporais
- `GET /api/measurements` - Listar medidas
- `POST /api/measurements` - Criar medida
- `GET /api/measurements/progress/:type` - Progresso
- `GET /api/measurements/goals` - Metas de medidas

### Galeria
- `GET /api/gallery/media` - Listar mídia
- `POST /api/gallery/media` - Upload
- `GET /api/gallery/albums` - Álbuns
- `GET /api/gallery/comparisons` - Comparações

### Cronômetro
- `GET /api/timer/sessions` - Sessões
- `POST /api/timer/sessions` - Criar sessão
- `POST /api/timer/sessions/:id/start` - Iniciar
- `POST /api/timer/sessions/:id/pause` - Pausar

### Metas
- `GET /api/goals` - Listar metas
- `POST /api/goals` - Criar meta
- `GET /api/goals/reminders` - Lembretes
- `GET /api/goals/achievements` - Conquistas

### Configurações
- `GET /api/settings` - Configurações
- `PUT /api/settings` - Atualizar
- `GET /api/settings/export` - Exportar dados
- `POST /api/settings/import` - Importar dados

## 🔒 Segurança

- **Rate Limiting**: 100 requisições por minuto
- **CORS**: Configurado para desenvolvimento
- **Helmet**: Headers de segurança
- **JWT**: Tokens seguros com expiração
- **Validação**: Entrada validada com TypeBox/Zod
- **Sanitização**: Dados sanitizados antes do armazenamento

## 📈 Performance

- **Fastify**: Framework ultra-rápido
- **MongoDB**: Banco NoSQL otimizado
- **Pino**: Logging performático
- **Caching**: Redis para cache (opcional)
- **Compressão**: Gzip habilitado

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## 📦 Deploy

### Docker

```bash
# Build da imagem
docker build -t fitness-api .

# Executar container
docker run -p 3000:3000 fitness-api
```

### Docker Compose

```bash
docker-compose up -d
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Paulo Neto**
- GitHub: [@bfrpaulondev](https://github.com/bfrpaulondev)
- Email: paulo@example.com

## 🙏 Agradecimentos

- [Fastify](https://www.fastify.io/) - Framework web rápido
- [MongoDB](https://www.mongodb.com/) - Banco de dados NoSQL
- [OpenAI](https://openai.com/) - API de IA
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!

