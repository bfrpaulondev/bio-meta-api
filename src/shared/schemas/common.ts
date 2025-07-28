import { Type, Static } from '@sinclair/typebox';

// Esquemas de resposta padrão
export const SuccessResponseSchema = Type.Object({
  success: Type.Boolean({ default: true }),
  message: Type.String(),
  data: Type.Optional(Type.Any())
});

export const ErrorResponseSchema = Type.Object({
  success: Type.Boolean({ default: false }),
  error: Type.String(),
  code: Type.String(),
  details: Type.Optional(Type.Any())
});

export const PaginationQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 10 })),
  search: Type.Optional(Type.String())
});

export const PaginatedResponseSchema = Type.Object({
  success: Type.Boolean({ default: true }),
  data: Type.Array(Type.Any()),
  pagination: Type.Object({
    page: Type.Integer(),
    limit: Type.Integer(),
    total: Type.Integer(),
    totalPages: Type.Integer(),
    hasNext: Type.Boolean(),
    hasPrev: Type.Boolean()
  })
});

// Esquemas de autenticação
export const LoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 })
});

export const RegisterSchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 100 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  confirmPassword: Type.String({ minLength: 6 }),
  acceptTerms: Type.Boolean({ const: true })
});

export const TokenResponseSchema = Type.Object({
  success: Type.Boolean({ default: true }),
  data: Type.Object({
    accessToken: Type.String(),
    refreshToken: Type.String(),
    expiresIn: Type.Integer(),
    user: Type.Object({
      id: Type.String(),
      name: Type.String(),
      email: Type.String(),
      avatar: Type.Optional(Type.String()),
      isEmailVerified: Type.Boolean(),
      createdAt: Type.String({ format: 'date-time' })
    })
  })
});

// Esquemas de usuário
export const UserProfileSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  avatar: Type.Optional(Type.String()),
  bio: Type.Optional(Type.String()),
  dateOfBirth: Type.Optional(Type.String({ format: 'date' })),
  gender: Type.Optional(Type.Union([
    Type.Literal('male'),
    Type.Literal('female'),
    Type.Literal('other')
  ])),
  height: Type.Optional(Type.Number()),
  activityLevel: Type.Optional(Type.Union([
    Type.Literal('sedentary'),
    Type.Literal('lightly_active'),
    Type.Literal('moderately_active'),
    Type.Literal('very_active'),
    Type.Literal('extremely_active')
  ])),
  fitnessGoals: Type.Optional(Type.Array(Type.String())),
  isEmailVerified: Type.Boolean(),
  isPhoneVerified: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
});

// Esquemas de treino
export const ExerciseSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  description: Type.Optional(Type.String({ maxLength: 500 })),
  instructions: Type.Optional(Type.Array(Type.String())),
  muscleGroups: Type.Array(Type.String()),
  type: Type.Union([
    Type.Literal('strength'),
    Type.Literal('cardio'),
    Type.Literal('flexibility'),
    Type.Literal('balance'),
    Type.Literal('sports')
  ]),
  difficulty: Type.Union([
    Type.Literal('beginner'),
    Type.Literal('intermediate'),
    Type.Literal('advanced'),
    Type.Literal('expert')
  ]),
  equipment: Type.Optional(Type.Array(Type.String())),
  videoUrl: Type.Optional(Type.String()),
  imageUrl: Type.Optional(Type.String()),
  duration: Type.Optional(Type.Number()),
  sets: Type.Optional(Type.Number()),
  reps: Type.Optional(Type.Number()),
  weight: Type.Optional(Type.Number()),
  restTime: Type.Optional(Type.Number()),
  notes: Type.Optional(Type.String())
});

export const WorkoutSchema = Type.Object({
  id: Type.Optional(Type.String()),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  description: Type.Optional(Type.String({ maxLength: 500 })),
  exercises: Type.Array(ExerciseSchema),
  estimatedDuration: Type.Number({ minimum: 1 }),
  difficulty: Type.Union([
    Type.Literal('beginner'),
    Type.Literal('intermediate'),
    Type.Literal('advanced'),
    Type.Literal('expert')
  ]),
  muscleGroups: Type.Array(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
  isTemplate: Type.Optional(Type.Boolean({ default: false })),
  isPublic: Type.Optional(Type.Boolean({ default: false })),
  isFavorite: Type.Optional(Type.Boolean({ default: false })),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
});

// Esquemas de medidas
export const MeasurementSchema = Type.Object({
  type: Type.Union([
    Type.Literal('weight'),
    Type.Literal('height'),
    Type.Literal('waist'),
    Type.Literal('chest'),
    Type.Literal('arm'),
    Type.Literal('thigh'),
    Type.Literal('neck'),
    Type.Literal('hip'),
    Type.Literal('forearm'),
    Type.Literal('calf'),
    Type.Literal('body_fat'),
    Type.Literal('muscle_mass'),
    Type.Literal('bone_mass'),
    Type.Literal('water_percentage'),
    Type.Literal('visceral_fat')
  ]),
  value: Type.Number({ minimum: 0 }),
  unit: Type.String({ minLength: 1, maxLength: 10 }),
  notes: Type.Optional(Type.String({ maxLength: 500 })),
  measuredAt: Type.Optional(Type.String({ format: 'date-time' }))
});

// Esquemas de metas
export const GoalSchema = Type.Object({
  id: Type.Optional(Type.String()),
  title: Type.String({ minLength: 1, maxLength: 100 }),
  description: Type.Optional(Type.String({ maxLength: 500 })),
  type: Type.Union([
    Type.Literal('weight_loss'),
    Type.Literal('weight_gain'),
    Type.Literal('muscle_gain'),
    Type.Literal('strength'),
    Type.Literal('endurance'),
    Type.Literal('flexibility'),
    Type.Literal('body_fat'),
    Type.Literal('financial'),
    Type.Literal('habit'),
    Type.Literal('custom')
  ]),
  priority: Type.Optional(Type.Union([
    Type.Literal('low'),
    Type.Literal('medium'),
    Type.Literal('high'),
    Type.Literal('critical')
  ])),
  status: Type.Optional(Type.Union([
    Type.Literal('active'),
    Type.Literal('completed'),
    Type.Literal('paused'),
    Type.Literal('cancelled'),
    Type.Literal('overdue')
  ])),
  startValue: Type.Optional(Type.Number({ minimum: 0 })),
  targetValue: Type.Optional(Type.Number({ minimum: 0 })),
  currentValue: Type.Optional(Type.Number({ minimum: 0 })),
  unit: Type.Optional(Type.String({ maxLength: 20 })),
  startDate: Type.String({ format: 'date' }),
  targetDate: Type.Optional(Type.String({ format: 'date' })),
  progress: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
  tags: Type.Optional(Type.Array(Type.String())),
  isPublic: Type.Optional(Type.Boolean({ default: false })),
  motivationalQuote: Type.Optional(Type.String({ maxLength: 200 })),
  reward: Type.Optional(Type.String({ maxLength: 200 })),
  notes: Type.Optional(Type.String({ maxLength: 1000 })),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
});

// Esquemas de configurações
export const NotificationSettingsSchema = Type.Object({
  enabled: Type.Optional(Type.Boolean({ default: true })),
  workoutReminders: Type.Optional(Type.Boolean({ default: true })),
  goalDeadlines: Type.Optional(Type.Boolean({ default: true })),
  achievementUnlocked: Type.Optional(Type.Boolean({ default: true })),
  weeklyProgress: Type.Optional(Type.Boolean({ default: true })),
  dailyTips: Type.Optional(Type.Boolean({ default: true })),
  socialUpdates: Type.Optional(Type.Boolean({ default: false })),
  systemUpdates: Type.Optional(Type.Boolean({ default: true })),
  quietHours: Type.Optional(Type.Object({
    enabled: Type.Boolean({ default: false }),
    startTime: Type.String({ pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' }),
    endTime: Type.String({ pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' })
  })),
  sound: Type.Optional(Type.Boolean({ default: true })),
  vibration: Type.Optional(Type.Boolean({ default: true })),
  email: Type.Optional(Type.Boolean({ default: false })),
  push: Type.Optional(Type.Boolean({ default: true }))
});

// Tipos TypeScript derivados dos esquemas
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

