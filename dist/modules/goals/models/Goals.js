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
exports.UserStatsModel = exports.AchievementModel = exports.TipModel = exports.ReminderModel = exports.FitnessGoalModel = exports.ReminderFrequency = exports.GoalPriority = exports.GoalStatus = exports.GoalType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const common_1 = require("@shared/types/common");
var GoalType;
(function (GoalType) {
    GoalType["WEIGHT_LOSS"] = "weight_loss";
    GoalType["WEIGHT_GAIN"] = "weight_gain";
    GoalType["MUSCLE_GAIN"] = "muscle_gain";
    GoalType["STRENGTH"] = "strength";
    GoalType["ENDURANCE"] = "endurance";
    GoalType["FLEXIBILITY"] = "flexibility";
    GoalType["BODY_FAT"] = "body_fat";
    GoalType["FINANCIAL"] = "financial";
    GoalType["HABIT"] = "habit";
    GoalType["CUSTOM"] = "custom";
})(GoalType || (exports.GoalType = GoalType = {}));
var GoalStatus;
(function (GoalStatus) {
    GoalStatus["ACTIVE"] = "active";
    GoalStatus["COMPLETED"] = "completed";
    GoalStatus["PAUSED"] = "paused";
    GoalStatus["CANCELLED"] = "cancelled";
    GoalStatus["OVERDUE"] = "overdue";
})(GoalStatus || (exports.GoalStatus = GoalStatus = {}));
var GoalPriority;
(function (GoalPriority) {
    GoalPriority["LOW"] = "low";
    GoalPriority["MEDIUM"] = "medium";
    GoalPriority["HIGH"] = "high";
    GoalPriority["CRITICAL"] = "critical";
})(GoalPriority || (exports.GoalPriority = GoalPriority = {}));
var ReminderFrequency;
(function (ReminderFrequency) {
    ReminderFrequency["DAILY"] = "daily";
    ReminderFrequency["WEEKLY"] = "weekly";
    ReminderFrequency["MONTHLY"] = "monthly";
    ReminderFrequency["CUSTOM"] = "custom";
})(ReminderFrequency || (exports.ReminderFrequency = ReminderFrequency = {}));
const milestoneSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: String,
    targetValue: Number,
    targetDate: Date,
    completed: { type: Boolean, default: false },
    completedAt: Date,
    reward: String,
    notes: String
});
const goalProgressSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    value: { type: Number, required: true },
    notes: String,
    attachments: [String]
});
const fitnessGoalSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: String,
    type: { type: String, enum: Object.values(GoalType), required: true },
    status: { type: String, enum: Object.values(GoalStatus), default: GoalStatus.ACTIVE },
    priority: { type: String, enum: Object.values(GoalPriority), default: GoalPriority.MEDIUM },
    startValue: Number,
    targetValue: Number,
    currentValue: Number,
    unit: String,
    startDate: { type: Date, required: true },
    targetDate: Date,
    completedAt: Date,
    progress: [goalProgressSchema],
    milestones: [milestoneSchema],
    tags: [String],
    isPublic: { type: Boolean, default: false },
    motivationalQuote: String,
    reward: String,
    notes: String,
    relatedWorkouts: [String],
    relatedMeasurements: [String]
}, {
    timestamps: true
});
const reminderSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: Object.values(common_1.NotificationType), default: common_1.NotificationType.INFO },
    frequency: { type: String, enum: Object.values(ReminderFrequency), required: true },
    customFrequency: {
        interval: Number,
        unit: { type: String, enum: ['minutes', 'hours', 'days', 'weeks', 'months'] }
    },
    scheduledTime: {
        hour: { type: Number, required: true, min: 0, max: 23 },
        minute: { type: Number, required: true, min: 0, max: 59 },
        daysOfWeek: [{ type: Number, min: 0, max: 6 }],
        dayOfMonth: { type: Number, min: 1, max: 31 }
    },
    isActive: { type: Boolean, default: true },
    lastSent: Date,
    nextScheduled: Date,
    goalId: String,
    workoutId: String,
    settings: {
        pushNotification: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sound: { type: Boolean, default: true },
        vibration: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});
const tipSchema = new mongoose_1.Schema({
    userId: { type: String, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
        type: String,
        enum: ['fitness', 'nutrition', 'motivation', 'health', 'lifestyle'],
        required: true
    },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    tags: [String],
    imageUrl: String,
    videoUrl: String,
    source: String,
    isActive: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    userInteractions: {
        liked: { type: Boolean, default: false },
        bookmarked: { type: Boolean, default: false },
        shared: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});
const achievementSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: String,
    category: {
        type: String,
        enum: ['workout', 'goal', 'streak', 'milestone', 'social', 'special'],
        required: true
    },
    criteria: {
        type: { type: String, required: true },
        value: { type: Number, required: true },
        unit: String
    },
    unlockedAt: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: true },
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common'
    },
    points: { type: Number, default: 0 },
    relatedGoalId: String,
    relatedWorkoutId: String
}, {
    timestamps: true
});
const userStatsSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    totalWorkouts: { type: Number, default: 0 },
    totalWorkoutTime: { type: Number, default: 0 },
    goalsCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    achievements: [String],
    weeklyStats: [{
            week: { type: Date, required: true },
            workouts: { type: Number, default: 0 },
            workoutTime: { type: Number, default: 0 },
            goalsProgress: { type: Number, default: 0 }
        }],
    monthlyStats: [{
            month: { type: Date, required: true },
            workouts: { type: Number, default: 0 },
            workoutTime: { type: Number, default: 0 },
            goalsCompleted: { type: Number, default: 0 },
            weightChange: Number
        }],
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});
reminderSchema.pre('save', function (next) {
    if (this.isActive && this.frequency) {
        const now = new Date();
        const nextScheduled = new Date();
        switch (this.frequency) {
            case ReminderFrequency.DAILY:
                nextScheduled.setDate(now.getDate() + 1);
                break;
            case ReminderFrequency.WEEKLY:
                nextScheduled.setDate(now.getDate() + 7);
                break;
            case ReminderFrequency.MONTHLY:
                nextScheduled.setMonth(now.getMonth() + 1);
                break;
        }
        nextScheduled.setHours(this.scheduledTime.hour);
        nextScheduled.setMinutes(this.scheduledTime.minute);
        nextScheduled.setSeconds(0);
        nextScheduled.setMilliseconds(0);
        this.nextScheduled = nextScheduled;
    }
    next();
});
fitnessGoalSchema.index({ userId: 1, type: 1 });
fitnessGoalSchema.index({ userId: 1, status: 1 });
fitnessGoalSchema.index({ userId: 1, priority: 1 });
fitnessGoalSchema.index({ userId: 1, targetDate: 1 });
fitnessGoalSchema.index({ tags: 1 });
reminderSchema.index({ userId: 1, isActive: 1 });
reminderSchema.index({ userId: 1, nextScheduled: 1 });
reminderSchema.index({ goalId: 1 });
tipSchema.index({ category: 1 });
tipSchema.index({ tags: 1 });
tipSchema.index({ isActive: 1 });
achievementSchema.index({ userId: 1, category: 1 });
achievementSchema.index({ userId: 1, unlockedAt: -1 });
exports.FitnessGoalModel = mongoose_1.default.model('FitnessGoal', fitnessGoalSchema);
exports.ReminderModel = mongoose_1.default.model('Reminder', reminderSchema);
exports.TipModel = mongoose_1.default.model('Tip', tipSchema);
exports.AchievementModel = mongoose_1.default.model('Achievement', achievementSchema);
exports.UserStatsModel = mongoose_1.default.model('UserStats', userStatsSchema);
//# sourceMappingURL=Goals.js.map