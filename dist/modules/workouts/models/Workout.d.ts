import mongoose from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';
export declare enum ExerciseType {
    STRENGTH = "strength",
    CARDIO = "cardio",
    FLEXIBILITY = "flexibility",
    BALANCE = "balance",
    SPORTS = "sports"
}
export declare enum MuscleGroup {
    CHEST = "chest",
    BACK = "back",
    SHOULDERS = "shoulders",
    BICEPS = "biceps",
    TRICEPS = "triceps",
    FOREARMS = "forearms",
    ABS = "abs",
    LEGS = "legs",
    GLUTES = "glutes",
    CALVES = "calves",
    FULL_BODY = "full_body"
}
export declare enum DifficultyLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert"
}
export interface Exercise {
    name: string;
    description?: string;
    instructions?: string[];
    muscleGroups: MuscleGroup[];
    type: ExerciseType;
    difficulty: DifficultyLevel;
    equipment?: string[];
    videoUrl?: string;
    imageUrl?: string;
    duration?: number;
    sets?: number;
    reps?: number;
    weight?: number;
    restTime?: number;
    notes?: string;
}
export interface WorkoutSession {
    exerciseId: string;
    sets: {
        reps: number;
        weight?: number;
        duration?: number;
        restTime?: number;
        notes?: string;
        completedAt: Date;
    }[];
    totalDuration: number;
    caloriesBurned?: number;
    notes?: string;
}
export interface Workout extends UserOwnedDocument {
    name: string;
    description?: string;
    exercises: Exercise[];
    estimatedDuration: number;
    difficulty: DifficultyLevel;
    muscleGroups: MuscleGroup[];
    tags?: string[];
    isTemplate: boolean;
    isPublic: boolean;
    isFavorite: boolean;
    timesCompleted: number;
    averageRating?: number;
    createdBy?: string;
}
export interface WorkoutLog extends UserOwnedDocument {
    workoutId: string;
    workoutName: string;
    sessions: WorkoutSession[];
    startTime: Date;
    endTime?: Date;
    totalDuration: number;
    totalCaloriesBurned?: number;
    notes?: string;
    rating?: number;
    completed: boolean;
}
export declare const WorkoutModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Workout & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const WorkoutLogModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, WorkoutLog & mongoose.Document<unknown, any, any, Record<string, any>>>;
//# sourceMappingURL=Workout.d.ts.map