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
exports.TimerStatsModel = exports.TimerTemplateModel = exports.WorkoutTimerModel = exports.TimerSessionModel = exports.TimerStatus = exports.TimerType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var TimerType;
(function (TimerType) {
    TimerType["WORKOUT"] = "workout";
    TimerType["REST"] = "rest";
    TimerType["EXERCISE"] = "exercise";
    TimerType["SET"] = "set";
    TimerType["INTERVAL"] = "interval";
    TimerType["CUSTOM"] = "custom";
})(TimerType || (exports.TimerType = TimerType = {}));
var TimerStatus;
(function (TimerStatus) {
    TimerStatus["STOPPED"] = "stopped";
    TimerStatus["RUNNING"] = "running";
    TimerStatus["PAUSED"] = "paused";
    TimerStatus["COMPLETED"] = "completed";
})(TimerStatus || (exports.TimerStatus = TimerStatus = {}));
const timerSessionSchema = new mongoose_1.Schema({
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
const workoutTimerSchema = new mongoose_1.Schema({
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
const timerTemplateSchema = new mongoose_1.Schema({
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
const timerStatsSchema = new mongoose_1.Schema({
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
workoutTimerSchema.pre('save', function (next) {
    if (this.endTime && this.startTime) {
        this.actualDuration = Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 1000) - this.totalPausedTime;
    }
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
exports.TimerSessionModel = mongoose_1.default.model('TimerSession', timerSessionSchema);
exports.WorkoutTimerModel = mongoose_1.default.model('WorkoutTimer', workoutTimerSchema);
exports.TimerTemplateModel = mongoose_1.default.model('TimerTemplate', timerTemplateSchema);
exports.TimerStatsModel = mongoose_1.default.model('TimerStats', timerStatsSchema);
//# sourceMappingURL=Timer.js.map