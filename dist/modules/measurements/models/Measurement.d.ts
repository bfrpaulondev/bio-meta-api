import mongoose from 'mongoose';
import { UserOwnedDocument, HealthMetrics, MeasurementUnit } from '@shared/types/common';
export declare enum MeasurementType {
    WEIGHT = "weight",
    HEIGHT = "height",
    WAIST = "waist",
    CHEST = "chest",
    ARM = "arm",
    THIGH = "thigh",
    NECK = "neck",
    HIP = "hip",
    FOREARM = "forearm",
    CALF = "calf",
    BODY_FAT = "body_fat",
    MUSCLE_MASS = "muscle_mass",
    BONE_MASS = "bone_mass",
    WATER_PERCENTAGE = "water_percentage",
    VISCERAL_FAT = "visceral_fat"
}
export interface MeasurementEntry {
    type: MeasurementType;
    value: number;
    unit: string;
    notes?: string;
    measuredAt: Date;
}
export interface BodyMeasurement extends UserOwnedDocument {
    measurements: MeasurementEntry[];
    photos?: string[];
    notes?: string;
    measuredBy?: string;
    location?: string;
    conditions?: string;
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
    bodyPart?: string;
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
export declare const BodyMeasurementModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, BodyMeasurement & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const GoalModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Goal & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const ProgressPhotoModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, ProgressPhoto & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const HealthProfileModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, HealthProfile & mongoose.Document<unknown, any, any, Record<string, any>>>;
//# sourceMappingURL=Measurement.d.ts.map