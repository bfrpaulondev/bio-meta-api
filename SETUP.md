# 🚀 Guia de Configuração - Fitness App API

Este guia fornece instruções detalhadas para configurar e executar a API do aplicativo de fitness.

## 📋 Pré-requisitos

### Software Necessário

1. **Node.js** (versão 18 ou superior)
   ```bash
   # Verificar versão
   node --version
   
   # Instalar via nvm (recomendado)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **MongoDB** (versão 5 ou superior)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS
   brew install mongodb-community
   
   # Windows
   # Baixar do site oficial: https://www.mongodb.com/try/download/community
   ```

3. **Git**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install git
   
   # macOS
   brew install git
   
   # Windows
   # Baixar do site oficial: https://git-scm.com/
   ```

### Contas e APIs Necessárias

1. **OpenAI API Key** (obrigatório)
   - Acesse: https://platform.openai.com/api-keys
   - Crie uma conta e gere uma API key
   - Mantenha a chave segura

2. **MongoDB Atlas** (opcional - para produção)
   - Acesse: https://www.mongodb.com/atlas
   - Crie um cluster gratuito
   - Obtenha a string de conexão

## 🔧 Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone https://github.com/bfrpaulondev/bio-meta-api.git
cd bio-meta-api
```

### 2. Instale as Dependências

```bash
# Usando npm
npm install

# Ou usando yarn
yarn install
```

### 3. Configure o Banco de Dados

#### Opção A: MongoDB Local

```bash
# Iniciar MongoDB
sudo systemctl start mongod

# Verificar se está rodando
sudo systemctl status mongod

# Criar banco de dados (opcional)
mongo
> use fitness-app
> db.createCollection("users")
> exit
```

#### Opção B: MongoDB Atlas (Nuvem)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um cluster gratuito
3. Configure acesso de rede (0.0.0.0/0 para desenvolvimento)
4. Crie um usuário de banco de dados
5. Obtenha a string de conexão

### 4. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env
nano .env
```

#### Configurações Obrigatórias

```env
# Database - OBRIGATÓRIO
MONGODB_URI=mongodb://localhost:27017/fitness-app
# OU para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-app

# JWT - OBRIGATÓRIO (gere uma chave segura)
JWT_SECRET=sua-chave-jwt-super-secreta-aqui-mude-em-producao

# OpenAI - OBRIGATÓRIO
OPENAI_API_KEY=sk-sua-chave-openai-aqui
```

#### Configurações Opcionais

```env
# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# OpenAI Avançado
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000

# Redis (para cache)
REDIS_URL=redis://localhost:6379

# Upload de Arquivos
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4

# APIs Externas
EDAMAM_APP_ID=sua-edamam-app-id
EDAMAM_APP_KEY=sua-edamam-app-key
ONESIGNAL_APP_ID=sua-onesignal-app-id
ONESIGNAL_REST_API_KEY=sua-onesignal-rest-api-key

# Cloudinary (para upload de imagens)
CLOUDINARY_CLOUD_NAME=seu-cloudinary-cloud-name
CLOUDINARY_API_KEY=sua-cloudinary-api-key
CLOUDINARY_API_SECRET=sua-cloudinary-api-secret

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### 5. Gere uma Chave JWT Segura

```bash
# Usando Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Ou usando OpenSSL
openssl rand -hex 64
```

## 🚀 Executando a Aplicação

### Desenvolvimento

```bash
# Compilar TypeScript e iniciar em modo watch
npm run dev

# Ou apenas compilar
npm run build

# Iniciar sem watch
npm start
```

### Produção

```bash
# Build para produção
npm run build

# Iniciar em produção
NODE_ENV=production npm start
```

### Usando PM2 (Recomendado para Produção)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
pm2 start dist/server.js --name fitness-api

# Monitorar
pm2 monit

# Logs
pm2 logs fitness-api

# Restart
pm2 restart fitness-api

# Stop
pm2 stop fitness-api
```

## 🧪 Verificação da Instalação

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "name": "fitness-app"
  }
}
```

### 2. Documentação Swagger

Acesse: http://localhost:3000/docs

### 3. Teste de Registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "123456",
    "confirmPassword": "123456",
    "acceptTerms": true
  }'
```

### 4. Teste da IA

```bash
curl http://localhost:3000/api/ai/status \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🐳 Docker (Opcional)

### Usando Docker Compose

```bash
# Criar arquivo docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/fitness-app
      - JWT_SECRET=sua-chave-jwt-aqui
      - OPENAI_API_KEY=sua-chave-openai-aqui
    depends_on:
      - mongo
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
EOF

# Executar
docker-compose up -d
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔧 Configurações Avançadas

### Redis (Cache)

```bash
# Instalar Redis
sudo apt-get install redis-server

# Iniciar Redis
sudo systemctl start redis

# Adicionar ao .env
echo "REDIS_URL=redis://localhost:6379" >> .env
```

### Nginx (Proxy Reverso)

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚨 Solução de Problemas

### Erro: "Cannot connect to MongoDB"

```bash
# Verificar se MongoDB está rodando
sudo systemctl status mongod

# Verificar logs
sudo journalctl -u mongod

# Reiniciar MongoDB
sudo systemctl restart mongod
```

### Erro: "OpenAI API key not found"

1. Verifique se a variável `OPENAI_API_KEY` está definida no `.env`
2. Verifique se a chave é válida no painel da OpenAI
3. Reinicie a aplicação após alterar o `.env`

### Erro: "Port 3000 already in use"

```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo
kill -9 PID_DO_PROCESSO

# Ou usar porta diferente
PORT=3001 npm run dev
```

### Erro: "JWT secret not provided"

1. Gere uma chave JWT segura
2. Adicione ao arquivo `.env`
3. Reinicie a aplicação

### Performance Lenta

1. **Verificar índices do MongoDB**
   ```javascript
   // No MongoDB shell
   db.users.createIndex({ email: 1 })
   db.workouts.createIndex({ userId: 1, createdAt: -1 })
   ```

2. **Habilitar Redis para cache**
   ```env
   REDIS_URL=redis://localhost:6379
   ```

3. **Ajustar rate limiting**
   ```env
   RATE_LIMIT_MAX=200
   RATE_LIMIT_WINDOW=900000
   ```

## 📊 Monitoramento

### Logs

```bash
# Ver logs em tempo real
tail -f logs/app.log

# Logs do PM2
pm2 logs fitness-api

# Logs do Docker
docker-compose logs -f api
```

### Métricas

```bash
# Status da aplicação
curl http://localhost:3000/health

# Métricas do sistema
htop
iostat
```

## 🔐 Segurança em Produção

### Checklist de Segurança

- [ ] Alterar `JWT_SECRET` para valor seguro
- [ ] Configurar `NODE_ENV=production`
- [ ] Habilitar HTTPS
- [ ] Configurar firewall
- [ ] Atualizar rate limits
- [ ] Configurar backup do banco
- [ ] Monitorar logs de segurança
- [ ] Usar variáveis de ambiente para secrets
- [ ] Configurar CORS adequadamente

### Variáveis de Ambiente Seguras

```bash
# Nunca commitar o arquivo .env
echo ".env" >> .gitignore

# Usar serviços como AWS Secrets Manager em produção
```

## 📞 Suporte

Se você encontrar problemas:

1. Verifique os logs da aplicação
2. Consulte a documentação do Swagger
3. Verifique as issues no GitHub
4. Entre em contato: paulo@example.com

---

✅ **Parabéns!** Sua API está configurada e pronta para uso!

