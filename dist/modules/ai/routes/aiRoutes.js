"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = aiRoutes;
const auth_1 = require("@shared/middleware/auth");
const openai_1 = require("@shared/services/openai");
async function aiRoutes(fastify) {
    fastify.addHook('preHandler', auth_1.authRequired);
    fastify.post('/insights', {
        schema: {
            description: 'Gera insights personalizados baseados nos dados do usuário',
            tags: ['IA e ChatGPT'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    userProfile: {
                        type: 'object',
                        properties: {
                            age: { type: 'number' },
                            gender: { type: 'string', enum: ['male', 'female', 'other'] },
                            weight: { type: 'number' },
                            height: { type: 'number' },
                            activityLevel: { type: 'string', enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'] },
                            fitnessGoals: { type: 'array', items: { type: 'string' } }
                        }
                    },
                    recentData: {
                        type: 'object',
                        properties: {
                            workouts: { type: 'array' },
                            measurements: { type: 'array' },
                            goals: { type: 'array' },
                            nutrition: { type: 'array' }
                        }
                    },
                    question: { type: 'string', maxLength: 500 },
                    context: { type: 'string', maxLength: 1000 }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: {
                            type: 'object',
                            properties: {
                                insight: { type: 'string' },
                                generatedAt: { type: 'string', format: 'date-time' }
                            }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const insight = await openai_1.openaiService.generateFitnessInsight(request.body);
            return {
                success: true,
                data: {
                    insight,
                    generatedAt: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Falha ao gerar insights',
                code: 'AI_GENERATION_ERROR'
            });
        }
    });
    fastify.post('/workout-recommendation', {
        schema: {
            description: 'Gera recomendação personalizada de treino',
            tags: ['IA e ChatGPT'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['userProfile', 'preferences'],
                properties: {
                    userProfile: {
                        type: 'object',
                        required: ['fitnessLevel', 'availableTime', 'equipment'],
                        properties: {
                            fitnessLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
                            availableTime: { type: 'number', minimum: 10, maximum: 180 },
                            equipment: { type: 'array', items: { type: 'string' } },
                            muscleGroups: { type: 'array', items: { type: 'string' } },
                            injuries: { type: 'array', items: { type: 'string' } }
                        }
                    },
                    preferences: {
                        type: 'object',
                        required: ['workoutType', 'intensity'],
                        properties: {
                            workoutType: { type: 'string', enum: ['strength', 'cardio', 'flexibility', 'mixed', 'sports'] },
                            intensity: { type: 'string', enum: ['low', 'moderate', 'high', 'very_high'] }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const recommendation = await openai_1.openaiService.generateWorkoutRecommendation(request.body);
            return {
                success: true,
                data: {
                    recommendation,
                    generatedAt: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Falha ao gerar recomendação de treino',
                code: 'AI_GENERATION_ERROR'
            });
        }
    });
    fastify.post('/nutrition-advice', {
        schema: {
            description: 'Gera conselhos nutricionais personalizados',
            tags: ['IA e ChatGPT'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['userProfile', 'goals'],
                properties: {
                    userProfile: {
                        type: 'object',
                        properties: {
                            age: { type: 'number' },
                            weight: { type: 'number' },
                            height: { type: 'number' },
                            activityLevel: { type: 'string' },
                            dietaryRestrictions: { type: 'array', items: { type: 'string' } },
                            allergies: { type: 'array', items: { type: 'string' } }
                        }
                    },
                    goals: {
                        type: 'object',
                        required: ['type'],
                        properties: {
                            type: { type: 'string', enum: ['weight_loss', 'muscle_gain', 'maintenance', 'performance'] },
                            targetCalories: { type: 'number', minimum: 1000, maximum: 5000 }
                        }
                    },
                    currentMeals: { type: 'array' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const advice = await openai_1.openaiService.generateNutritionAdvice(request.body);
            return {
                success: true,
                data: {
                    advice,
                    generatedAt: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Falha ao gerar conselhos nutricionais',
                code: 'AI_GENERATION_ERROR'
            });
        }
    });
    fastify.post('/motivational-message', {
        schema: {
            description: 'Gera mensagem motivacional personalizada',
            tags: ['IA e ChatGPT'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                properties: {
                    userContext: {
                        type: 'object',
                        properties: {
                            currentStreak: { type: 'number' },
                            recentAchievements: { type: 'array' },
                            strugglingAreas: { type: 'array', items: { type: 'string' } },
                            mood: { type: 'string', enum: ['motivated', 'neutral', 'struggling', 'discouraged'] },
                            timeOfDay: { type: 'string', enum: ['morning', 'afternoon', 'evening', 'night'] }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const message = await openai_1.openaiService.generateMotivationalMessage(request.body.userContext);
            return {
                success: true,
                data: {
                    message,
                    generatedAt: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Falha ao gerar mensagem motivacional',
                code: 'AI_GENERATION_ERROR'
            });
        }
    });
    fastify.get('/daily-tip', {
        schema: {
            description: 'Obtém dica diária personalizada',
            tags: ['IA e ChatGPT'],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    category: {
                        type: 'string',
                        enum: ['fitness', 'nutrition', 'motivation', 'health'],
                        default: 'fitness'
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { category = 'fitness' } = request.query;
            const tip = await openai_1.openaiService.generateDailyTip(category);
            return {
                success: true,
                data: {
                    tip,
                    category,
                    generatedAt: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Falha ao gerar dica diária',
                code: 'AI_GENERATION_ERROR'
            });
        }
    });
    fastify.post('/analyze-progress', {
        schema: {
            description: 'Analisa progresso e fornece recomendações',
            tags: ['IA e ChatGPT'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['progressData'],
                properties: {
                    progressData: {
                        type: 'object',
                        properties: {
                            timeframe: { type: 'string', enum: ['week', 'month', 'quarter', 'year'] },
                            workoutStats: { type: 'object' },
                            measurementChanges: { type: 'object' },
                            goalProgress: { type: 'object' },
                            nutritionData: { type: 'object' },
                            challenges: { type: 'array', items: { type: 'string' } }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const analysis = await openai_1.openaiService.analyzeProgressAndGoals(request.body.progressData);
            return {
                success: true,
                data: {
                    analysis,
                    generatedAt: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Falha ao analisar progresso',
                code: 'AI_GENERATION_ERROR'
            });
        }
    });
    fastify.post('/chat', {
        schema: {
            description: 'Chat livre com assistente de fitness IA',
            tags: ['IA e ChatGPT'],
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['message'],
                properties: {
                    message: { type: 'string', minLength: 1, maxLength: 1000 },
                    context: { type: 'string', maxLength: 2000 },
                    conversationHistory: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                role: { type: 'string', enum: ['user', 'assistant'] },
                                content: { type: 'string' },
                                timestamp: { type: 'string', format: 'date-time' }
                            }
                        },
                        maxItems: 10
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { message, context, conversationHistory = [] } = request.body;
            const messages = [
                {
                    role: 'system',
                    content: `Você é um assistente pessoal de fitness e bem-estar. Responda de forma útil, motivacional e baseada em evidências científicas. 
          ${context ? `Contexto adicional: ${context}` : ''}`
                },
                ...conversationHistory.slice(-8).map((msg) => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                {
                    role: 'user',
                    content: message
                }
            ];
            const response = await openai_1.openaiService['openai'].chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages,
                max_tokens: 500,
                temperature: 0.7
            });
            const aiResponse = response.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
            return {
                success: true,
                data: {
                    response: aiResponse,
                    generatedAt: new Date().toISOString()
                }
            };
        }
        catch (error) {
            return reply.status(500).send({
                success: false,
                error: 'Falha no chat com IA',
                code: 'AI_CHAT_ERROR'
            });
        }
    });
    fastify.get('/status', {
        schema: {
            description: 'Verifica status da integração com ChatGPT',
            tags: ['IA e ChatGPT'],
            security: [{ bearerAuth: [] }]
        }
    }, async (request, reply) => {
        try {
            const testResponse = await openai_1.openaiService.generateDailyTip('fitness');
            return {
                success: true,
                data: {
                    status: 'operational',
                    model: 'gpt-3.5-turbo',
                    features: [
                        'fitness_insights',
                        'workout_recommendations',
                        'nutrition_advice',
                        'motivational_messages',
                        'daily_tips',
                        'progress_analysis',
                        'free_chat'
                    ],
                    lastTest: new Date().toISOString(),
                    testResult: testResponse ? 'success' : 'failed'
                }
            };
        }
        catch (error) {
            return {
                success: false,
                data: {
                    status: 'error',
                    error: 'Falha na conexão com ChatGPT',
                    lastTest: new Date().toISOString()
                }
            };
        }
    });
}
//# sourceMappingURL=aiRoutes.js.map