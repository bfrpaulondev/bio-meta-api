import mongoose, { Schema, Document } from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';

export enum TimerType {
  WORKOUT = 'workout',
  REST = 'rest',
  EXERCISE = 'exercise',
  SET = 'set',
  INTERVAL = 'interval',
  CUSTOM = 'custom'
}

export enum TimerStatus {
  STOPPED = 'stopped',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

export interface TimerSession extends UserOwnedDocument {
  name?: string;
  type: TimerType;
  workoutId?: string; // referência para treino
  exerciseId?: string; // referência para exercício
  duration: number; // duração total em segundos
  elapsedTime: number; // tempo decorrido em segundos
  status: TimerStatus;
  startTime?: Date;
  endTime?: Date;
  pausedTime?: number; // tempo total pausado em segundos
  intervals?: {
    name?: string;
    duration: number;
    type: 'work' | 'rest';
    completed: boolean;
    startTime?: Date;
    endTime?: Date;
  }[];
  currentInterval?: number; // índice do intervalo atual
  notes?: string;
  settings: {
    autoStart: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    countdownWarning: number; // segundos antes do fim para avisar
  };
}

export interface WorkoutTimer extends UserOwnedDocument {
  workoutId: string;
  workoutName: string;
  totalDuration: number; // duração total planejada em segundos
  actualDuration: number; // duração real em segundos
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: {
      setNumber: number;
      duration: number; // duração do set em segundos
      restDuration: number; // duração do descanso em segundos
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
  date: Date; // data do dia
  totalWorkoutTime: number; // tempo total de treino em segundos
  totalRestTime: number; // tempo total de descanso em segundos
  workoutSessions: number; // número de sessões de treino
  averageWorkoutDuration: number; // duração média dos treinos
  longestWorkout: number; // treino mais longo em segundos
  shortestWorkout: number; // treino mais curto em segundos
  exercisesCompleted: number; // número de exercícios completados
  setsCompleted: number; // número de sets completados
  caloriesBurned?: number; // calorias queimadas estimadas
}

const timerSessionSchema = new Schema<TimerSession>({
  userId: { type: String, required: true, index: true },
  name: String,
  type: { type: String, enum: Object.values(TimerType), required: true },
  workoutId: String,
  exerciseId: String,
  duration: { type: Number, required: true, min: 0 },
  elapsedTime: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: Object.values(TimerStatus), default: TimerStatus.STOPPED },
  startTime: Date,
  endTime: Date,
  pausedTime: { type: Number, default: 0 },
  intervals: [{
    name: String,
    duration: { type: Number, required: true },
    type: { type: String, enum: ['work', 'rest'], required: true },
    completed: { type: Boolean, default: false },
    startTime: Date,
    endTime: Date
  }],
  currentInterval: { type: Number, default: 0 },
  notes: String,
  settings: {
    autoStart: { type: Boolean, default: false },
    soundEnabled: { type: Boolean, default: true },
    vibrationEnabled: { type: Boolean, default: true },
    countdownWarning: { type: Number, default: 10 }
  }
}, {
  timestamps: true
});

const workoutTimerSchema = new Schema<WorkoutTimer>({
  userId: { type: String, required: true, index: true },
  workoutId: { type: String, required: true },
  workoutName: { type: String, required: true },
  totalDuration: { type: Number, required: true },
  actualDuration: { type: Number, default: 0 },
  exercises: [{
    exerciseId: { type: String, required: true },
    exerciseName: { type: String, required: true },
    sets: [{
      setNumber: { type: Number, required: true },
      duration: { type: Number, required: true },
      restDuration: { type: Number, default: 0 },
      weight: Number,
      reps: Number,
      notes: String,
      startTime: { type: Date, required: true },
      endTime: Date
    }],
    totalDuration: { type: Number, default: 0 }
  }],
  startTime: { type: Date, required: true },
  endTime: Date,
  status: { type: String, enum: Object.values(TimerStatus), default: TimerStatus.STOPPED },
  pausedDurations: [{
    startTime: { type: Date, required: true },
    endTime: Date,
    duration: Number
  }],
  totalPausedTime: { type: Number, default: 0 },
  notes: String
}, {
  timestamps: true
});

const timerTemplateSchema = new Schema<TimerTemplate>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: Object.values(TimerType), required: true },
  duration: { type: Number, required: true, min: 0 },
  intervals: [{
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    type: { type: String, enum: ['work', 'rest'], required: true }
  }],
  settings: {
    autoStart: { type: Boolean, default: false },
    soundEnabled: { type: Boolean, default: true },
    vibrationEnabled: { type: Boolean, default: true },
    countdownWarning: { type: Number, default: 10 }
  },
  isPublic: { type: Boolean, default: false },
  timesUsed: { type: Number, default: 0 },
  tags: [String]
}, {
  timestamps: true
});

const timerStatsSchema = new Schema<TimerStats>({
  userId: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  totalWorkoutTime: { type: Number, default: 0 },
  totalRestTime: { type: Number, default: 0 },
  workoutSessions: { type: Number, default: 0 },
  averageWorkoutDuration: { type: Number, default: 0 },
  longestWorkout: { type: Number, default: 0 },
  shortestWorkout: { type: Number, default: 0 },
  exercisesCompleted: { type: Number, default: 0 },
  setsCompleted: { type: Number, default: 0 },
  caloriesBurned: Number
}, {
  timestamps: true
});

// Middleware para calcular duração real quando o timer termina
workoutTimerSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.actualDuration = Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 1000) - this.totalPausedTime;
  }
  
  // Calcular duração total dos exercícios
  this.exercises.forEach(exercise => {
    exercise.totalDuration = exercise.sets.reduce((total, set) => {
      if (set.endTime && set.startTime) {
        return total + Math.floor((set.endTime.getTime() - set.startTime.getTime()) / 1000);
      }
      return total;
    }, 0);
  });
  
  next();
});

// Índices
timerSessionSchema.index({ userId: 1, type: 1 });
timerSessionSchema.index({ userId: 1, status: 1 });
timerSessionSchema.index({ userId: 1, createdAt: -1 });
timerSessionSchema.index({ workoutId: 1 });

workoutTimerSchema.index({ userId: 1, workoutId: 1 });
workoutTimerSchema.index({ userId: 1, status: 1 });
workoutTimerSchema.index({ userId: 1, startTime: -1 });

timerTemplateSchema.index({ userId: 1, type: 1 });
timerTemplateSchema.index({ userId: 1, isPublic: 1 });
timerTemplateSchema.index({ tags: 1 });

timerStatsSchema.index({ userId: 1, date: -1 });

export const TimerSessionModel = mongoose.model<TimerSession & Document>('TimerSession', timerSessionSchema);
export const WorkoutTimerModel = mongoose.model<WorkoutTimer & Document>('WorkoutTimer', workoutTimerSchema);
export const TimerTemplateModel = mongoose.model<TimerTemplate & Document>('TimerTemplate', timerTemplateSchema);
export const TimerStatsModel = mongoose.model<TimerStats & Document>('TimerStats', timerStatsSchema);

