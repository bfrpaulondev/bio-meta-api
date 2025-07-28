"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = dashboardRoutes;
const auth_1 = require("@shared/middleware/auth");
async function dashboardRoutes(fastify) {
    fastify.addHook('preHandler', auth_1.authRequired);
    fastify.get('/', {
        schema: {
            description: 'Obtém dados completos do dashboard do usuário',
            tags: ['Dashboard'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['today', 'week', 'month', 'quarter', 'year'], default: 'today' },
                    includeStats: { type: 'boolean', default: true },
                    includeAlerts: { type: 'boolean', default: true },
                    includeUpcoming: { type: 'boolean', default: true }
                }
            }
        }
    }, async (request, reply) => {
        return {
            message: 'Dados do dashboard',
            userId: request.user?._id,
            query: request.query
        };
    });
    fastify.put('/', {
        schema: {
            description: 'Atualiza configurações gerais do dashboard',
            tags: ['Dashboard'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    defaultLayout: { type: 'string' },
                    refreshInterval: { type: 'integer', minimum: 30, maximum: 3600 },
                    showAnimations: { type: 'boolean' },
                    compactMode: { type: 'boolean' },
                    autoRefresh: { type: 'boolean' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Configurações do dashboard atualizadas', data: request.body };
    });
    fastify.post('/refresh', {
        schema: {
            description: 'Força atualização dos dados do dashboard',
            tags: ['Dashboard'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Dashboard atualizado', refreshedAt: new Date() };
    });
    fastify.delete('/cache', {
        schema: {
            description: 'Limpa o cache do dashboard',
            tags: ['Dashboard'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Cache do dashboard limpo', clearedAt: new Date() };
    });
    fastify.get('/stats', {
        schema: {
            description: 'Obtém estatísticas resumidas para o dashboard',
            tags: ['Dashboard'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['today', 'week', 'month', 'quarter', 'year'], default: 'month' },
                    metrics: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['weight', 'workouts', 'goals', 'calories', 'measurements', 'spending']
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Estatísticas do dashboard', userId: request.user?._id };
    });
    fastify.get('/insights', {
        schema: {
            description: 'Obtém insights personalizados baseados nos dados do usuário',
            tags: ['Dashboard'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['week', 'month', 'quarter', 'year'], default: 'month' },
                    categories: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['fitness', 'nutrition', 'progress', 'habits', 'financial']
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Insights personalizados', userId: request.user?._id };
    });
}
//# sourceMappingURL=dashboardRoutes.js.map