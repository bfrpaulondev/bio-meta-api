"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalRoutes = goalRoutes;
const auth_1 = require("@shared/middleware/auth");
async function goalRoutes(fastify) {
    fastify.addHook('preHandler', auth_1.authRequired);
    fastify.get('/', {
        schema: {
            description: 'Lista todas as metas do usuário',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    type: { type: 'string', enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'body_fat', 'financial', 'habit', 'custom'] },
                    status: { type: 'string', enum: ['active', 'completed', 'paused', 'cancelled', 'overdue'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                    search: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de metas', userId: request.user?._id };
    });
    fastify.post('/', {
        schema: {
            description: 'Cria uma nova meta',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'type', 'startDate'],
                properties: {
                    title: { type: 'string', minLength: 1, maxLength: 100 },
                    description: { type: 'string', maxLength: 500 },
                    type: { type: 'string', enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'body_fat', 'financial', 'habit', 'custom'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
                    startValue: { type: 'number', minimum: 0 },
                    targetValue: { type: 'number', minimum: 0 },
                    currentValue: { type: 'number', minimum: 0 },
                    unit: { type: 'string', maxLength: 20 },
                    startDate: { type: 'string', format: 'date' },
                    targetDate: { type: 'string', format: 'date' },
                    milestones: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['title'],
                            properties: {
                                title: { type: 'string', minLength: 1, maxLength: 100 },
                                description: { type: 'string', maxLength: 500 },
                                targetValue: { type: 'number' },
                                targetDate: { type: 'string', format: 'date' },
                                reward: { type: 'string', maxLength: 200 }
                            }
                        }
                    },
                    tags: { type: 'array', items: { type: 'string' } },
                    isPublic: { type: 'boolean', default: false },
                    motivationalQuote: { type: 'string', maxLength: 200 },
                    reward: { type: 'string', maxLength: 200 },
                    notes: { type: 'string', maxLength: 1000 }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Meta criada', data: request.body };
    });
    fastify.get('/:id', {
        schema: {
            description: 'Obtém uma meta específica',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Detalhes da meta', id };
    });
    fastify.put('/:id', {
        schema: {
            description: 'Atualiza uma meta',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string', minLength: 1, maxLength: 100 },
                    description: { type: 'string', maxLength: 500 },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                    status: { type: 'string', enum: ['active', 'completed', 'paused', 'cancelled', 'overdue'] },
                    currentValue: { type: 'number', minimum: 0 },
                    targetValue: { type: 'number', minimum: 0 },
                    targetDate: { type: 'string', format: 'date' },
                    notes: { type: 'string', maxLength: 1000 }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Meta atualizada', id, data: request.body };
    });
    fastify.delete('/:id', {
        schema: {
            description: 'Deleta uma meta',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Meta deletada', id };
    });
    fastify.post('/:id/progress', {
        schema: {
            description: 'Adiciona progresso a uma meta',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            },
            body: {
                type: 'object',
                required: ['value'],
                properties: {
                    value: { type: 'number', minimum: 0 },
                    notes: { type: 'string', maxLength: 500 },
                    attachments: { type: 'array', items: { type: 'string' } }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Progresso adicionado', goalId: id, data: request.body };
    });
    fastify.post('/:id/complete', {
        schema: {
            description: 'Marca uma meta como concluída',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    notes: { type: 'string', maxLength: 500 },
                    celebrationMessage: { type: 'string', maxLength: 200 }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Meta marcada como concluída', goalId: id, completedAt: new Date() };
    });
    fastify.get('/reminders', {
        schema: {
            description: 'Lista todos os lembretes do usuário',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    isActive: { type: 'boolean' },
                    frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'custom'] },
                    goalId: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de lembretes', userId: request.user?._id };
    });
    fastify.post('/reminders', {
        schema: {
            description: 'Cria um novo lembrete',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'message', 'frequency', 'scheduledTime'],
                properties: {
                    title: { type: 'string', minLength: 1, maxLength: 100 },
                    message: { type: 'string', minLength: 1, maxLength: 500 },
                    type: { type: 'string', enum: ['info', 'warning', 'error', 'success'], default: 'info' },
                    frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'custom'] },
                    customFrequency: {
                        type: 'object',
                        properties: {
                            interval: { type: 'integer', minimum: 1 },
                            unit: { type: 'string', enum: ['minutes', 'hours', 'days', 'weeks', 'months'] }
                        }
                    },
                    scheduledTime: {
                        type: 'object',
                        required: ['hour', 'minute'],
                        properties: {
                            hour: { type: 'integer', minimum: 0, maximum: 23 },
                            minute: { type: 'integer', minimum: 0, maximum: 59 },
                            daysOfWeek: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 } },
                            dayOfMonth: { type: 'integer', minimum: 1, maximum: 31 }
                        }
                    },
                    goalId: { type: 'string' },
                    workoutId: { type: 'string' },
                    settings: {
                        type: 'object',
                        properties: {
                            pushNotification: { type: 'boolean', default: true },
                            email: { type: 'boolean', default: false },
                            sound: { type: 'boolean', default: true },
                            vibration: { type: 'boolean', default: true }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lembrete criado', data: request.body };
    });
    fastify.put('/reminders/:id', {
        schema: {
            description: 'Atualiza um lembrete',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Lembrete atualizado', id };
    });
    fastify.delete('/reminders/:id', {
        schema: {
            description: 'Deleta um lembrete',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Lembrete deletado', id };
    });
    fastify.get('/tips', {
        schema: {
            description: 'Lista dicas disponíveis',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    category: { type: 'string', enum: ['fitness', 'nutrition', 'motivation', 'health', 'lifestyle'] },
                    difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                    tags: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de dicas', userId: request.user?._id };
    });
    fastify.get('/tips/random', {
        schema: {
            description: 'Obtém uma dica aleatória',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    category: { type: 'string', enum: ['fitness', 'nutrition', 'motivation', 'health', 'lifestyle'] },
                    difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Dica aleatória', userId: request.user?._id };
    });
    fastify.post('/tips', {
        schema: {
            description: 'Cria uma dica personalizada',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['title', 'content', 'category'],
                properties: {
                    title: { type: 'string', minLength: 1, maxLength: 100 },
                    content: { type: 'string', minLength: 1, maxLength: 2000 },
                    category: { type: 'string', enum: ['fitness', 'nutrition', 'motivation', 'health', 'lifestyle'] },
                    difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                    tags: { type: 'array', items: { type: 'string' } },
                    imageUrl: { type: 'string' },
                    videoUrl: { type: 'string' },
                    source: { type: 'string', maxLength: 200 }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Dica personalizada criada', data: request.body };
    });
    fastify.put('/tips/:id', {
        schema: {
            description: 'Atualiza uma dica personalizada',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Dica atualizada', id };
    });
    fastify.delete('/tips/:id', {
        schema: {
            description: 'Deleta uma dica personalizada',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Dica deletada', id };
    });
    fastify.get('/achievements', {
        schema: {
            description: 'Lista todas as conquistas do usuário',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    category: { type: 'string', enum: ['workout', 'goal', 'streak', 'milestone', 'social', 'special'] },
                    rarity: { type: 'string', enum: ['common', 'rare', 'epic', 'legendary'] }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de conquistas', userId: request.user?._id };
    });
    fastify.get('/stats', {
        schema: {
            description: 'Obtém estatísticas gerais do usuário',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['week', 'month', 'quarter', 'year'], default: 'month' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Estatísticas do usuário', userId: request.user?._id };
    });
    fastify.post('/tips/:id/like', {
        schema: {
            description: 'Curte ou descurte uma dica',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'string' }
                }
            },
            body: {
                type: 'object',
                required: ['liked'],
                properties: {
                    liked: { type: 'boolean' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Status de curtida atualizado', tipId: id, data: request.body };
    });
    fastify.get('/progress-summary', {
        schema: {
            description: 'Obtém resumo de progresso de todas as metas',
            tags: ['Metas'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Resumo de progresso', userId: request.user?._id };
    });
}
//# sourceMappingURL=goalRoutes.js.map