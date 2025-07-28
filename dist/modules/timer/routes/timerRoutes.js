"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timerRoutes = timerRoutes;
const auth_1 = require("@shared/middleware/auth");
async function timerRoutes(fastify) {
    fastify.addHook('preHandler', auth_1.authRequired);
    fastify.get('/sessions', {
        schema: {
            description: 'Lista todas as sessões de timer do usuário',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    type: { type: 'string', enum: ['workout', 'rest', 'exercise', 'set', 'interval', 'custom'] },
                    status: { type: 'string', enum: ['stopped', 'running', 'paused', 'completed'] },
                    workoutId: { type: 'string' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de sessões de timer', userId: request.user?._id };
    });
    fastify.post('/sessions', {
        schema: {
            description: 'Cria uma nova sessão de timer',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['type', 'duration'],
                properties: {
                    name: { type: 'string', maxLength: 100 },
                    type: { type: 'string', enum: ['workout', 'rest', 'exercise', 'set', 'interval', 'custom'] },
                    workoutId: { type: 'string' },
                    exerciseId: { type: 'string' },
                    duration: { type: 'number', minimum: 1 },
                    intervals: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['duration', 'type'],
                            properties: {
                                name: { type: 'string' },
                                duration: { type: 'number', minimum: 1 },
                                type: { type: 'string', enum: ['work', 'rest'] }
                            }
                        }
                    },
                    notes: { type: 'string', maxLength: 500 },
                    settings: {
                        type: 'object',
                        properties: {
                            autoStart: { type: 'boolean', default: false },
                            soundEnabled: { type: 'boolean', default: true },
                            vibrationEnabled: { type: 'boolean', default: true },
                            countdownWarning: { type: 'number', default: 10 }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Sessão de timer criada', data: request.body };
    });
    fastify.get('/sessions/:id', {
        schema: {
            description: 'Obtém uma sessão de timer específica',
            tags: ['Cronômetro'],
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
        return { message: 'Detalhes da sessão', id };
    });
    fastify.put('/sessions/:id', {
        schema: {
            description: 'Atualiza uma sessão de timer',
            tags: ['Cronômetro'],
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
                    name: { type: 'string', maxLength: 100 },
                    duration: { type: 'number', minimum: 1 },
                    elapsedTime: { type: 'number', minimum: 0 },
                    status: { type: 'string', enum: ['stopped', 'running', 'paused', 'completed'] },
                    notes: { type: 'string', maxLength: 500 },
                    settings: { type: 'object' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Sessão atualizada', id, data: request.body };
    });
    fastify.delete('/sessions/:id', {
        schema: {
            description: 'Deleta uma sessão de timer',
            tags: ['Cronômetro'],
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
        return { message: 'Sessão deletada', id };
    });
    fastify.post('/sessions/:id/start', {
        schema: {
            description: 'Inicia uma sessão de timer',
            tags: ['Cronômetro'],
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
        return { message: 'Timer iniciado', sessionId: id, startTime: new Date() };
    });
    fastify.post('/sessions/:id/pause', {
        schema: {
            description: 'Pausa uma sessão de timer',
            tags: ['Cronômetro'],
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
        return { message: 'Timer pausado', sessionId: id, pausedAt: new Date() };
    });
    fastify.post('/sessions/:id/stop', {
        schema: {
            description: 'Para uma sessão de timer',
            tags: ['Cronômetro'],
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
        return { message: 'Timer parado', sessionId: id, stoppedAt: new Date() };
    });
    fastify.get('/workout-timers', {
        schema: {
            description: 'Lista todos os timers de treino do usuário',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    workoutId: { type: 'string' },
                    status: { type: 'string', enum: ['stopped', 'running', 'paused', 'completed'] },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de timers de treino', userId: request.user?._id };
    });
    fastify.post('/workout-timers', {
        schema: {
            description: 'Cria um novo timer de treino',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['workoutId', 'workoutName', 'totalDuration', 'exercises'],
                properties: {
                    workoutId: { type: 'string' },
                    workoutName: { type: 'string', minLength: 1, maxLength: 100 },
                    totalDuration: { type: 'number', minimum: 1 },
                    exercises: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['exerciseId', 'exerciseName'],
                            properties: {
                                exerciseId: { type: 'string' },
                                exerciseName: { type: 'string' },
                                sets: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            setNumber: { type: 'number' },
                                            duration: { type: 'number' },
                                            restDuration: { type: 'number' },
                                            weight: { type: 'number' },
                                            reps: { type: 'number' },
                                            notes: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    notes: { type: 'string', maxLength: 500 }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Timer de treino criado', data: request.body };
    });
    fastify.put('/workout-timers/:id', {
        schema: {
            description: 'Atualiza um timer de treino',
            tags: ['Cronômetro'],
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
        return { message: 'Timer de treino atualizado', id };
    });
    fastify.delete('/workout-timers/:id', {
        schema: {
            description: 'Deleta um timer de treino',
            tags: ['Cronômetro'],
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
        return { message: 'Timer de treino deletado', id };
    });
    fastify.get('/templates', {
        schema: {
            description: 'Lista todos os templates de timer do usuário',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    type: { type: 'string', enum: ['workout', 'rest', 'exercise', 'set', 'interval', 'custom'] },
                    isPublic: { type: 'boolean' },
                    tags: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de templates de timer', userId: request.user?._id };
    });
    fastify.post('/templates', {
        schema: {
            description: 'Cria um novo template de timer',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name', 'type', 'duration'],
                properties: {
                    name: { type: 'string', minLength: 1, maxLength: 100 },
                    description: { type: 'string', maxLength: 500 },
                    type: { type: 'string', enum: ['workout', 'rest', 'exercise', 'set', 'interval', 'custom'] },
                    duration: { type: 'number', minimum: 1 },
                    intervals: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['name', 'duration', 'type'],
                            properties: {
                                name: { type: 'string' },
                                duration: { type: 'number', minimum: 1 },
                                type: { type: 'string', enum: ['work', 'rest'] }
                            }
                        }
                    },
                    settings: {
                        type: 'object',
                        properties: {
                            autoStart: { type: 'boolean', default: false },
                            soundEnabled: { type: 'boolean', default: true },
                            vibrationEnabled: { type: 'boolean', default: true },
                            countdownWarning: { type: 'number', default: 10 }
                        }
                    },
                    isPublic: { type: 'boolean', default: false },
                    tags: { type: 'array', items: { type: 'string' } }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Template de timer criado', data: request.body };
    });
    fastify.put('/templates/:id', {
        schema: {
            description: 'Atualiza um template de timer',
            tags: ['Cronômetro'],
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
        return { message: 'Template atualizado', id };
    });
    fastify.delete('/templates/:id', {
        schema: {
            description: 'Deleta um template de timer',
            tags: ['Cronômetro'],
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
        return { message: 'Template deletado', id };
    });
    fastify.get('/stats', {
        schema: {
            description: 'Obtém estatísticas de timer do usuário',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['week', 'month', 'quarter', 'year'], default: 'month' },
                    type: { type: 'string', enum: ['workout', 'rest', 'exercise', 'set', 'interval', 'custom'] }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Estatísticas de timer', userId: request.user?._id };
    });
    fastify.get('/stats/daily', {
        schema: {
            description: 'Obtém estatísticas diárias de timer',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    date: { type: 'string', format: 'date' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Estatísticas diárias de timer', userId: request.user?._id };
    });
    fastify.post('/templates/:id/use', {
        schema: {
            description: 'Cria uma sessão baseada em um template',
            tags: ['Cronômetro'],
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
                    name: { type: 'string' },
                    workoutId: { type: 'string' },
                    exerciseId: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Sessão criada a partir do template', templateId: id, data: request.body };
    });
    fastify.get('/active', {
        schema: {
            description: 'Obtém o timer atualmente ativo do usuário',
            tags: ['Cronômetro'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Timer ativo', userId: request.user?._id };
    });
}
//# sourceMappingURL=timerRoutes.js.map