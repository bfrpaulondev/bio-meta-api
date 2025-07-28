import mongoose from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';
export declare enum TimerType {
    WORKOUT = "workout",
    REST = "rest",
    EXERCISE = "exercise",
    SET = "set",
    INTERVAL = "interval",
    CUSTOM = "custom"
}
export declare enum TimerStatus {
    STOPPED = "stopped",
    RUNNING = "running",
    PAUSED = "paused",
    COMPLETED = "completed"
}
export interface TimerSession extends UserOwnedDocument {
    name?: string;
    type: TimerType;
    workoutId?: string;
    exerciseId?: string;
    duration: number;
    elapsedTime: number;
    status: TimerStatus;
    startTime?: Date;
    endTime?: Date;
    pausedTime?: number;
    intervals?: {
        name?: string;
        duration: number;
        type: 'work' | 'rest';
        completed: boolean;
        startTime?: Date;
        endTime?: Date;
    }[];
    currentInterval?: number;
    notes?: string;
    settings: {
        autoStart: boolean;
        soundEnabled: boolean;
        vibrationEnabled: boolean;
        countdownWarning: number;
    };
}
export interface WorkoutTimer extends UserOwnedDocument {
    workoutId: string;
    workoutName: string;
    totalDuration: number;
    actualDuration: number;
    exercises: {
        exerciseId: string;
        exerciseName: string;
        sets: {
            setNumber: number;
            duration: number;
            restDuration: number;
            weight?: number;
            reps?: number;
            notes?: string;
            startTime: Date;
            endTime?: Date;
        }[];
        totalDuration: number;
    }[];
    startTime: Date;
    endTime?: Date;
    status: TimerStatus;
    pausedDurations: {
        startTime: Date;
        endTime?: Date;
        duration?: number;
    }[];
    totalPausedTime: number;
    notes?: string;
}
export interface TimerTemplate extends UserOwnedDocument {
    name: string;
    description?: string;
    type: TimerType;
    duration: number;
    intervals?: {
        name: string;
        duration: number;
        type: 'work' | 'rest';
    }[];
    settings: {
        autoStart: boolean;
        soundEnabled: boolean;
        vibrationEnabled: boolean;
        countdownWarning: number;
    };
    isPublic: boolean;
    timesUsed: number;
    tags?: string[];
}
export interface TimerStats extends UserOwnedDocument {
    date: Date;
    totalWorkoutTime: number;
    totalRestTime: number;
    workoutSessions: number;
    averageWorkoutDuration: number;
    longestWorkout: number;
    shortestWorkout: number;
    exercisesCompleted: number;
    setsCompleted: number;
    caloriesBurned?: number;
}
export declare const TimerSessionModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, TimerSession & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const WorkoutTimerModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, WorkoutTimer & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const TimerTemplateModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, TimerTemplate & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const TimerStatsModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, TimerStats & mongoose.Document<unknown, any, any, Record<string, any>>>;
//# sourceMappingURL=Timer.d.ts.map