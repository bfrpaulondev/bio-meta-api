import { Static } from '@sinclair/typebox';
export declare const SuccessResponseSchema: import("@sinclair/typebox").TObject<{
    success: import("@sinclair/typebox").TBoolean;
    message: import("@sinclair/typebox").TString;
    data: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TAny>;
}>;
export declare const ErrorResponseSchema: import("@sinclair/typebox").TObject<{
    success: import("@sinclair/typebox").TBoolean;
    error: import("@sinclair/typebox").TString;
    code: import("@sinclair/typebox").TString;
    details: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TAny>;
}>;
export declare const PaginationQuerySchema: import("@sinclair/typebox").TObject<{
    page: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const PaginatedResponseSchema: import("@sinclair/typebox").TObject<{
    success: import("@sinclair/typebox").TBoolean;
    data: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TAny>;
    pagination: import("@sinclair/typebox").TObject<{
        page: import("@sinclair/typebox").TInteger;
        limit: import("@sinclair/typebox").TInteger;
        total: import("@sinclair/typebox").TInteger;
        totalPages: import("@sinclair/typebox").TInteger;
        hasNext: import("@sinclair/typebox").TBoolean;
        hasPrev: import("@sinclair/typebox").TBoolean;
    }>;
}>;
export declare const LoginSchema: import("@sinclair/typebox").TObject<{
    email: import("@sinclair/typebox").TString;
    password: import("@sinclair/typebox").TString;
}>;
export declare const RegisterSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
    password: import("@sinclair/typebox").TString;
    confirmPassword: import("@sinclair/typebox").TString;
    acceptTerms: import("@sinclair/typebox").TBoolean;
}>;
export declare const TokenResponseSchema: import("@sinclair/typebox").TObject<{
    success: import("@sinclair/typebox").TBoolean;
    data: import("@sinclair/typebox").TObject<{
        accessToken: import("@sinclair/typebox").TString;
        refreshToken: import("@sinclair/typebox").TString;
        expiresIn: import("@sinclair/typebox").TInteger;
        user: import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TString;
            email: import("@sinclair/typebox").TString;
            avatar: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isEmailVerified: import("@sinclair/typebox").TBoolean;
            createdAt: import("@sinclair/typebox").TString;
        }>;
    }>;
}>;
export declare const UserProfileSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
    avatar: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    bio: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    dateOfBirth: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    gender: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"male">, import("@sinclair/typebox").TLiteral<"female">, import("@sinclair/typebox").TLiteral<"other">]>>;
    height: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    activityLevel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"sedentary">, import("@sinclair/typebox").TLiteral<"lightly_active">, import("@sinclair/typebox").TLiteral<"moderately_active">, import("@sinclair/typebox").TLiteral<"very_active">, import("@sinclair/typebox").TLiteral<"extremely_active">]>>;
    fitnessGoals: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
    isEmailVerified: import("@sinclair/typebox").TBoolean;
    isPhoneVerified: import("@sinclair/typebox").TBoolean;
    createdAt: import("@sinclair/typebox").TString;
    updatedAt: import("@sinclair/typebox").TString;
}>;
export declare const ExerciseSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    instructions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
    muscleGroups: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"strength">, import("@sinclair/typebox").TLiteral<"cardio">, import("@sinclair/typebox").TLiteral<"flexibility">, import("@sinclair/typebox").TLiteral<"balance">, import("@sinclair/typebox").TLiteral<"sports">]>;
    difficulty: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"beginner">, import("@sinclair/typebox").TLiteral<"intermediate">, import("@sinclair/typebox").TLiteral<"advanced">, import("@sinclair/typebox").TLiteral<"expert">]>;
    equipment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
    videoUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    imageUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    duration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    sets: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    reps: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    restTime: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const WorkoutSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    exercises: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        instructions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        muscleGroups: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"strength">, import("@sinclair/typebox").TLiteral<"cardio">, import("@sinclair/typebox").TLiteral<"flexibility">, import("@sinclair/typebox").TLiteral<"balance">, import("@sinclair/typebox").TLiteral<"sports">]>;
        difficulty: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"beginner">, import("@sinclair/typebox").TLiteral<"intermediate">, import("@sinclair/typebox").TLiteral<"advanced">, import("@sinclair/typebox").TLiteral<"expert">]>;
        equipment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        videoUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        imageUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        duration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        sets: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        reps: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        restTime: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
    estimatedDuration: import("@sinclair/typebox").TNumber;
    difficulty: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"beginner">, import("@sinclair/typebox").TLiteral<"intermediate">, import("@sinclair/typebox").TLiteral<"advanced">, import("@sinclair/typebox").TLiteral<"expert">]>;
    muscleGroups: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    tags: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
    isTemplate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    isFavorite: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const MeasurementSchema: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"weight">, import("@sinclair/typebox").TLiteral<"height">, import("@sinclair/typebox").TLiteral<"waist">, import("@sinclair/typebox").TLiteral<"chest">, import("@sinclair/typebox").TLiteral<"arm">, import("@sinclair/typebox").TLiteral<"thigh">, import("@sinclair/typebox").TLiteral<"neck">, import("@sinclair/typebox").TLiteral<"hip">, import("@sinclair/typebox").TLiteral<"forearm">, import("@sinclair/typebox").TLiteral<"calf">, import("@sinclair/typebox").TLiteral<"body_fat">, import("@sinclair/typebox").TLiteral<"muscle_mass">, import("@sinclair/typebox").TLiteral<"bone_mass">, import("@sinclair/typebox").TLiteral<"water_percentage">, import("@sinclair/typebox").TLiteral<"visceral_fat">]>;
    value: import("@sinclair/typebox").TNumber;
    unit: import("@sinclair/typebox").TString;
    notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    measuredAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const GoalSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    title: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"weight_loss">, import("@sinclair/typebox").TLiteral<"weight_gain">, import("@sinclair/typebox").TLiteral<"muscle_gain">, import("@sinclair/typebox").TLiteral<"strength">, import("@sinclair/typebox").TLiteral<"endurance">, import("@sinclair/typebox").TLiteral<"flexibility">, import("@sinclair/typebox").TLiteral<"body_fat">, import("@sinclair/typebox").TLiteral<"financial">, import("@sinclair/typebox").TLiteral<"habit">, import("@sinclair/typebox").TLiteral<"custom">]>;
    priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"low">, import("@sinclair/typebox").TLiteral<"medium">, import("@sinclair/typebox").TLiteral<"high">, import("@sinclair/typebox").TLiteral<"critical">]>>;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"active">, import("@sinclair/typebox").TLiteral<"completed">, import("@sinclair/typebox").TLiteral<"paused">, import("@sinclair/typebox").TLiteral<"cancelled">, import("@sinclair/typebox").TLiteral<"overdue">]>>;
    startValue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    targetValue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    currentValue: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    unit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    startDate: import("@sinclair/typebox").TString;
    targetDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    progress: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    tags: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
    isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    motivationalQuote: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    reward: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    updatedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const NotificationSettingsSchema: import("@sinclair/typebox").TObject<{
    enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    workoutReminders: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    goalDeadlines: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    achievementUnlocked: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    weeklyProgress: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    dailyTips: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    socialUpdates: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    systemUpdates: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    quietHours: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        enabled: import("@sinclair/typebox").TBoolean;
        startTime: import("@sinclair/typebox").TString;
        endTime: import("@sinclair/typebox").TString;
    }>>;
    sound: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    vibration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    email: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    push: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
export type SuccessResponse = Static<typeof SuccessResponseSchema>;
export type ErrorResponse = Static<typeof ErrorResponseSchema>;
export type PaginationQuery = Static<typeof PaginationQuerySchema>;
export type PaginatedResponse = Static<typeof PaginatedResponseSchema>;
export type Login = Static<typeof LoginSchema>;
export type Register = Static<typeof RegisterSchema>;
export type TokenResponse = Static<typeof TokenResponseSchema>;
export type UserProfile = Static<typeof UserProfileSchema>;
export type Exercise = Static<typeof ExerciseSchema>;
export type Workout = Static<typeof WorkoutSchema>;
export type Measurement = Static<typeof MeasurementSchema>;
export type Goal = Static<typeof GoalSchema>;
export type NotificationSettings = Static<typeof NotificationSettingsSchema>;
//# sourceMappingURL=common.d.ts.map