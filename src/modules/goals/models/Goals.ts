import mongoose, { Schema, Document } from 'mongoose';
import { UserOwnedDocument, NotificationType } from '@shared/types/common';

export enum GoalType {
  WEIGHT_LOSS = 'weight_loss',
  WEIGHT_GAIN = 'weight_gain',
  MUSCLE_GAIN = 'muscle_gain',
  STRENGTH = 'strength',
  ENDURANCE = 'endurance',
  FLEXIBILITY = 'flexibility',
  BODY_FAT = 'body_fat',
  FINANCIAL = 'financial',
  HABIT = 'habit',
  CUSTOM = 'custom'
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export enum GoalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ReminderFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export interface Milestone {
  title: string;
  description?: string;
  targetValue?: number;
  targetDate?: Date;
  completed: boolean;
  completedAt?: Date;
  reward?: string;
  notes?: string;
}

export interface GoalProgress {
  date: Date;
  value: number;
  notes?: string;
  attachments?: string[]; // URLs de fotos/documentos
}

export interface FitnessGoal extends UserOwnedDocument {
  title: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  priority: GoalPriority;
  startValue?: number;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate: Date;
  targetDate?: Date;
  completedAt?: Date;
  progress: GoalProgress[];
  milestones: Milestone[];
  tags?: string[];
  isPublic: boolean;
  motivationalQuote?: string;
  reward?: string;
  notes?: string;
  relatedWorkouts?: string[]; // IDs de treinos relacionados
  relatedMeasurements?: string[]; // IDs de medições relacionadas
}

export interface Reminder extends UserOwnedDocument {
  title: string;
  message: string;
  type: NotificationType;
  frequency: ReminderFrequency;
  customFrequency?: {
    interval: number; // número
    unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  };
  scheduledTime: {
    hour: number; // 0-23
    minute: number; // 0-59
    daysOfWeek?: number[]; // 0-6 (domingo = 0)
    dayOfMonth?: number; // 1-31
  };
  isActive: boolean;
  lastSent?: Date;
  nextScheduled?: Date;
  goalId?: string; // referência para meta relacionada
  workoutId?: string; // referência para treino relacionado
  settings: {
    pushNotification: boolean;
    email: boolean;
    sound: boolean;
    vibration: boolean;
  };
}

export interface Tip extends UserOwnedDocument {
  title: string;
  content: string;
  category: 'fitness' | 'nutrition' | 'motivation' | 'health' | 'lifestyle';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  imageUrl?: string;
  videoUrl?: string;
  source?: string;
  isActive: boolean;
  likes: number;
  views: number;
  userInteractions?: {
    liked: boolean;
    bookmarked: boolean;
    shared: boolean;
  };
}

export interface Achievement extends UserOwnedDocument {
  title: string;
  description: string;
  icon?: string;
  category: 'workout' | 'goal' | 'streak' | 'milestone' | 'social' | 'special';
  criteria: {
    type: string; // 'workout_count', 'goal_completed', 'streak_days', etc.
    value: number;
    unit?: string;
  };
  unlockedAt: Date;
  isPublic: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number; // pontos ganhos
  relatedGoalId?: string;
  relatedWorkoutId?: string;
}

export interface UserStats extends UserOwnedDocument {
  totalWorkouts: number;
  totalWorkoutTime: number; // em segundos
  goalsCompleted: number;
  currentStreak: number; // dias consecutivos
  longestStreak: number;
  totalPoints: number;
  level: number;
  achievements: string[]; // IDs dos achievements
  weeklyStats: {
    week: Date; // início da semana
    workouts: number;
    workoutTime: number;
    goalsProgress: number;
  }[];
  monthlyStats: {
    month: Date; // início do mês
    workouts: number;
    workoutTime: number;
    goalsCompleted: number;
    weightChange?: number;
  }[];
  lastUpdated: Date;
}

const milestoneSchema = new Schema<Milestone>({
  title: { type: String, required: true },
  description: String,
  targetValue: Number,
  targetDate: Date,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  reward: String,
  notes: String
});

const goalProgressSchema = new Schema<GoalProgress>({
  date: { type: Date, required: true },
  value: { type: Number, required: true },
  notes: String,
  attachments: [String]
});

const fitnessGoalSchema = new Schema<FitnessGoal>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: Object.values(GoalType), required: true },
  status: { type: String, enum: Object.values(GoalStatus), default: GoalStatus.ACTIVE },
  priority: { type: String, enum: Object.values(GoalPriority), default: GoalPriority.MEDIUM },
  startValue: Number,
  targetValue: Number,
  currentValue: Number,
  unit: String,
  startDate: { type: Date, required: true },
  targetDate: Date,
  completedAt: Date,
  progress: [goalProgressSchema],
  milestones: [milestoneSchema],
  tags: [String],
  isPublic: { type: Boolean, default: false },
  motivationalQuote: String,
  reward: String,
  notes: String,
  relatedWorkouts: [String],
  relatedMeasurements: [String]
}, {
  timestamps: true
});

const reminderSchema = new Schema<Reminder>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: Object.values(NotificationType), default: NotificationType.INFO },
  frequency: { type: String, enum: Object.values(ReminderFrequency), required: true },
  customFrequency: {
    interval: Number,
    unit: { type: String, enum: ['minutes', 'hours', 'days', 'weeks', 'months'] }
  },
  scheduledTime: {
    hour: { type: Number, required: true, min: 0, max: 23 },
    minute: { type: Number, required: true, min: 0, max: 59 },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }],
    dayOfMonth: { type: Number, min: 1, max: 31 }
  },
  isActive: { type: Boolean, default: true },
  lastSent: Date,
  nextScheduled: Date,
  goalId: String,
  workoutId: String,
  settings: {
    pushNotification: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sound: { type: Boolean, default: true },
    vibration: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

const tipSchema = new Schema<Tip>({
  userId: { type: String, index: true }, // pode ser null para dicas do sistema
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['fitness', 'nutrition', 'motivation', 'health', 'lifestyle'], 
    required: true 
  },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  tags: [String],
  imageUrl: String,
  videoUrl: String,
  source: String,
  isActive: { type: Boolean, default: true },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  userInteractions: {
    liked: { type: Boolean, default: false },
    bookmarked: { type: Boolean, default: false },
    shared: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

const achievementSchema = new Schema<Achievement>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: String,
  category: { 
    type: String, 
    enum: ['workout', 'goal', 'streak', 'milestone', 'social', 'special'], 
    required: true 
  },
  criteria: {
    type: { type: String, required: true },
    value: { type: Number, required: true },
    unit: String
  },
  unlockedAt: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: true },
  rarity: { 
    type: String, 
    enum: ['common', 'rare', 'epic', 'legendary'], 
    default: 'common' 
  },
  points: { type: Number, default: 0 },
  relatedGoalId: String,
  relatedWorkoutId: String
}, {
  timestamps: true
});

const userStatsSchema = new Schema<UserStats>({
  userId: { type: String, required: true, unique: true, index: true },
  totalWorkouts: { type: Number, default: 0 },
  totalWorkoutTime: { type: Number, default: 0 },
  goalsCompleted: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  achievements: [String],
  weeklyStats: [{
    week: { type: Date, required: true },
    workouts: { type: Number, default: 0 },
    workoutTime: { type: Number, default: 0 },
    goalsProgress: { type: Number, default: 0 }
  }],
  monthlyStats: [{
    month: { type: Date, required: true },
    workouts: { type: Number, default: 0 },
    workoutTime: { type: Number, default: 0 },
    goalsCompleted: { type: Number, default: 0 },
    weightChange: Number
  }],
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Middleware para calcular próximo agendamento de lembrete
reminderSchema.pre('save', function(next) {
  if (this.isActive && this.frequency) {
    // Lógica para calcular nextScheduled baseado na frequência
    const now = new Date();
    const nextScheduled = new Date();
    
    switch (this.frequency) {
      case ReminderFrequency.DAILY:
        nextScheduled.setDate(now.getDate() + 1);
        break;
      case ReminderFrequency.WEEKLY:
        nextScheduled.setDate(now.getDate() + 7);
        break;
      case ReminderFrequency.MONTHLY:
        nextScheduled.setMonth(now.getMonth() + 1);
        break;
    }
    
    nextScheduled.setHours(this.scheduledTime.hour);
    nextScheduled.setMinutes(this.scheduledTime.minute);
    nextScheduled.setSeconds(0);
    nextScheduled.setMilliseconds(0);
    
    this.nextScheduled = nextScheduled;
  }
  next();
});

// Índices
fitnessGoalSchema.index({ userId: 1, type: 1 });
fitnessGoalSchema.index({ userId: 1, status: 1 });
fitnessGoalSchema.index({ userId: 1, priority: 1 });
fitnessGoalSchema.index({ userId: 1, targetDate: 1 });
fitnessGoalSchema.index({ tags: 1 });

reminderSchema.index({ userId: 1, isActive: 1 });
reminderSchema.index({ userId: 1, nextScheduled: 1 });
reminderSchema.index({ goalId: 1 });

tipSchema.index({ category: 1 });
tipSchema.index({ tags: 1 });
tipSchema.index({ isActive: 1 });

achievementSchema.index({ userId: 1, category: 1 });
achievementSchema.index({ userId: 1, unlockedAt: -1 });

export const FitnessGoalModel = mongoose.model<FitnessGoal & Document>('FitnessGoal', fitnessGoalSchema);
export const ReminderModel = mongoose.model<Reminder & Document>('Reminder', reminderSchema);
export const TipModel = mongoose.model<Tip & Document>('Tip', tipSchema);
export const AchievementModel = mongoose.model<Achievement & Document>('Achievement', achievementSchema);
export const UserStatsModel = mongoose.model<UserStats & Document>('UserStats', userStatsSchema);

