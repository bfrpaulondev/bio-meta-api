"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsRoutes = settingsRoutes;
const auth_1 = require("@shared/middleware/auth");
async function settingsRoutes(fastify) {
    fastify.addHook('preHandler', auth_1.authRequired);
    fastify.get('/', {
        schema: {
            description: 'Obtém todas as configurações do usuário',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Configurações do usuário', userId: request.user?._id };
    });
    fastify.put('/', {
        schema: {
            description: 'Atualiza as configurações do usuário',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    language: { type: 'string', enum: ['pt-BR', 'en-US', 'es-ES'] },
                    measurementUnit: { type: 'string', enum: ['metric', 'imperial'] },
                    dateFormat: { type: 'string', enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
                    timeFormat: { type: 'string', enum: ['12h', '24h'] },
                    timezone: { type: 'string' },
                    notifications: {
                        type: 'object',
                        properties: {
                            enabled: { type: 'boolean' },
                            workoutReminders: { type: 'boolean' },
                            goalDeadlines: { type: 'boolean' },
                            achievementUnlocked: { type: 'boolean' },
                            weeklyProgress: { type: 'boolean' },
                            dailyTips: { type: 'boolean' },
                            socialUpdates: { type: 'boolean' },
                            systemUpdates: { type: 'boolean' },
                            quietHours: {
                                type: 'object',
                                properties: {
                                    enabled: { type: 'boolean' },
                                    startTime: { type: 'string' },
                                    endTime: { type: 'string' }
                                }
                            },
                            sound: { type: 'boolean' },
                            vibration: { type: 'boolean' },
                            email: { type: 'boolean' },
                            push: { type: 'boolean' }
                        }
                    },
                    privacy: {
                        type: 'object',
                        properties: {
                            profileVisibility: { type: 'string', enum: ['public', 'friends', 'private'] },
                            workoutVisibility: { type: 'string', enum: ['public', 'friends', 'private'] },
                            progressVisibility: { type: 'string', enum: ['public', 'friends', 'private'] },
                            allowFriendRequests: { type: 'boolean' },
                            allowMessages: { type: 'boolean' },
                            showOnlineStatus: { type: 'boolean' },
                            dataSharing: {
                                type: 'object',
                                properties: {
                                    analytics: { type: 'boolean' },
                                    thirdParty: { type: 'boolean' },
                                    marketing: { type: 'boolean' }
                                }
                            }
                        }
                    },
                    workout: {
                        type: 'object',
                        properties: {
                            defaultRestTime: { type: 'number' },
                            autoStartTimer: { type: 'boolean' },
                            countdownWarning: { type: 'number' },
                            soundEnabled: { type: 'boolean' },
                            vibrationEnabled: { type: 'boolean' },
                            keepScreenOn: { type: 'boolean' },
                            defaultWeightUnit: { type: 'string', enum: ['kg', 'lbs'] },
                            defaultDistanceUnit: { type: 'string', enum: ['km', 'miles'] },
                            showProgressPhotos: { type: 'boolean' },
                            autoLogWorkouts: { type: 'boolean' }
                        }
                    },
                    appearance: {
                        type: 'object',
                        properties: {
                            theme: { type: 'string', enum: ['light', 'dark', 'auto'] },
                            primaryColor: { type: 'string' },
                            accentColor: { type: 'string' },
                            fontSize: { type: 'string', enum: ['small', 'medium', 'large'] },
                            showAnimations: { type: 'boolean' },
                            compactMode: { type: 'boolean' },
                            showAvatarEverywhere: { type: 'boolean' }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Configurações atualizadas', data: request.body };
    });
    fastify.post('/reset', {
        schema: {
            description: 'Reseta as configurações para os valores padrão',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    sections: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['notifications', 'privacy', 'workout', 'appearance', 'all']
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Configurações resetadas', data: request.body };
    });
    fastify.delete('/', {
        schema: {
            description: 'Deleta todas as configurações personalizadas do usuário',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Configurações deletadas', userId: request.user?._id };
    });
    fastify.get('/notifications', {
        schema: {
            description: 'Obtém configurações de notificação',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Configurações de notificação', userId: request.user?._id };
    });
    fastify.put('/notifications', {
        schema: {
            description: 'Atualiza configurações de notificação',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    enabled: { type: 'boolean' },
                    workoutReminders: { type: 'boolean' },
                    goalDeadlines: { type: 'boolean' },
                    achievementUnlocked: { type: 'boolean' },
                    weeklyProgress: { type: 'boolean' },
                    dailyTips: { type: 'boolean' },
                    socialUpdates: { type: 'boolean' },
                    systemUpdates: { type: 'boolean' },
                    quietHours: {
                        type: 'object',
                        properties: {
                            enabled: { type: 'boolean' },
                            startTime: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' },
                            endTime: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' }
                        }
                    },
                    sound: { type: 'boolean' },
                    vibration: { type: 'boolean' },
                    email: { type: 'boolean' },
                    push: { type: 'boolean' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Configurações de notificação atualizadas', data: request.body };
    });
    fastify.get('/backup', {
        schema: {
            description: 'Obtém configurações de backup',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Configurações de backup', userId: request.user?._id };
    });
    fastify.put('/backup', {
        schema: {
            description: 'Atualiza configurações de backup',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    autoBackup: { type: 'boolean' },
                    backupFrequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
                    includePhotos: { type: 'boolean' },
                    cloudProvider: { type: 'string', enum: ['google', 'icloud', 'dropbox'] }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Configurações de backup atualizadas', data: request.body };
    });
    fastify.get('/integrations', {
        schema: {
            description: 'Lista todas as integrações disponíveis e seus status',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return { message: 'Lista de integrações', userId: request.user?._id };
    });
    fastify.put('/integrations/:service', {
        schema: {
            description: 'Configura uma integração específica',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['service'],
                properties: {
                    service: { type: 'string', enum: ['googleFit', 'healthKit', 'myFitnessPal', 'strava'] }
                }
            },
            body: {
                type: 'object',
                properties: {
                    enabled: { type: 'boolean' },
                    syncWeight: { type: 'boolean' },
                    syncWorkouts: { type: 'boolean' },
                    username: { type: 'string' },
                    accessToken: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { service } = request.params;
        return { message: 'Integração configurada', service, data: request.body };
    });
    fastify.post('/integrations/:service/sync', {
        schema: {
            description: 'Força sincronização com um serviço externo',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                required: ['service'],
                properties: {
                    service: { type: 'string', enum: ['googleFit', 'healthKit', 'myFitnessPal', 'strava'] }
                }
            }
        }
    }, async (request, reply) => {
        const { service } = request.params;
        return { message: 'Sincronização iniciada', service, syncStartedAt: new Date() };
    });
    fastify.get('/export', {
        schema: {
            description: 'Exporta todos os dados do usuário',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    format: { type: 'string', enum: ['json', 'csv', 'xml'], default: 'json' },
                    includeMedia: { type: 'boolean', default: false },
                    sections: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['workouts', 'measurements', 'goals', 'shopping', 'gallery', 'settings']
                        }
                    },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Dados exportados', userId: request.user?._id, query: request.query };
    });
    fastify.post('/import', {
        schema: {
            description: 'Importa dados do usuário',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            consumes: ['multipart/form-data'],
            body: {
                type: 'object',
                properties: {
                    format: { type: 'string', enum: ['json', 'csv'] },
                    overwriteExisting: { type: 'boolean', default: false },
                    sections: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['workouts', 'measurements', 'goals', 'shopping', 'settings']
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Dados importados', data: request.body };
    });
    fastify.get('/app-config', {
        schema: {
            description: 'Obtém configurações públicas da aplicação',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return {
            message: 'Configurações da aplicação',
            config: {
                version: '1.0.0',
                features: {
                    chatGPT: true,
                    socialSharing: true,
                    cloudBackup: false
                },
                limits: {
                    maxPhotosPerUser: 1000,
                    maxGoalsPerUser: 50,
                    maxFileSize: 10485760
                }
            }
        };
    });
    fastify.post('/clear-cache', {
        schema: {
            description: 'Limpa o cache do usuário',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    sections: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['images', 'videos', 'workouts', 'all']
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Cache limpo', data: request.body };
    });
    fastify.delete('/clear-data', {
        schema: {
            description: 'Limpa dados específicos do usuário',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['sections'],
                properties: {
                    sections: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['workouts', 'measurements', 'goals', 'shopping', 'gallery', 'logs']
                        }
                    },
                    confirmPassword: { type: 'string', minLength: 6 }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Dados limpos', data: request.body };
    });
    fastify.post('/feedback', {
        schema: {
            description: 'Envia feedback sobre a aplicação',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['type', 'message'],
                properties: {
                    type: { type: 'string', enum: ['bug', 'feature', 'improvement', 'general'] },
                    message: { type: 'string', minLength: 10, maxLength: 2000 },
                    rating: { type: 'integer', minimum: 1, maximum: 5 },
                    includeSystemInfo: { type: 'boolean', default: true },
                    contactEmail: { type: 'string', format: 'email' }
                }
            }
        }
    }, async (request, reply) => {
        return { message: 'Feedback enviado', data: request.body };
    });
    fastify.get('/about', {
        schema: {
            description: 'Obtém informações sobre a aplicação',
            tags: ['Configurações'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        return {
            message: 'Informações da aplicação',
            about: {
                version: '1.0.0',
                buildNumber: 1,
                releaseDate: '2024-01-01',
                developer: 'Paulo Neto',
                website: 'https://fitness-app.com',
                support: 'support@fitness-app.com',
                privacy: 'https://fitness-app.com/privacy',
                terms: 'https://fitness-app.com/terms'
            }
        };
    });
}
//# sourceMappingURL=settingsRoutes.js.map