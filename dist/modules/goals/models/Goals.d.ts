import mongoose from 'mongoose';
import { UserOwnedDocument, NotificationType } from '@shared/types/common';
export declare enum GoalType {
    WEIGHT_LOSS = "weight_loss",
    WEIGHT_GAIN = "weight_gain",
    MUSCLE_GAIN = "muscle_gain",
    STRENGTH = "strength",
    ENDURANCE = "endurance",
    FLEXIBILITY = "flexibility",
    BODY_FAT = "body_fat",
    FINANCIAL = "financial",
    HABIT = "habit",
    CUSTOM = "custom"
}
export declare enum GoalStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    PAUSED = "paused",
    CANCELLED = "cancelled",
    OVERDUE = "overdue"
}
export declare enum GoalPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum ReminderFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    CUSTOM = "custom"
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
    attachments?: string[];
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
    relatedWorkouts?: string[];
    relatedMeasurements?: string[];
}
export interface Reminder extends UserOwnedDocument {
    title: string;
    message: string;
    type: NotificationType;
    frequency: ReminderFrequency;
    customFrequency?: {
        interval: number;
        unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
    };
    scheduledTime: {
        hour: number;
        minute: number;
        daysOfWeek?: number[];
        dayOfMonth?: number;
    };
    isActive: boolean;
    lastSent?: Date;
    nextScheduled?: Date;
    goalId?: string;
    workoutId?: string;
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
        type: string;
        value: number;
        unit?: string;
    };
    unlockedAt: Date;
    isPublic: boolean;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    points: number;
    relatedGoalId?: string;
    relatedWorkoutId?: string;
}
export interface UserStats extends UserOwnedDocument {
    totalWorkouts: number;
    totalWorkoutTime: number;
    goalsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    totalPoints: number;
    level: number;
    achievements: string[];
    weeklyStats: {
        week: Date;
        workouts: number;
        workoutTime: number;
        goalsProgress: number;
    }[];
    monthlyStats: {
        month: Date;
        workouts: number;
        workoutTime: number;
        goalsCompleted: number;
        weightChange?: number;
    }[];
    lastUpdated: Date;
}
export declare const FitnessGoalModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, FitnessGoal & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const ReminderModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Reminder & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const TipModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Tip & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const AchievementModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Achievement & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const UserStatsModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, UserStats & mongoose.Document<unknown, any, any, Record<string, any>>>;
//# sourceMappingURL=Goals.d.ts.map