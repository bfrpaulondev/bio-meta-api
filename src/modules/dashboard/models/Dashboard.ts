import mongoose, { Schema, Document } from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';

export interface DashboardWidget {
  id: string;
  type: 'weight_chart' | 'goal_progress' | 'next_workout' | 'calories' | 'daily_tip' | 'shopping_alert' | 'measurements' | 'achievements' | 'streak' | 'quick_actions';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isVisible: boolean;
  settings?: Record<string, any>;
}

export interface DashboardLayout extends UserOwnedDocument {
  name: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  theme?: string;
  lastUsed: Date;
}

export interface DashboardStats extends UserOwnedDocument {
  date: Date; // data do dia
  
  // Estatísticas de peso
  currentWeight?: number;
  weightChange?: number; // mudança desde ontem
  weeklyWeightChange?: number;
  monthlyWeightChange?: number;
  
  // Estatísticas de treino
  workoutsToday: number;
  workoutTimeToday: number; // em segundos
  weeklyWorkouts: number;
  weeklyWorkoutTime: number;
  monthlyWorkouts: number;
  monthlyWorkoutTime: number;
  
  // Estatísticas de metas
  activeGoals: number;
  completedGoalsToday: number;
  completedGoalsWeek: number;
  completedGoalsMonth: number;
  overallGoalProgress: number; // percentual médio
  
  // Estatísticas de calorias
  caloriesConsumed?: number;
  caloriesBurned?: number;
  caloriesNet?: number;
  dailyCalorieGoal?: number;
  
  // Estatísticas de medidas
  latestMeasurements?: {
    type: string;
    value: number;
    unit: string;
    date: Date;
  }[];
  
  // Streak e conquistas
  currentStreak: number;
  longestStreak: number;
  newAchievements: number;
  totalPoints: number;
  
  // Estatísticas financeiras
  monthlySpending?: number;
  budgetRemaining?: number;
  averageItemPrice?: number;
  
  // Próximos eventos
  nextWorkout?: {
    id: string;
    name: string;
    scheduledTime: Date;
    estimatedDuration: number;
  };
  upcomingGoalDeadlines?: {
    id: string;
    title: string;
    deadline: Date;
    progress: number;
  }[];
  
  // Alertas e notificações
  alerts: {
    type: 'goal_deadline' | 'workout_reminder' | 'measurement_due' | 'shopping_item' | 'achievement';
    message: string;
    priority: 'low' | 'medium' | 'high';
    actionRequired: boolean;
    relatedId?: string;
  }[];
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  action: 'start_workout' | 'add_measurement' | 'log_meal' | 'add_shopping_item' | 'view_progress' | 'custom';
  customUrl?: string;
  isVisible: boolean;
  order: number;
}

export interface DashboardPreferences extends UserOwnedDocument {
  defaultLayout: string; // ID do layout padrão
  quickActions: QuickAction[];
  
  // Preferências de widgets
  widgetSettings: {
    weightChart: {
      period: 'week' | 'month' | 'quarter' | 'year';
      showTrendLine: boolean;
      showGoalLine: boolean;
    };
    goalProgress: {
      showOnlyActive: boolean;
      sortBy: 'priority' | 'deadline' | 'progress';
      maxItems: number;
    };
    calorieTracker: {
      showNet: boolean;
      showBreakdown: boolean;
      includeExercise: boolean;
    };
    nextWorkout: {
      showDetails: boolean;
      autoStart: boolean;
    };
  };
  
  // Configurações de notificações do dashboard
  notifications: {
    showGoalDeadlines: boolean;
    showWorkoutReminders: boolean;
    showAchievements: boolean;
    showWeightChanges: boolean;
    showShoppingAlerts: boolean;
  };
  
  // Configurações de aparência
  appearance: {
    compactMode: boolean;
    showAnimations: boolean;
    cardStyle: 'flat' | 'elevated' | 'outlined';
    colorScheme: 'auto' | 'light' | 'dark';
  };
  
  lastUpdated: Date;
}

const dashboardWidgetSchema = new Schema<DashboardWidget>({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['weight_chart', 'goal_progress', 'next_workout', 'calories', 'daily_tip', 'shopping_alert', 'measurements', 'achievements', 'streak', 'quick_actions'],
    required: true 
  },
  title: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  isVisible: { type: Boolean, default: true },
  settings: { type: Schema.Types.Mixed }
});

const dashboardLayoutSchema = new Schema<DashboardLayout>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  widgets: [dashboardWidgetSchema],
  theme: String,
  lastUsed: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const dashboardStatsSchema = new Schema<DashboardStats>({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  
  // Peso
  currentWeight: Number,
  weightChange: Number,
  weeklyWeightChange: Number,
  monthlyWeightChange: Number,
  
  // Treinos
  workoutsToday: { type: Number, default: 0 },
  workoutTimeToday: { type: Number, default: 0 },
  weeklyWorkouts: { type: Number, default: 0 },
  weeklyWorkoutTime: { type: Number, default: 0 },
  monthlyWorkouts: { type: Number, default: 0 },
  monthlyWorkoutTime: { type: Number, default: 0 },
  
  // Metas
  activeGoals: { type: Number, default: 0 },
  completedGoalsToday: { type: Number, default: 0 },
  completedGoalsWeek: { type: Number, default: 0 },
  completedGoalsMonth: { type: Number, default: 0 },
  overallGoalProgress: { type: Number, default: 0 },
  
  // Calorias
  caloriesConsumed: Number,
  caloriesBurned: Number,
  caloriesNet: Number,
  dailyCalorieGoal: Number,
  
  // Medidas
  latestMeasurements: [{
    type: String,
    value: Number,
    unit: String,
    date: Date
  }],
  
  // Streak
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  newAchievements: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  
  // Financeiro
  monthlySpending: Number,
  budgetRemaining: Number,
  averageItemPrice: Number,
  
  // Próximos eventos
  nextWorkout: {
    id: String,
    name: String,
    scheduledTime: Date,
    estimatedDuration: Number
  },
  upcomingGoalDeadlines: [{
    id: String,
    title: String,
    deadline: Date,
    progress: Number
  }],
  
  // Alertas
  alerts: [{
    type: { 
      type: String, 
      enum: ['goal_deadline', 'workout_reminder', 'measurement_due', 'shopping_item', 'achievement'],
      required: true 
    },
    message: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    actionRequired: { type: Boolean, default: false },
    relatedId: String
  }]
}, {
  timestamps: true
});

const quickActionSchema = new Schema<QuickAction>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  action: { 
    type: String, 
    enum: ['start_workout', 'add_measurement', 'log_meal', 'add_shopping_item', 'view_progress', 'custom'],
    required: true 
  },
  customUrl: String,
  isVisible: { type: Boolean, default: true },
  order: { type: Number, required: true }
});

const dashboardPreferencesSchema = new Schema<DashboardPreferences>({
  userId: { type: String, required: true, unique: true, index: true },
  defaultLayout: String,
  quickActions: [quickActionSchema],
  
  widgetSettings: {
    weightChart: {
      period: { type: String, enum: ['week', 'month', 'quarter', 'year'], default: 'month' },
      showTrendLine: { type: Boolean, default: true },
      showGoalLine: { type: Boolean, default: true }
    },
    goalProgress: {
      showOnlyActive: { type: Boolean, default: true },
      sortBy: { type: String, enum: ['priority', 'deadline', 'progress'], default: 'priority' },
      maxItems: { type: Number, default: 5 }
    },
    calorieTracker: {
      showNet: { type: Boolean, default: true },
      showBreakdown: { type: Boolean, default: false },
      includeExercise: { type: Boolean, default: true }
    },
    nextWorkout: {
      showDetails: { type: Boolean, default: true },
      autoStart: { type: Boolean, default: false }
    }
  },
  
  notifications: {
    showGoalDeadlines: { type: Boolean, default: true },
    showWorkoutReminders: { type: Boolean, default: true },
    showAchievements: { type: Boolean, default: true },
    showWeightChanges: { type: Boolean, default: true },
    showShoppingAlerts: { type: Boolean, default: true }
  },
  
  appearance: {
    compactMode: { type: Boolean, default: false },
    showAnimations: { type: Boolean, default: true },
    cardStyle: { type: String, enum: ['flat', 'elevated', 'outlined'], default: 'elevated' },
    colorScheme: { type: String, enum: ['auto', 'light', 'dark'], default: 'auto' }
  },
  
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Middleware para garantir que apenas um layout seja padrão por usuário
dashboardLayoutSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Índices
dashboardLayoutSchema.index({ userId: 1, isDefault: 1 });
dashboardLayoutSchema.index({ userId: 1, lastUsed: -1 });

dashboardStatsSchema.index({ userId: 1, date: -1 });

export const DashboardLayoutModel = mongoose.model<DashboardLayout & Document>('DashboardLayout', dashboardLayoutSchema);
export const DashboardStatsModel = mongoose.model<DashboardStats & Document>('DashboardStats', dashboardStatsSchema);
export const DashboardPreferencesModel = mongoose.model<DashboardPreferences & Document>('DashboardPreferences', dashboardPreferencesSchema);

