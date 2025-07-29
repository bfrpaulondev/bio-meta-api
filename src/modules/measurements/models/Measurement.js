import mongoose, { Schema, Document } from 'mongoose';
import { UserOwnedDocument, HealthMetrics, MeasurementUnit } from '@shared/types/common';

export enum MeasurementType {
  WEIGHT = 'weight',
  HEIGHT = 'height',
  WAIST = 'waist',
  CHEST = 'chest',
  ARM = 'arm',
  THIGH = 'thigh',
  NECK = 'neck',
  HIP = 'hip',
  FOREARM = 'forearm',
  CALF = 'calf',
  BODY_FAT = 'body_fat',
  MUSCLE_MASS = 'muscle_mass',
  BONE_MASS = 'bone_mass',
  WATER_PERCENTAGE = 'water_percentage',
  VISCERAL_FAT = 'visceral_fat'
}

export interface MeasurementEntry {
  type: MeasurementType;
  value: number;
  unit: string; // kg, cm, %, etc.
  notes?: string;
  measuredAt: Date;
}

export interface BodyMeasurement extends UserOwnedDocument {
  measurements: MeasurementEntry[];
  photos?: string[]; // URLs das fotos
  notes?: string;
  measuredBy?: string; // quem fez a medição
  location?: string; // onde foi feita a medição
  conditions?: string; // condições da medição (jejum, pós-treino, etc.)
}

export interface Goal extends UserOwnedDocument {
  type: MeasurementType;
  targetValue: number;
  currentValue?: number;
  unit: string;
  targetDate?: Date;
  description?: string;
  achieved: boolean;
  achievedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  milestones?: {
    value: number;
    achieved: boolean;
    achievedAt?: Date;
    notes?: string;
  }[];
}

export interface ProgressPhoto extends UserOwnedDocument {
  imageUrl: string;
  thumbnailUrl?: string;
  description?: string;
  tags?: string[];
  bodyPart?: string; // frente, costas, lado, etc.
  measurements?: {
    type: MeasurementType;
    value: number;
    unit: string;
  }[];
  isPublic: boolean;
  isFavorite: boolean;
}

export interface HealthProfile extends UserOwnedDocument {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  measurementUnit: MeasurementUnit;
  currentMetrics: HealthMetrics;
  medicalConditions?: string[];
  allergies?: string[];
  medications?: string[];
  fitnessGoals?: string[];
  preferredWorkoutTypes?: string[];
  lastUpdated: Date;
}

const measurementEntrySchema = new Schema<MeasurementEntry>({
  type: { type: String, enum: Object.values(MeasurementType), required: true },
  value: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  notes: String,
  measuredAt: { type: Date, default: Date.now }
});

const bodyMeasurementSchema = new Schema<BodyMeasurement>({
  userId: { type: String, required: true, index: true },
  measurements: [measurementEntrySchema],
  photos: [String],
  notes: String,
  measuredBy: String,
  location: String,
  conditions: String
}, {
  timestamps: true
});

const goalSchema = new Schema<Goal>({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: Object.values(MeasurementType), required: true },
  targetValue: { type: Number, required: true, min: 0 },
  currentValue: Number,
  unit: { type: String, required: true },
  targetDate: Date,
  description: String,
  achieved: { type: Boolean, default: false },
  achievedAt: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  milestones: [{
    value: { type: Number, required: true },
    achieved: { type: Boolean, default: false },
    achievedAt: Date,
    notes: String
  }]
}, {
  timestamps: true
});

const progressPhotoSchema = new Schema<ProgressPhoto>({
  userId: { type: String, required: true, index: true },
  imageUrl: { type: String, required: true },
  thumbnailUrl: String,
  description: String,
  tags: [String],
  bodyPart: String,
  measurements: [{
    type: { type: String, enum: Object.values(MeasurementType) },
    value: Number,
    unit: String
  }],
  isPublic: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false }
}, {
  timestamps: true
});

const healthProfileSchema = new Schema<HealthProfile>({
  userId: { type: String, required: true, unique: true, index: true },
  age: { type: Number, min: 1, max: 150 },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  activityLevel: { 
    type: String, 
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
    default: 'moderately_active'
  },
  measurementUnit: { 
    type: String, 
    enum: Object.values(MeasurementUnit), 
    default: MeasurementUnit.METRIC 
  },
  currentMetrics: {
    weight: Number,
    height: Number,
    bodyFat: Number,
    muscleMass: Number,
    bmi: Number,
    bmr: Number
  },
  medicalConditions: [String],
  allergies: [String],
  medications: [String],
  fitnessGoals: [String],
  preferredWorkoutTypes: [String],
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Middleware para calcular BMI e BMR automaticamente
healthProfileSchema.pre('save', function(next) {
  if (this.currentMetrics.weight && this.currentMetrics.height) {
    // Calcular BMI
    const heightInMeters = this.currentMetrics.height / 100;
    this.currentMetrics.bmi = this.currentMetrics.weight / (heightInMeters * heightInMeters);
    
    // Calcular BMR (Basal Metabolic Rate) usando fórmula de Harris-Benedict
    if (this.age && this.gender) {
      if (this.gender === 'male') {
        this.currentMetrics.bmr = 88.362 + (13.397 * this.currentMetrics.weight) + 
                                  (4.799 * this.currentMetrics.height) - (5.677 * this.age);
      } else if (this.gender === 'female') {
        this.currentMetrics.bmr = 447.593 + (9.247 * this.currentMetrics.weight) + 
                                  (3.098 * this.currentMetrics.height) - (4.330 * this.age);
      }
    }
  }
  
  this.lastUpdated = new Date();
  next();
});

// Índices
bodyMeasurementSchema.index({ userId: 1, 'measurements.type': 1 });
bodyMeasurementSchema.index({ userId: 1, createdAt: -1 });

goalSchema.index({ userId: 1, type: 1 });
goalSchema.index({ userId: 1, achieved: 1 });
goalSchema.index({ userId: 1, targetDate: 1 });

progressPhotoSchema.index({ userId: 1, createdAt: -1 });
progressPhotoSchema.index({ userId: 1, tags: 1 });
progressPhotoSchema.index({ userId: 1, isFavorite: 1 });

export const BodyMeasurementModel = mongoose.model<BodyMeasurement & Document>('BodyMeasurement', bodyMeasurementSchema);
export const GoalModel = mongoose.model<Goal & Document>('Goal', goalSchema);
export const ProgressPhotoModel = mongoose.model<ProgressPhoto & Document>('ProgressPhoto', progressPhotoSchema);
export const HealthProfileModel = mongoose.model<HealthProfile & Document>('HealthProfile', healthProfileSchema);

