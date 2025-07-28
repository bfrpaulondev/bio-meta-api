import mongoose from 'mongoose';
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
    date: Date;
    currentWeight?: number;
    weightChange?: number;
    weeklyWeightChange?: number;
    monthlyWeightChange?: number;
    workoutsToday: number;
    workoutTimeToday: number;
    weeklyWorkouts: number;
    weeklyWorkoutTime: number;
    monthlyWorkouts: number;
    monthlyWorkoutTime: number;
    activeGoals: number;
    completedGoalsToday: number;
    completedGoalsWeek: number;
    completedGoalsMonth: number;
    overallGoalProgress: number;
    caloriesConsumed?: number;
    caloriesBurned?: number;
    caloriesNet?: number;
    dailyCalorieGoal?: number;
    latestMeasurements?: {
        type: string;
        value: number;
        unit: string;
        date: Date;
    }[];
    currentStreak: number;
    longestStreak: number;
    newAchievements: number;
    totalPoints: number;
    monthlySpending?: number;
    budgetRemaining?: number;
    averageItemPrice?: number;
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
    defaultLayout: string;
    quickActions: QuickAction[];
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
    notifications: {
        showGoalDeadlines: boolean;
        showWorkoutReminders: boolean;
        showAchievements: boolean;
        showWeightChanges: boolean;
        showShoppingAlerts: boolean;
    };
    appearance: {
        compactMode: boolean;
        showAnimations: boolean;
        cardStyle: 'flat' | 'elevated' | 'outlined';
        colorScheme: 'auto' | 'light' | 'dark';
    };
    lastUpdated: Date;
}
export declare const DashboardLayoutModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, DashboardLayout & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const DashboardStatsModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, DashboardStats & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const DashboardPreferencesModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, DashboardPreferences & mongoose.Document<unknown, any, any, Record<string, any>>>;
//# sourceMappingURL=Dashboard.d.ts.map