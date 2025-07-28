"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measurementRoutes = measurementRoutes;
const auth_1 = require("@shared/middleware/auth");
async function measurementRoutes(fastify) {
    fastify.addHook('preHandler', auth_1.authRequired);
    fastify.get('/', {
        schema: {
            description: 'Lista todas as medidas corporais do usuário',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    type: { type: 'string', enum: ['weight', 'height', 'waist', 'chest', 'arm', 'thigh', 'neck', 'hip', 'forearm', 'calf', 'body_fat', 'muscle_mass', 'bone_mass', 'water_percentage', 'visceral_fat'] },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de medidas corporais', userId: request.user?._id };
    });
    fastify.post('/', {
        schema: {
            description: 'Cria uma nova medida corporal',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['measurements'],
                properties: {
                    measurements: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['type', 'value', 'unit'],
                            properties: {
                                type: { type: 'string', enum: ['weight', 'height', 'waist', 'chest', 'arm', 'thigh', 'neck', 'hip', 'forearm', 'calf', 'body_fat', 'muscle_mass', 'bone_mass', 'water_percentage', 'visceral_fat'] },
                                value: { type: 'number', minimum: 0 },
                                unit: { type: 'string', minLength: 1, maxLength: 10 },
                                notes: { type: 'string', maxLength: 500 },
                                measuredAt: { type: 'string', format: 'date-time' }
                            }
                        }
                    },
                    photos: { type: 'array', items: { type: 'string' } },
                    notes: { type: 'string', maxLength: 1000 },
                    measuredBy: { type: 'string', maxLength: 100 },
                    location: { type: 'string', maxLength: 100 },
                    conditions: { type: 'string', maxLength: 500 }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Medida corporal criada', data: request.body };
    });
    fastify.get('/:id', {
        schema: {
            description: 'Obtém uma medida corporal específica',
            tags: ['Medidas'],
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
        return { message: 'Detalhes da medida', id };
    });
    fastify.put('/:id', {
        schema: {
            description: 'Atualiza uma medida corporal',
            tags: ['Medidas'],
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
                    measurements: { type: 'array' },
                    photos: { type: 'array', items: { type: 'string' } },
                    notes: { type: 'string', maxLength: 1000 },
                    measuredBy: { type: 'string', maxLength: 100 },
                    location: { type: 'string', maxLength: 100 },
                    conditions: { type: 'string', maxLength: 500 }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Medida atualizada', id, data: request.body };
    });
    fastify.delete('/:id', {
        schema: {
            description: 'Deleta uma medida corporal',
            tags: ['Medidas'],
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
        return { message: 'Medida deletada', id };
    });
    fastify.get('/progress/:type', {
        schema: {
            description: 'Obtém o progresso de um tipo específico de medida',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['type'],
                properties: {
                    type: { type: 'string', enum: ['weight', 'height', 'waist', 'chest', 'arm', 'thigh', 'neck', 'hip', 'forearm', 'calf', 'body_fat', 'muscle_mass', 'bone_mass', 'water_percentage', 'visceral_fat'] }
                }
            },
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['week', 'month', 'quarter', 'year'], default: 'month' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            }
        }
    }, async (request, reply) => {
        const { type } = request.params;
        return { message: 'Progresso da medida', type, userId: request.user?._id };
    });
    fastify.post('/bulk', {
        schema: {
            description: 'Importa múltiplas medidas de uma vez',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['measurements'],
                properties: {
                    measurements: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['measurements'],
                            properties: {
                                measurements: { type: 'array' },
                                photos: { type: 'array', items: { type: 'string' } },
                                notes: { type: 'string' },
                                measuredBy: { type: 'string' },
                                location: { type: 'string' },
                                conditions: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Medidas importadas em lote', data: request.body };
    });
    fastify.get('/goals', {
        schema: {
            description: 'Lista todas as metas de medidas do usuário',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    type: { type: 'string' },
                    achieved: { type: 'boolean' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de metas de medidas', userId: request.user?._id };
    });
    fastify.post('/goals', {
        schema: {
            description: 'Cria uma nova meta de medida',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['type', 'targetValue', 'unit'],
                properties: {
                    type: { type: 'string', enum: ['weight', 'height', 'waist', 'chest', 'arm', 'thigh', 'neck', 'hip', 'forearm', 'calf', 'body_fat', 'muscle_mass', 'bone_mass', 'water_percentage', 'visceral_fat'] },
                    targetValue: { type: 'number', minimum: 0 },
                    currentValue: { type: 'number', minimum: 0 },
                    unit: { type: 'string', minLength: 1, maxLength: 10 },
                    targetDate: { type: 'string', format: 'date' },
                    description: { type: 'string', maxLength: 500 },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
                    milestones: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                value: { type: 'number', minimum: 0 },
                                notes: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Meta de medida criada', data: request.body };
    });
    fastify.put('/goals/:id', {
        schema: {
            description: 'Atualiza uma meta de medida',
            tags: ['Medidas'],
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
        return { message: 'Meta atualizada', id };
    });
    fastify.delete('/goals/:id', {
        schema: {
            description: 'Deleta uma meta de medida',
            tags: ['Medidas'],
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
    fastify.get('/photos', {
        schema: {
            description: 'Lista todas as fotos de progresso do usuário',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    bodyPart: { type: 'string' },
                    isFavorite: { type: 'boolean' },
                    tags: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de fotos de progresso', userId: request.user?._id };
    });
    fastify.post('/photos', {
        schema: {
            description: 'Faz upload de uma foto de progresso',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            consumes: ['multipart/form-data'],
            body: {
                type: 'object',
                properties: {
                    description: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                    bodyPart: { type: 'string' },
                    measurements: { type: 'array' },
                    isPublic: { type: 'boolean', default: false }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Foto de progresso enviada', data: request.body };
    });
    fastify.get('/health-profile', {
        schema: {
            description: 'Obtém o perfil de saúde do usuário',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Perfil de saúde', userId: request.user?._id };
    });
    fastify.put('/health-profile', {
        schema: {
            description: 'Atualiza o perfil de saúde do usuário',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    age: { type: 'integer', minimum: 1, maximum: 150 },
                    gender: { type: 'string', enum: ['male', 'female', 'other'] },
                    activityLevel: { type: 'string', enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'] },
                    measurementUnit: { type: 'string', enum: ['metric', 'imperial'] },
                    currentMetrics: {
                        type: 'object',
                        properties: {
                            weight: { type: 'number' },
                            height: { type: 'number' },
                            bodyFat: { type: 'number' },
                            muscleMass: { type: 'number' }
                        }
                    },
                    medicalConditions: { type: 'array', items: { type: 'string' } },
                    allergies: { type: 'array', items: { type: 'string' } },
                    medications: { type: 'array', items: { type: 'string' } },
                    fitnessGoals: { type: 'array', items: { type: 'string' } },
                    preferredWorkoutTypes: { type: 'array', items: { type: 'string' } }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Perfil de saúde atualizado', data: request.body };
    });
    fastify.get('/stats', {
        schema: {
            description: 'Obtém estatísticas de medidas do usuário',
            tags: ['Medidas'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['week', 'month', 'quarter', 'year'], default: 'month' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Estatísticas de medidas', userId: request.user?._id };
    });
}
//# sourceMappingURL=measurementRoutes.js.map