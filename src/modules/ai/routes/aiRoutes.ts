import { FastifyInstance } from 'fastify';
import { authRequired } from '@shared/middleware/auth';
import { openaiService } from '@shared/services/openai';

export async function aiRoutes(fastify: FastifyInstance) {
  // Aplicar autenticação a todas as rotas
  fastify.addHook('preHandler', authRequired);

  // POST /api/ai/insights - Gerar insights personalizados
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
      const insight = await openaiService.generateFitnessInsight(request.body as any);
      
      return {
        success: true,
        data: {
          insight,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Falha ao gerar insights',
        code: 'AI_GENERATION_ERROR'
      });
    }
  });

  // POST /api/ai/workout-recommendation - Recomendar treino
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
      const recommendation = await openaiService.generateWorkoutRecommendation(request.body as any);
      
      return {
        success: true,
        data: {
          recommendation,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Falha ao gerar recomendação de treino',
        code: 'AI_GENERATION_ERROR'
      });
    }
  });

  // POST /api/ai/nutrition-advice - Conselhos nutricionais
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
      const advice = await openaiService.generateNutritionAdvice(request.body as any);
      
      return {
        success: true,
        data: {
          advice,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Falha ao gerar conselhos nutricionais',
        code: 'AI_GENERATION_ERROR'
      });
    }
  });

  // POST /api/ai/motivational-message - Mensagem motivacional
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
      const message = await openaiService.generateMotivationalMessage(request.body.userContext);
      
      return {
        success: true,
        data: {
          message,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Falha ao gerar mensagem motivacional',
        code: 'AI_GENERATION_ERROR'
      });
    }
  });

  // GET /api/ai/daily-tip - Dica diária
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
      const { category = 'fitness' } = request.query as any;
      const tip = await openaiService.generateDailyTip(category);
      
      return {
        success: true,
        data: {
          tip,
          category,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Falha ao gerar dica diária',
        code: 'AI_GENERATION_ERROR'
      });
    }
  });

  // POST /api/ai/analyze-progress - Analisar progresso
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
      const analysis = await openaiService.analyzeProgressAndGoals(request.body.progressData);
      
      return {
        success: true,
        data: {
          analysis,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Falha ao analisar progresso',
        code: 'AI_GENERATION_ERROR'
      });
    }
  });

  // POST /api/ai/chat - Chat livre com IA
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
      const { message, context, conversationHistory = [] } = request.body as any;
      
      // Construir histórico de conversa para o ChatGPT
      const messages = [
        {
          role: 'system' as const,
          content: `Você é um assistente pessoal de fitness e bem-estar. Responda de forma útil, motivacional e baseada em evidências científicas. 
          ${context ? `Contexto adicional: ${context}` : ''}`
        },
        ...conversationHistory.slice(-8).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const response = await openaiService['openai'].chat.completions.create({
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
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Falha no chat com IA',
        code: 'AI_CHAT_ERROR'
      });
    }
  });

  // GET /api/ai/status - Status da integração com IA
  fastify.get('/status', {
    schema: {
      description: 'Verifica status da integração com ChatGPT',
      tags: ['IA e ChatGPT'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      // Teste simples para verificar se a API está funcionando
      const testResponse = await openaiService.generateDailyTip('fitness');
      
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
    } catch (error) {
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

