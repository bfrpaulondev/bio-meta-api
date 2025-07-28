export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface FitnessInsightRequest {
    userProfile: {
        age?: number;
        gender?: string;
        weight?: number;
        height?: number;
        activityLevel?: string;
        fitnessGoals?: string[];
    };
    recentData: {
        workouts?: any[];
        measurements?: any[];
        goals?: any[];
        nutrition?: any[];
    };
    question?: string;
    context?: string;
}
export interface WorkoutRecommendationRequest {
    userProfile: {
        fitnessLevel: string;
        availableTime: number;
        equipment: string[];
        muscleGroups?: string[];
        injuries?: string[];
    };
    preferences: {
        workoutType: string;
        intensity: string;
    };
}
export interface NutritionAdviceRequest {
    userProfile: {
        age?: number;
        weight?: number;
        height?: number;
        activityLevel?: string;
        dietaryRestrictions?: string[];
        allergies?: string[];
    };
    goals: {
        type: string;
        targetCalories?: number;
    };
    currentMeals?: any[];
}
declare class OpenAIService {
    private systemPrompts;
    generateFitnessInsight(request: FitnessInsightRequest): Promise<string>;
    generateWorkoutRecommendation(request: WorkoutRecommendationRequest): Promise<string>;
    generateNutritionAdvice(request: NutritionAdviceRequest): Promise<string>;
    generateMotivationalMessage(userContext: any): Promise<string>;
    generateDailyTip(category: 'fitness' | 'nutrition' | 'motivation' | 'health'): Promise<string>;
    analyzeProgressAndGoals(progressData: any): Promise<string>;
    private buildFitnessInsightPrompt;
    private buildWorkoutRecommendationPrompt;
    private buildNutritionAdvicePrompt;
    private buildMotivationalPrompt;
}
export declare const openaiService: OpenAIService;
export {};
//# sourceMappingURL=openai.d.ts.map