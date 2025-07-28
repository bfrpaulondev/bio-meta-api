"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthProfileModel = exports.ProgressPhotoModel = exports.GoalModel = exports.BodyMeasurementModel = exports.MeasurementType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const common_1 = require("@shared/types/common");
var MeasurementType;
(function (MeasurementType) {
    MeasurementType["WEIGHT"] = "weight";
    MeasurementType["HEIGHT"] = "height";
    MeasurementType["WAIST"] = "waist";
    MeasurementType["CHEST"] = "chest";
    MeasurementType["ARM"] = "arm";
    MeasurementType["THIGH"] = "thigh";
    MeasurementType["NECK"] = "neck";
    MeasurementType["HIP"] = "hip";
    MeasurementType["FOREARM"] = "forearm";
    MeasurementType["CALF"] = "calf";
    MeasurementType["BODY_FAT"] = "body_fat";
    MeasurementType["MUSCLE_MASS"] = "muscle_mass";
    MeasurementType["BONE_MASS"] = "bone_mass";
    MeasurementType["WATER_PERCENTAGE"] = "water_percentage";
    MeasurementType["VISCERAL_FAT"] = "visceral_fat";
})(MeasurementType || (exports.MeasurementType = MeasurementType = {}));
const measurementEntrySchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(MeasurementType), required: true },
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    notes: String,
    measuredAt: { type: Date, default: Date.now }
});
const bodyMeasurementSchema = new mongoose_1.Schema({
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
const goalSchema = new mongoose_1.Schema({
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
const progressPhotoSchema = new mongoose_1.Schema({
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
const healthProfileSchema = new mongoose_1.Schema({
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
        enum: Object.values(common_1.MeasurementUnit),
        default: common_1.MeasurementUnit.METRIC
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
healthProfileSchema.pre('save', function (next) {
    if (this.currentMetrics.weight && this.currentMetrics.height) {
        const heightInMeters = this.currentMetrics.height / 100;
        this.currentMetrics.bmi = this.currentMetrics.weight / (heightInMeters * heightInMeters);
        if (this.age && this.gender) {
            if (this.gender === 'male') {
                this.currentMetrics.bmr = 88.362 + (13.397 * this.currentMetrics.weight) +
                    (4.799 * this.currentMetrics.height) - (5.677 * this.age);
            }
            else if (this.gender === 'female') {
                this.currentMetrics.bmr = 447.593 + (9.247 * this.currentMetrics.weight) +
                    (3.098 * this.currentMetrics.height) - (4.330 * this.age);
            }
        }
    }
    this.lastUpdated = new Date();
    next();
});
bodyMeasurementSchema.index({ userId: 1, 'measurements.type': 1 });
bodyMeasurementSchema.index({ userId: 1, createdAt: -1 });
goalSchema.index({ userId: 1, type: 1 });
goalSchema.index({ userId: 1, achieved: 1 });
goalSchema.index({ userId: 1, targetDate: 1 });
progressPhotoSchema.index({ userId: 1, createdAt: -1 });
progressPhotoSchema.index({ userId: 1, tags: 1 });
progressPhotoSchema.index({ userId: 1, isFavorite: 1 });
exports.BodyMeasurementModel = mongoose_1.default.model('BodyMeasurement', bodyMeasurementSchema);
exports.GoalModel = mongoose_1.default.model('Goal', goalSchema);
exports.ProgressPhotoModel = mongoose_1.default.model('ProgressPhoto', progressPhotoSchema);
exports.HealthProfileModel = mongoose_1.default.model('HealthProfile', healthProfileSchema);
//# sourceMappingURL=Measurement.js.map