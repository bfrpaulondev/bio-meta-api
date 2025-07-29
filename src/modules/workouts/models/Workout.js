import mongoose, { Schema, Document } from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';

export enum ExerciseType {
  STRENGTH = 'strength',
  CARDIO = 'cardio',
  FLEXIBILITY = 'flexibility',
  BALANCE = 'balance',
  SPORTS = 'sports'
}

export enum MuscleGroup {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  BICEPS = 'biceps',
  TRICEPS = 'triceps',
  FOREARMS = 'forearms',
  ABS = 'abs',
  LEGS = 'legs',
  GLUTES = 'glutes',
  CALVES = 'calves',
  FULL_BODY = 'full_body'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
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
  duration?: number; // em segundos para exercícios de tempo
  sets?: number;
  reps?: number;
  weight?: number; // em kg
  restTime?: number; // em segundos
  notes?: string;
}

export interface WorkoutSession {
  exerciseId: string;
  sets: {
    reps: number;
    weight?: number;
    duration?: number; // para exercícios de tempo
    restTime?: number;
    notes?: string;
    completedAt: Date;
  }[];
  totalDuration: number; // duração total do exercício em segundos
  caloriesBurned?: number;
  notes?: string;
}

export interface Workout extends UserOwnedDocument {
  name: string;
  description?: string;
  exercises: Exercise[];
  estimatedDuration: number; // em minutos
  difficulty: DifficultyLevel;
  muscleGroups: MuscleGroup[];
  tags?: string[];
  isTemplate: boolean;
  isPublic: boolean;
  isFavorite: boolean;
  timesCompleted: number;
  averageRating?: number;
  createdBy?: string; // ID do usuário que criou (para templates públicos)
}

export interface WorkoutLog extends UserOwnedDocument {
  workoutId: string;
  workoutName: string;
  sessions: WorkoutSession[];
  startTime: Date;
  endTime?: Date;
  totalDuration: number; // em segundos
  totalCaloriesBurned?: number;
  notes?: string;
  rating?: number; // 1-5
  completed: boolean;
}

const exerciseSchema = new Schema<Exercise>({
  name: { type: String, required: true },
  description: String,
  instructions: [String],
  muscleGroups: [{ type: String, enum: Object.values(MuscleGroup) }],
  type: { type: String, enum: Object.values(ExerciseType), required: true },
  difficulty: { type: String, enum: Object.values(DifficultyLevel), required: true },
  equipment: [String],
  videoUrl: String,
  imageUrl: String,
  duration: Number,
  sets: Number,
  reps: Number,
  weight: Number,
  restTime: Number,
  notes: String
});

const workoutSchema = new Schema<Workout>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  exercises: [exerciseSchema],
  estimatedDuration: { type: Number, required: true },
  difficulty: { type: String, enum: Object.values(DifficultyLevel), required: true },
  muscleGroups: [{ type: String, enum: Object.values(MuscleGroup) }],
  tags: [String],
  isTemplate: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  timesCompleted: { type: Number, default: 0 },
  averageRating: Number,
  createdBy: String
}, {
  timestamps: true
});

const workoutLogSchema = new Schema<WorkoutLog>({
  userId: { type: String, required: true, index: true },
  workoutId: { type: String, required: true },
  workoutName: { type: String, required: true },
  sessions: [{
    exerciseId: { type: String, required: true },
    sets: [{
      reps: Number,
      weight: Number,
      duration: Number,
      restTime: Number,
      notes: String,
      completedAt: { type: Date, default: Date.now }
    }],
    totalDuration: Number,
    caloriesBurned: Number,
    notes: String
  }],
  startTime: { type: Date, required: true },
  endTime: Date,
  totalDuration: { type: Number, default: 0 },
  totalCaloriesBurned: Number,
  notes: String,
  rating: { type: Number, min: 1, max: 5 },
  completed: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Índices
workoutSchema.index({ userId: 1, name: 1 });
workoutSchema.index({ muscleGroups: 1 });
workoutSchema.index({ difficulty: 1 });
workoutSchema.index({ isTemplate: 1, isPublic: 1 });
workoutSchema.index({ tags: 1 });

workoutLogSchema.index({ userId: 1, workoutId: 1 });
workoutLogSchema.index({ startTime: -1 });
workoutLogSchema.index({ completed: 1 });

export const WorkoutModel = mongoose.model<Workout & Document>('Workout', workoutSchema);
export const WorkoutLogModel = mongoose.model<WorkoutLog & Document>('WorkoutLog', workoutLogSchema);

