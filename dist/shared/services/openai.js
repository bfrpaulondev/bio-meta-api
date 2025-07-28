"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiService = void 0;
const openai_1 = __importDefault(require("openai"));
const environment_1 = require("@config/environment");
const openai = new openai_1.default({
    apiKey: environment_1.config.openai.apiKey,
    baseURL: environment_1.config.openai.baseUrl
});
class OpenAIService {
    constructor() {
        this.systemPrompts = {
            fitnessCoach: `Você é um personal trainer e nutricionista especializado, com vasta experiência em fitness e bem-estar. 
    Suas respostas devem ser:
    - Baseadas em evidências científicas
    - Personalizadas para o perfil do usuário
    - Práticas e aplicáveis
    - Motivacionais e encorajadoras
    - Seguras (sempre recomendar consulta médica quando necessário)
    
    Sempre considere:
    - Nível de condicionamento físico atual
    - Limitações e lesões
    - Objetivos específicos
    - Tempo disponível
    - Equipamentos disponíveis`,
            nutritionist: `Você é um nutricionista especializado em nutrição esportiva e emagrecimento saudável.
    Suas recomendações devem ser:
    - Baseadas em ciência nutricional
    - Personalizadas para objetivos específicos
    - Práticas para o dia a dia
    - Considerando restrições alimentares
    - Focadas em sustentabilidade a longo prazo
    
    Sempre inclua:
    - Macronutrientes adequados
    - Timing de nutrientes
    - Hidratação
    - Suplementação quando apropriada`,
            motivationalCoach: `Você é um coach motivacional especializado em mudança de hábitos e psicologia do exercício.
    Suas mensagens devem ser:
    - Inspiradoras e positivas
    - Focadas em progresso, não perfeição
    - Baseadas em psicologia comportamental
    - Personalizadas para o momento do usuário
    - Práticas para superar obstáculos`
        };
    }
    async generateFitnessInsight(request) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: this.systemPrompts.fitnessCoach
                },
                {
                    role: 'user',
                    content: this.buildFitnessInsightPrompt(request)
                }
            ];
            const response = await openai.chat.completions.create({
                model: environment_1.config.openai.model,
                messages,
                max_tokens: environment_1.config.openai.maxTokens,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            });
            return response.choices[0]?.message?.content || 'Não foi possível gerar insights no momento.';
        }
        catch (error) {
            console.error('Erro ao gerar insight fitness:', error);
            throw new Error('Falha ao gerar insights personalizados');
        }
    }
    async generateWorkoutRecommendation(request) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: this.systemPrompts.fitnessCoach
                },
                {
                    role: 'user',
                    content: this.buildWorkoutRecommendationPrompt(request)
                }
            ];
            const response = await openai.chat.completions.create({
                model: environment_1.config.openai.model,
                messages,
                max_tokens: environment_1.config.openai.maxTokens,
                temperature: 0.6,
                presence_penalty: 0.2
            });
            return response.choices[0]?.message?.content || 'Não foi possível gerar recomendação de treino.';
        }
        catch (error) {
            console.error('Erro ao gerar recomendação de treino:', error);
            throw new Error('Falha ao gerar recomendação de treino');
        }
    }
    async generateNutritionAdvice(request) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: this.systemPrompts.nutritionist
                },
                {
                    role: 'user',
                    content: this.buildNutritionAdvicePrompt(request)
                }
            ];
            const response = await openai.chat.completions.create({
                model: environment_1.config.openai.model,
                messages,
                max_tokens: environment_1.config.openai.maxTokens,
                temperature: 0.5,
                presence_penalty: 0.1
            });
            return response.choices[0]?.message?.content || 'Não foi possível gerar conselhos nutricionais.';
        }
        catch (error) {
            console.error('Erro ao gerar conselho nutricional:', error);
            throw new Error('Falha ao gerar conselhos nutricionais');
        }
    }
    async generateMotivationalMessage(userContext) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: this.systemPrompts.motivationalCoach
                },
                {
                    role: 'user',
                    content: this.buildMotivationalPrompt(userContext)
                }
            ];
            const response = await openai.chat.completions.create({
                model: environment_1.config.openai.model,
                messages,
                max_tokens: 200,
                temperature: 0.8,
                presence_penalty: 0.3
            });
            return response.choices[0]?.message?.content || 'Continue firme na sua jornada! Cada passo conta.';
        }
        catch (error) {
            console.error('Erro ao gerar mensagem motivacional:', error);
            throw new Error('Falha ao gerar mensagem motivacional');
        }
    }
    async generateDailyTip(category) {
        try {
            const prompts = {
                fitness: 'Gere uma dica prática de exercício ou treino para hoje, focada em técnica, segurança ou eficiência.',
                nutrition: 'Gere uma dica nutricional prática para hoje, focada em alimentação saudável e sustentável.',
                motivation: 'Gere uma mensagem motivacional inspiradora para manter o foco nos objetivos de fitness.',
                health: 'Gere uma dica de saúde geral relacionada a bem-estar, sono, hidratação ou recuperação.'
            };
            const messages = [
                {
                    role: 'system',
                    content: 'Você é um especialista em fitness e bem-estar. Gere dicas curtas, práticas e aplicáveis.'
                },
                {
                    role: 'user',
                    content: prompts[category]
                }
            ];
            const response = await openai.chat.completions.create({
                model: environment_1.config.openai.model,
                messages,
                max_tokens: 150,
                temperature: 0.7
            });
            return response.choices[0]?.message?.content || 'Mantenha-se ativo e hidratado hoje!';
        }
        catch (error) {
            console.error('Erro ao gerar dica diária:', error);
            throw new Error('Falha ao gerar dica diária');
        }
    }
    async analyzeProgressAndGoals(progressData) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: `Você é um analista de performance fitness. Analise os dados de progresso e forneça:
          - Análise do progresso atual
          - Identificação de padrões
          - Sugestões de ajustes
          - Próximos passos recomendados`
                },
                {
                    role: 'user',
                    content: `Analise estes dados de progresso: ${JSON.stringify(progressData, null, 2)}`
                }
            ];
            const response = await openai.chat.completions.create({
                model: environment_1.config.openai.model,
                messages,
                max_tokens: environment_1.config.openai.maxTokens,
                temperature: 0.4
            });
            return response.choices[0]?.message?.content || 'Análise não disponível no momento.';
        }
        catch (error) {
            console.error('Erro ao analisar progresso:', error);
            throw new Error('Falha ao analisar progresso');
        }
    }
    buildFitnessInsightPrompt(request) {
        const { userProfile, recentData, question, context } = request;
        let prompt = `Perfil do usuário:
    - Idade: ${userProfile.age || 'não informado'}
    - Gênero: ${userProfile.gender || 'não informado'}
    - Peso: ${userProfile.weight || 'não informado'}kg
    - Altura: ${userProfile.height || 'não informado'}cm
    - Nível de atividade: ${userProfile.activityLevel || 'não informado'}
    - Objetivos: ${userProfile.fitnessGoals?.join(', ') || 'não informado'}
    
    Dados recentes:
    - Treinos: ${recentData.workouts?.length || 0} treinos recentes
    - Medidas: ${recentData.measurements?.length || 0} medições recentes
    - Metas: ${recentData.goals?.length || 0} metas ativas
    `;
        if (question) {
            prompt += `\nPergunta específica: ${question}`;
        }
        if (context) {
            prompt += `\nContexto adicional: ${context}`;
        }
        prompt += `\nGere insights personalizados, sugestões práticas e recomendações baseadas nestes dados. 
    Seja específico, motivacional e focado em resultados práticos.`;
        return prompt;
    }
    buildWorkoutRecommendationPrompt(request) {
        const { userProfile, preferences } = request;
        return `Crie uma recomendação de treino personalizada:
    
    Perfil:
    - Nível: ${userProfile.fitnessLevel}
    - Tempo disponível: ${userProfile.availableTime} minutos
    - Equipamentos: ${userProfile.equipment.join(', ')}
    - Grupos musculares preferidos: ${userProfile.muscleGroups?.join(', ') || 'todos'}
    - Lesões/limitações: ${userProfile.injuries?.join(', ') || 'nenhuma'}
    
    Preferências:
    - Tipo de treino: ${preferences.workoutType}
    - Intensidade: ${preferences.intensity}
    
    Forneça:
    1. Estrutura do treino
    2. Exercícios específicos com séries/repetições
    3. Tempo de descanso
    4. Dicas de execução
    5. Progressão sugerida`;
    }
    buildNutritionAdvicePrompt(request) {
        const { userProfile, goals, currentMeals } = request;
        return `Forneça conselhos nutricionais personalizados:
    
    Perfil:
    - Idade: ${userProfile.age || 'não informado'}
    - Peso: ${userProfile.weight || 'não informado'}kg
    - Altura: ${userProfile.height || 'não informado'}cm
    - Nível de atividade: ${userProfile.activityLevel || 'não informado'}
    - Restrições: ${userProfile.dietaryRestrictions?.join(', ') || 'nenhuma'}
    - Alergias: ${userProfile.allergies?.join(', ') || 'nenhuma'}
    
    Objetivos:
    - Tipo: ${goals.type}
    - Calorias alvo: ${goals.targetCalories || 'não definido'}
    
    ${currentMeals ? `Refeições atuais: ${JSON.stringify(currentMeals)}` : ''}
    
    Forneça:
    1. Distribuição de macronutrientes
    2. Sugestões de refeições
    3. Timing nutricional
    4. Hidratação
    5. Suplementação (se apropriada)`;
    }
    buildMotivationalPrompt(userContext) {
        return `Gere uma mensagem motivacional personalizada baseada no contexto:
    ${JSON.stringify(userContext, null, 2)}
    
    A mensagem deve ser:
    - Inspiradora e positiva
    - Específica para a situação atual
    - Focada em progresso e crescimento
    - Prática com próximos passos
    - Máximo 100 palavras`;
    }
}
exports.openaiService = new OpenAIService();
//# sourceMappingURL=openai.js.map