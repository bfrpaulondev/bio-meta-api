"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
exports.start = start;
const fastify_1 = __importDefault(require("fastify"));
const environment_1 = require("@config/environment");
const connection_1 = require("@shared/database/connection");
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const static_1 = __importDefault(require("@fastify/static"));
const swagger_1 = require("@shared/plugins/swagger");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const fastify_sensible_1 = __importDefault(require("fastify-sensible"));
const authRoutes_1 = require("@modules/auth/routes/authRoutes");
const workoutRoutes_1 = require("@modules/workouts/routes/workoutRoutes");
const shoppingRoutes_1 = require("@modules/shopping/routes/shoppingRoutes");
const measurementRoutes_1 = require("@modules/measurements/routes/measurementRoutes");
const galleryRoutes_1 = require("@modules/gallery/routes/galleryRoutes");
const timerRoutes_1 = require("@modules/timer/routes/timerRoutes");
const goalRoutes_1 = require("@modules/goals/routes/goalRoutes");
const settingsRoutes_1 = require("@modules/settings/routes/settingsRoutes");
const aiRoutes_1 = require("@modules/ai/routes/aiRoutes");
const path_1 = __importDefault(require("path"));
async function createServer() {
    const fastify = (0, fastify_1.default)({
        logger: {
            level: environment_1.config.logging.level,
            transport: environment_1.config.server.nodeEnv === 'development' ? {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname'
                }
            } : undefined
        }
    });
    await fastify.register(helmet_1.default, {
        contentSecurityPolicy: false
    });
    await fastify.register(cors_1.default, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
    });
    await fastify.register(rate_limit_1.default, {
        max: environment_1.config.rateLimit.max,
        timeWindow: environment_1.config.rateLimit.window
    });
    await fastify.register(fastify_sensible_1.default);
    await fastify.register(jwt_1.default, {
        secret: environment_1.config.jwt.secret
    });
    await fastify.register(multipart_1.default, {
        limits: {
            fileSize: environment_1.config.upload.maxFileSize
        }
    });
    await fastify.register(static_1.default, {
        root: path_1.default.join(__dirname, '../uploads'),
        prefix: '/uploads/'
    });
    await (0, swagger_1.registerSwagger)(fastify);
    await fastify.register(authRoutes_1.authRoutes, { prefix: '/api/auth' });
    await fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });
    await fastify.register(workoutRoutes_1.workoutRoutes, { prefix: '/api/workouts' });
    await fastify.register(shoppingRoutes_1.shoppingRoutes, { prefix: '/api/shopping' });
    await fastify.register(measurementRoutes_1.measurementRoutes, { prefix: '/api/measurements' });
    await fastify.register(galleryRoutes_1.galleryRoutes, { prefix: '/api/gallery' });
    await fastify.register(timerRoutes_1.timerRoutes, { prefix: '/api/timer' });
    await fastify.register(goalRoutes_1.goalRoutes, { prefix: '/api/goals' });
    await fastify.register(settingsRoutes_1.settingsRoutes, { prefix: '/api/settings' });
    await fastify.register(aiRoutes_1.aiRoutes, { prefix: '/api/ai' });
    fastify.get('/health', async (request, reply) => {
        const dbHealth = await connection_1.database.healthCheck();
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: environment_1.config.server.nodeEnv,
            version: '1.0.0',
            database: dbHealth
        };
    });
    fastify.get('/', async (request, reply) => {
        return {
            message: 'Fitness App API',
            version: '1.0.0',
            documentation: '/docs',
            health: '/health'
        };
    });
    fastify.setErrorHandler(async (error, request, reply) => {
        fastify.log.error(error);
        if (error.validation) {
            return reply.status(400).send({
                success: false,
                error: 'Dados de entrada inválidos',
                details: error.validation,
                code: 'VALIDATION_ERROR'
            });
        }
        if (error.statusCode === 429) {
            return reply.status(429).send({
                success: false,
                error: 'Muitas requisições. Tente novamente mais tarde.',
                code: 'RATE_LIMIT_EXCEEDED'
            });
        }
        if (error.statusCode === 401) {
            return reply.status(401).send({
                success: false,
                error: 'Token de acesso inválido ou expirado',
                code: 'UNAUTHORIZED'
            });
        }
        return reply.status(error.statusCode || 500).send({
            success: false,
            error: environment_1.config.server.nodeEnv === 'production'
                ? 'Erro interno do servidor'
                : error.message,
            code: 'INTERNAL_SERVER_ERROR'
        });
    });
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
        await connection_1.database.connect();
        const server = await createServer();
        await server.listen({
            port: environment_1.config.server.port,
            host: environment_1.config.server.host
        });
        console.log(`🚀 Servidor rodando em http://${environment_1.config.server.host}:${environment_1.config.server.port}`);
        console.log(`📚 Documentação disponível em http://${environment_1.config.server.host}:${environment_1.config.server.port}/docs`);
        console.log(`❤️ Health check em http://${environment_1.config.server.host}:${environment_1.config.server.port}/health`);
    }
    catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}
process.on('SIGINT', async () => {
    console.log('\n🛑 Recebido SIGINT, encerrando servidor...');
    await connection_1.database.disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
    await connection_1.database.disconnect();
    process.exit(0);
});
if (require.main === module) {
    start();
}
//# sourceMappingURL=server.js.map