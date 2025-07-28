"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoppingRoutes = shoppingRoutes;
const auth_1 = require("@shared/middleware/auth");
async function shoppingRoutes(fastify) {
    fastify.addHook('preHandler', auth_1.authRequired);
    fastify.get('/items', {
        schema: {
            description: 'Lista todos os itens de compra do usuário',
            tags: ['Lista de Compras'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    category: { type: 'string', enum: ['protein', 'carbohydrates', 'vegetables', 'fruits', 'dairy', 'supplements', 'beverages', 'snacks', 'condiments', 'other'] },
                    status: { type: 'string', enum: ['pending', 'purchased', 'out_of_stock', 'cancelled'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                    listId: { type: 'string' },
                    search: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de itens de compra', userId: request.user?._id };
    });
    fastify.post('/items', {
        schema: {
            description: 'Cria um novo item de compra',
            tags: ['Lista de Compras'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name', 'category', 'quantity', 'unit'],
                properties: {
                    name: { type: 'string', minLength: 1, maxLength: 100 },
                    description: { type: 'string', maxLength: 500 },
                    category: { type: 'string', enum: ['protein', 'carbohydrates', 'vegetables', 'fruits', 'dairy', 'supplements', 'beverages', 'snacks', 'condiments', 'other'] },
                    quantity: { type: 'number', minimum: 0 },
                    unit: { type: 'string', minLength: 1, maxLength: 20 },
                    estimatedPrice: { type: 'number', minimum: 0 },
                    store: { type: 'string' },
                    brand: { type: 'string' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
                    nutritionalInfo: {
                        type: 'object',
                        properties: {
                            calories: { type: 'number' },
                            protein: { type: 'number' },
                            carbs: { type: 'number' },
                            fat: { type: 'number' },
                            fiber: { type: 'number' },
                            sugar: { type: 'number' },
                            sodium: { type: 'number' }
                        }
                    },
                    notes: { type: 'string' },
                    barcode: { type: 'string' },
                    expirationDate: { type: 'string', format: 'date' },
                    listId: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Item de compra criado', data: request.body };
    });
    fastify.get('/items/:id', {
        schema: {
            description: 'Obtém um item de compra específico',
            tags: ['Lista de Compras'],
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
        return { message: 'Detalhes do item', id };
    });
    fastify.put('/items/:id', {
        schema: {
            description: 'Atualiza um item de compra',
            tags: ['Lista de Compras'],
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
                    name: { type: 'string', minLength: 1, maxLength: 100 },
                    description: { type: 'string', maxLength: 500 },
                    category: { type: 'string', enum: ['protein', 'carbohydrates', 'vegetables', 'fruits', 'dairy', 'supplements', 'beverages', 'snacks', 'condiments', 'other'] },
                    quantity: { type: 'number', minimum: 0 },
                    unit: { type: 'string' },
                    estimatedPrice: { type: 'number', minimum: 0 },
                    actualPrice: { type: 'number', minimum: 0 },
                    store: { type: 'string' },
                    brand: { type: 'string' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                    status: { type: 'string', enum: ['pending', 'purchased', 'out_of_stock', 'cancelled'] },
                    notes: { type: 'string' },
                    purchasedAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Item atualizado', id, data: request.body };
    });
    fastify.delete('/items/:id', {
        schema: {
            description: 'Deleta um item de compra',
            tags: ['Lista de Compras'],
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
        return { message: 'Item deletado', id };
    });
    fastify.post('/items/:id/purchase', {
        schema: {
            description: 'Marca um item como comprado',
            tags: ['Lista de Compras'],
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
                    actualPrice: { type: 'number', minimum: 0 },
                    store: { type: 'string' },
                    notes: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        return { message: 'Item marcado como comprado', id, data: request.body };
    });
    fastify.get('/items/:id/price-history', {
        schema: {
            description: 'Obtém o histórico de preços de um item',
            tags: ['Lista de Compras'],
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
        return { message: 'Histórico de preços', itemId: id };
    });
    fastify.get('/lists', {
        schema: {
            description: 'Lista todas as listas de compras do usuário',
            tags: ['Lista de Compras'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1 },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    completed: { type: 'boolean' },
                    search: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de listas de compras', userId: request.user?._id };
    });
    fastify.post('/lists', {
        schema: {
            description: 'Cria uma nova lista de compras',
            tags: ['Lista de Compras'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string', minLength: 1, maxLength: 100 },
                    description: { type: 'string', maxLength: 500 },
                    store: { type: 'string' },
                    shoppingDate: { type: 'string', format: 'date' },
                    notes: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Lista de compras criada', data: request.body };
    });
    fastify.put('/lists/:id', {
        schema: {
            description: 'Atualiza uma lista de compras',
            tags: ['Lista de Compras'],
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
        return { message: 'Lista atualizada', id };
    });
    fastify.delete('/lists/:id', {
        schema: {
            description: 'Deleta uma lista de compras',
            tags: ['Lista de Compras'],
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
        return { message: 'Lista deletada', id };
    });
    fastify.get('/budget', {
        schema: {
            description: 'Obtém o orçamento atual do usuário',
            tags: ['Lista de Compras'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    month: { type: 'integer', minimum: 1, maximum: 12 },
                    year: { type: 'integer', minimum: 2020 }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Orçamento atual', userId: request.user?._id };
    });
    fastify.post('/budget', {
        schema: {
            description: 'Cria ou atualiza o orçamento mensal',
            tags: ['Lista de Compras'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['name', 'monthlyLimit', 'month', 'year'],
                properties: {
                    name: { type: 'string', minLength: 1, maxLength: 100 },
                    monthlyLimit: { type: 'number', minimum: 0 },
                    month: { type: 'integer', minimum: 1, maximum: 12 },
                    year: { type: 'integer', minimum: 2020 },
                    categories: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                category: { type: 'string' },
                                limit: { type: 'number', minimum: 0 }
                            }
                        }
                    },
                    alerts: {
                        type: 'object',
                        properties: {
                            percentage: { type: 'number', minimum: 1, maximum: 100 },
                            enabled: { type: 'boolean' }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Orçamento criado/atualizado', data: request.body };
    });
    fastify.get('/stats', {
        schema: {
            description: 'Obtém estatísticas de compras do usuário',
            tags: ['Lista de Compras'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    period: { type: 'string', enum: ['week', 'month', 'quarter', 'year'], default: 'month' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Estatísticas de compras', userId: request.user?._id };
    });
    fastify.get('/export', {
        schema: {
            description: 'Exporta dados de compras em CSV',
            tags: ['Lista de Compras'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    format: { type: 'string', enum: ['csv', 'json'], default: 'csv' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Dados exportados', userId: request.user?._id };
    });
}
//# sourceMappingURL=shoppingRoutes.js.map