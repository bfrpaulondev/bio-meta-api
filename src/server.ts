

import  Fastify, { FastifyInstance } from 'fastify';
import { config } from '@config/environment';
import { database } from '@shared/database/connection';

// Plugins
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import staticFiles from '@fastify/static';
import { registerSwagger } from '@shared/plugins/swagger';
import jwt from '@fastify/jwt';
import sensible from 'fastify-sensible';

// Rotas
import { authRoutes } from '@modules/auth/routes/authRoutes';
import { workoutRoutes } from '@modules/workouts/routes/workoutRoutes';
import { shoppingRoutes } from '@modules/shopping/routes/shoppingRoutes';
import { measurementRoutes } from '@modules/measurements/routes/measurementRoutes';
import { galleryRoutes } from '@modules/gallery/routes/galleryRoutes';
import { timerRoutes } from '@modules/timer/routes/timerRoutes';
import { goalRoutes } from '@modules/goals/routes/goalRoutes';
import { settingsRoutes } from '@modules/settings/routes/settingsRoutes';
import { aiRoutes } from '@modules/ai/routes/aiRoutes';

import path from 'path';

async function createServer(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: config.logging.level,
      transport: config.server.nodeEnv === 'development' ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      } : undefined
    }
  });

  // Registrar plugins de segurança
  await fastify.register(helmet, {
    contentSecurityPolicy: false // Desabilitar para permitir Swagger UI
  });

  await fastify.register(cors, {
    origin: true, // Permitir todas as origens para desenvolvimento
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  });

  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.window
  });

  // Registrar plugins de funcionalidade
  await fastify.register(sensible);

  await fastify.register(jwt, {
    secret: config.jwt.secret
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: config.upload.maxFileSize
    }
  });

  await fastify.register(staticFiles, {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads/'
  });

  // Configurar Swagger
  await registerSwagger(fastify);

  // Registrar rotas
  await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(workoutRoutes, { prefix: '/api/workouts' });

  await fastify.register(shoppingRoutes, { prefix: '/api/shopping' });
  await fastify.register(measurementRoutes, { prefix: '/api/measurements' });
  await fastify.register(galleryRoutes, { prefix: '/api/gallery' });
  await fastify.register(timerRoutes, { prefix: '/api/timer' });
  await fastify.register(goalRoutes, { prefix: '/api/goals' });
  await fastify.register(settingsRoutes, { prefix: '/api/settings' });
  await fastify.register(aiRoutes, { prefix: '/api/ai' });

  // Rota de health check
  fastify.get('/health', async (request, reply) => {
    const dbHealth = await database.healthCheck();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.server.nodeEnv,
      version: '1.0.0',
      database: dbHealth
    };
  });

  // Rota raiz
  fastify.get('/', async (request, reply) => {
    return {
      message: 'Fitness App API',
      version: '1.0.0',
      documentation: '/docs',
      health: '/health'
    };
  });

  // Handler de erro global
  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(error);

    // Erro de validação
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: 'Dados de entrada inválidos',
        details: error.validation,
        code: 'VALIDATION_ERROR'
      });
    }

    // Erro de rate limit
    if (error.statusCode === 429) {
      return reply.status(429).send({
        success: false,
        error: 'Muitas requisições. Tente novamente mais tarde.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }

    // Erro de autenticação
    if (error.statusCode === 401) {
      return reply.status(401).send({
        success: false,
        error: 'Token de acesso inválido ou expirado',
        code: 'UNAUTHORIZED'
      });
    }

    // Erro interno do servidor
    return reply.status(error.statusCode || 500).send({
      success: false,
      error: config.server.nodeEnv === 'production' 
        ? 'Erro interno do servidor' 
        : error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  });

  // Handler para rotas não encontradas
  fastify.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({
      success: false,
      error: 'Rota não encontrada',
      code: 'NOT_FOUND'
    });
  });

  return fastify;
}

async function start() {
  try {
    // Conectar ao banco de dados
    await database.connect();

    // Criar e iniciar servidor
    const server = await createServer();
    
    await server.listen({
      port: config.server.port,
      host: config.server.host
    });

    console.log(`🚀 Servidor rodando em http://${config.server.host}:${config.server.port}`);
    console.log(`📚 Documentação disponível em http://${config.server.host}:${config.server.port}/docs`);
    console.log(`❤️ Health check em http://${config.server.host}:${config.server.port}/health`);

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido SIGINT, encerrando servidor...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
  await database.disconnect();
  process.exit(0);
});

// Iniciar servidor se este arquivo for executado diretamente
if (require.main === module) {
  start();
}

export { createServer, start };

