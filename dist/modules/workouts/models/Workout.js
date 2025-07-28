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
exports.WorkoutLogModel = exports.WorkoutModel = exports.DifficultyLevel = exports.MuscleGroup = exports.ExerciseType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ExerciseType;
(function (ExerciseType) {
    ExerciseType["STRENGTH"] = "strength";
    ExerciseType["CARDIO"] = "cardio";
    ExerciseType["FLEXIBILITY"] = "flexibility";
    ExerciseType["BALANCE"] = "balance";
    ExerciseType["SPORTS"] = "sports";
})(ExerciseType || (exports.ExerciseType = ExerciseType = {}));
var MuscleGroup;
(function (MuscleGroup) {
    MuscleGroup["CHEST"] = "chest";
    MuscleGroup["BACK"] = "back";
    MuscleGroup["SHOULDERS"] = "shoulders";
    MuscleGroup["BICEPS"] = "biceps";
    MuscleGroup["TRICEPS"] = "triceps";
    MuscleGroup["FOREARMS"] = "forearms";
    MuscleGroup["ABS"] = "abs";
    MuscleGroup["LEGS"] = "legs";
    MuscleGroup["GLUTES"] = "glutes";
    MuscleGroup["CALVES"] = "calves";
    MuscleGroup["FULL_BODY"] = "full_body";
})(MuscleGroup || (exports.MuscleGroup = MuscleGroup = {}));
var DifficultyLevel;
(function (DifficultyLevel) {
    DifficultyLevel["BEGINNER"] = "beginner";
    DifficultyLevel["INTERMEDIATE"] = "intermediate";
    DifficultyLevel["ADVANCED"] = "advanced";
    DifficultyLevel["EXPERT"] = "expert";
})(DifficultyLevel || (exports.DifficultyLevel = DifficultyLevel = {}));
const exerciseSchema = new mongoose_1.Schema({
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
const workoutSchema = new mongoose_1.Schema({
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
const workoutLogSchema = new mongoose_1.Schema({
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
workoutSchema.index({ userId: 1, name: 1 });
workoutSchema.index({ muscleGroups: 1 });
workoutSchema.index({ difficulty: 1 });
workoutSchema.index({ isTemplate: 1, isPublic: 1 });
workoutSchema.index({ tags: 1 });
workoutLogSchema.index({ userId: 1, workoutId: 1 });
workoutLogSchema.index({ startTime: -1 });
workoutLogSchema.index({ completed: 1 });
exports.WorkoutModel = mongoose_1.default.model('Workout', workoutSchema);
exports.WorkoutLogModel = mongoose_1.default.model('WorkoutLog', workoutLogSchema);
//# sourceMappingURL=Workout.js.map