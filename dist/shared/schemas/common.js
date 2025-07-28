"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSettingsSchema = exports.GoalSchema = exports.MeasurementSchema = exports.WorkoutSchema = exports.ExerciseSchema = exports.UserProfileSchema = exports.TokenResponseSchema = exports.RegisterSchema = exports.LoginSchema = exports.PaginatedResponseSchema = exports.PaginationQuerySchema = exports.ErrorResponseSchema = exports.SuccessResponseSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.SuccessResponseSchema = typebox_1.Type.Object({
    success: typebox_1.Type.Boolean({ default: true }),
    message: typebox_1.Type.String(),
    data: typebox_1.Type.Optional(typebox_1.Type.Any())
});
exports.ErrorResponseSchema = typebox_1.Type.Object({
    success: typebox_1.Type.Boolean({ default: false }),
    error: typebox_1.Type.String(),
    code: typebox_1.Type.String(),
    details: typebox_1.Type.Optional(typebox_1.Type.Any())
});
exports.PaginationQuerySchema = typebox_1.Type.Object({
    page: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1, default: 1 })),
    limit: typebox_1.Type.Optional(typebox_1.Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
    search: typebox_1.Type.Optional(typebox_1.Type.String())
});
exports.PaginatedResponseSchema = typebox_1.Type.Object({
    success: typebox_1.Type.Boolean({ default: true }),
    data: typebox_1.Type.Array(typebox_1.Type.Any()),
    pagination: typebox_1.Type.Object({
        page: typebox_1.Type.Integer(),
        limit: typebox_1.Type.Integer(),
        total: typebox_1.Type.Integer(),
        totalPages: typebox_1.Type.Integer(),
        hasNext: typebox_1.Type.Boolean(),
        hasPrev: typebox_1.Type.Boolean()
    })
});
exports.LoginSchema = typebox_1.Type.Object({
    email: typebox_1.Type.String({ format: 'email' }),
    password: typebox_1.Type.String({ minLength: 6 })
});
exports.RegisterSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String({ minLength: 2, maxLength: 100 }),
    email: typebox_1.Type.String({ format: 'email' }),
    password: typebox_1.Type.String({ minLength: 6 }),
    confirmPassword: typebox_1.Type.String({ minLength: 6 }),
    acceptTerms: typebox_1.Type.Boolean({ const: true })
});
exports.TokenResponseSchema = typebox_1.Type.Object({
    success: typebox_1.Type.Boolean({ default: true }),
    data: typebox_1.Type.Object({
        accessToken: typebox_1.Type.String(),
        refreshToken: typebox_1.Type.String(),
        expiresIn: typebox_1.Type.Integer(),
        user: typebox_1.Type.Object({
            id: typebox_1.Type.String(),
            name: typebox_1.Type.String(),
            email: typebox_1.Type.String(),
            avatar: typebox_1.Type.Optional(typebox_1.Type.String()),
            isEmailVerified: typebox_1.Type.Boolean(),
            createdAt: typebox_1.Type.String({ format: 'date-time' })
        })
    })
});
exports.UserProfileSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    name: typebox_1.Type.String(),
    email: typebox_1.Type.String({ format: 'email' }),
    avatar: typebox_1.Type.Optional(typebox_1.Type.String()),
    bio: typebox_1.Type.Optional(typebox_1.Type.String()),
    dateOfBirth: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date' })),
    gender: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal('male'),
        typebox_1.Type.Literal('female'),
        typebox_1.Type.Literal('other')
    ])),
    height: typebox_1.Type.Optional(typebox_1.Type.Number()),
    activityLevel: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal('sedentary'),
        typebox_1.Type.Literal('lightly_active'),
        typebox_1.Type.Literal('moderately_active'),
        typebox_1.Type.Literal('very_active'),
        typebox_1.Type.Literal('extremely_active')
    ])),
    fitnessGoals: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    isEmailVerified: typebox_1.Type.Boolean(),
    isPhoneVerified: typebox_1.Type.Boolean(),
    createdAt: typebox_1.Type.String({ format: 'date-time' }),
    updatedAt: typebox_1.Type.String({ format: 'date-time' })
});
exports.ExerciseSchema = typebox_1.Type.Object({
    name: typebox_1.Type.String({ minLength: 1, maxLength: 100 }),
    description: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 500 })),
    instructions: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    muscleGroups: typebox_1.Type.Array(typebox_1.Type.String()),
    type: typebox_1.Type.Union([
        typebox_1.Type.Literal('strength'),
        typebox_1.Type.Literal('cardio'),
        typebox_1.Type.Literal('flexibility'),
        typebox_1.Type.Literal('balance'),
        typebox_1.Type.Literal('sports')
    ]),
    difficulty: typebox_1.Type.Union([
        typebox_1.Type.Literal('beginner'),
        typebox_1.Type.Literal('intermediate'),
        typebox_1.Type.Literal('advanced'),
        typebox_1.Type.Literal('expert')
    ]),
    equipment: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    videoUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    imageUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    duration: typebox_1.Type.Optional(typebox_1.Type.Number()),
    sets: typebox_1.Type.Optional(typebox_1.Type.Number()),
    reps: typebox_1.Type.Optional(typebox_1.Type.Number()),
    weight: typebox_1.Type.Optional(typebox_1.Type.Number()),
    restTime: typebox_1.Type.Optional(typebox_1.Type.Number()),
    notes: typebox_1.Type.Optional(typebox_1.Type.String())
});
exports.WorkoutSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Optional(typebox_1.Type.String()),
    name: typebox_1.Type.String({ minLength: 1, maxLength: 100 }),
    description: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 500 })),
    exercises: typebox_1.Type.Array(exports.ExerciseSchema),
    estimatedDuration: typebox_1.Type.Number({ minimum: 1 }),
    difficulty: typebox_1.Type.Union([
        typebox_1.Type.Literal('beginner'),
        typebox_1.Type.Literal('intermediate'),
        typebox_1.Type.Literal('advanced'),
        typebox_1.Type.Literal('expert')
    ]),
    muscleGroups: typebox_1.Type.Array(typebox_1.Type.String()),
    tags: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    isTemplate: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: false })),
    isPublic: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: false })),
    isFavorite: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: false })),
    createdAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
});
exports.MeasurementSchema = typebox_1.Type.Object({
    type: typebox_1.Type.Union([
        typebox_1.Type.Literal('weight'),
        typebox_1.Type.Literal('height'),
        typebox_1.Type.Literal('waist'),
        typebox_1.Type.Literal('chest'),
        typebox_1.Type.Literal('arm'),
        typebox_1.Type.Literal('thigh'),
        typebox_1.Type.Literal('neck'),
        typebox_1.Type.Literal('hip'),
        typebox_1.Type.Literal('forearm'),
        typebox_1.Type.Literal('calf'),
        typebox_1.Type.Literal('body_fat'),
        typebox_1.Type.Literal('muscle_mass'),
        typebox_1.Type.Literal('bone_mass'),
        typebox_1.Type.Literal('water_percentage'),
        typebox_1.Type.Literal('visceral_fat')
    ]),
    value: typebox_1.Type.Number({ minimum: 0 }),
    unit: typebox_1.Type.String({ minLength: 1, maxLength: 10 }),
    notes: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 500 })),
    measuredAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
});
exports.GoalSchema = typebox_1.Type.Object({
    id: typebox_1.Type.Optional(typebox_1.Type.String()),
    title: typebox_1.Type.String({ minLength: 1, maxLength: 100 }),
    description: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 500 })),
    type: typebox_1.Type.Union([
        typebox_1.Type.Literal('weight_loss'),
        typebox_1.Type.Literal('weight_gain'),
        typebox_1.Type.Literal('muscle_gain'),
        typebox_1.Type.Literal('strength'),
        typebox_1.Type.Literal('endurance'),
        typebox_1.Type.Literal('flexibility'),
        typebox_1.Type.Literal('body_fat'),
        typebox_1.Type.Literal('financial'),
        typebox_1.Type.Literal('habit'),
        typebox_1.Type.Literal('custom')
    ]),
    priority: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal('low'),
        typebox_1.Type.Literal('medium'),
        typebox_1.Type.Literal('high'),
        typebox_1.Type.Literal('critical')
    ])),
    status: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Literal('active'),
        typebox_1.Type.Literal('completed'),
        typebox_1.Type.Literal('paused'),
        typebox_1.Type.Literal('cancelled'),
        typebox_1.Type.Literal('overdue')
    ])),
    startValue: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
    targetValue: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
    currentValue: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
    unit: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 20 })),
    startDate: typebox_1.Type.String({ format: 'date' }),
    targetDate: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date' })),
    progress: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0, maximum: 100 })),
    tags: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    isPublic: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: false })),
    motivationalQuote: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 200 })),
    reward: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 200 })),
    notes: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 1000 })),
    createdAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' })),
    updatedAt: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'date-time' }))
});
exports.NotificationSettingsSchema = typebox_1.Type.Object({
    enabled: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    workoutReminders: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    goalDeadlines: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    achievementUnlocked: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    weeklyProgress: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    dailyTips: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    socialUpdates: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: false })),
    systemUpdates: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    quietHours: typebox_1.Type.Optional(typebox_1.Type.Object({
        enabled: typebox_1.Type.Boolean({ default: false }),
        startTime: typebox_1.Type.String({ pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' }),
        endTime: typebox_1.Type.String({ pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' })
    })),
    sound: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    vibration: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true })),
    email: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: false })),
    push: typebox_1.Type.Optional(typebox_1.Type.Boolean({ default: true }))
});
//# sourceMappingURL=common.js.map