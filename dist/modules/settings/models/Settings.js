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
exports.AppConfigModel = exports.UserSettingsModel = exports.TimeFormat = exports.DateFormat = exports.Language = exports.Theme = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const common_1 = require("@shared/types/common");
var Theme;
(function (Theme) {
    Theme["LIGHT"] = "light";
    Theme["DARK"] = "dark";
    Theme["AUTO"] = "auto";
})(Theme || (exports.Theme = Theme = {}));
var Language;
(function (Language) {
    Language["PT_BR"] = "pt-BR";
    Language["EN_US"] = "en-US";
    Language["ES_ES"] = "es-ES";
})(Language || (exports.Language = Language = {}));
var DateFormat;
(function (DateFormat) {
    DateFormat["DD_MM_YYYY"] = "DD/MM/YYYY";
    DateFormat["MM_DD_YYYY"] = "MM/DD/YYYY";
    DateFormat["YYYY_MM_DD"] = "YYYY-MM-DD";
})(DateFormat || (exports.DateFormat = DateFormat = {}));
var TimeFormat;
(function (TimeFormat) {
    TimeFormat["TWELVE_HOUR"] = "12h";
    TimeFormat["TWENTY_FOUR_HOUR"] = "24h";
})(TimeFormat || (exports.TimeFormat = TimeFormat = {}));
const notificationSettingsSchema = new mongoose_1.Schema({
    enabled: { type: Boolean, default: true },
    workoutReminders: { type: Boolean, default: true },
    goalDeadlines: { type: Boolean, default: true },
    achievementUnlocked: { type: Boolean, default: true },
    weeklyProgress: { type: Boolean, default: true },
    dailyTips: { type: Boolean, default: true },
    socialUpdates: { type: Boolean, default: false },
    systemUpdates: { type: Boolean, default: true },
    quietHours: {
        enabled: { type: Boolean, default: false },
        startTime: { type: String, default: '22:00' },
        endTime: { type: String, default: '07:00' }
    },
    sound: { type: Boolean, default: true },
    vibration: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
});
const privacySettingsSchema = new mongoose_1.Schema({
    profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    workoutVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'friends' },
    progressVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'private' },
    allowFriendRequests: { type: Boolean, default: true },
    allowMessages: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
    dataSharing: {
        analytics: { type: Boolean, default: true },
        thirdParty: { type: Boolean, default: false },
        marketing: { type: Boolean, default: false }
    }
});
const workoutSettingsSchema = new mongoose_1.Schema({
    defaultRestTime: { type: Number, default: 60 },
    autoStartTimer: { type: Boolean, default: false },
    countdownWarning: { type: Number, default: 10 },
    soundEnabled: { type: Boolean, default: true },
    vibrationEnabled: { type: Boolean, default: true },
    keepScreenOn: { type: Boolean, default: true },
    defaultWeightUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    defaultDistanceUnit: { type: String, enum: ['km', 'miles'], default: 'km' },
    showProgressPhotos: { type: Boolean, default: true },
    autoLogWorkouts: { type: Boolean, default: true }
});
const appearanceSettingsSchema = new mongoose_1.Schema({
    theme: { type: String, enum: Object.values(Theme), default: Theme.AUTO },
    primaryColor: { type: String, default: '#007AFF' },
    accentColor: { type: String, default: '#FF3B30' },
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    showAnimations: { type: Boolean, default: true },
    compactMode: { type: Boolean, default: false },
    showAvatarEverywhere: { type: Boolean, default: true }
});
const userSettingsSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    language: { type: String, enum: Object.values(Language), default: Language.PT_BR },
    measurementUnit: { type: String, enum: Object.values(common_1.MeasurementUnit), default: common_1.MeasurementUnit.METRIC },
    dateFormat: { type: String, enum: Object.values(DateFormat), default: DateFormat.DD_MM_YYYY },
    timeFormat: { type: String, enum: Object.values(TimeFormat), default: TimeFormat.TWENTY_FOUR_HOUR },
    timezone: { type: String, default: 'America/Sao_Paulo' },
    notifications: { type: notificationSettingsSchema, default: () => ({}) },
    privacy: { type: privacySettingsSchema, default: () => ({}) },
    workout: { type: workoutSettingsSchema, default: () => ({}) },
    appearance: { type: appearanceSettingsSchema, default: () => ({}) },
    backup: {
        autoBackup: { type: Boolean, default: false },
        backupFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
        includePhotos: { type: Boolean, default: false },
        cloudProvider: { type: String, enum: ['google', 'icloud', 'dropbox'] }
    },
    integrations: {
        googleFit: {
            enabled: { type: Boolean, default: false },
            syncWeight: { type: Boolean, default: false },
            syncWorkouts: { type: Boolean, default: false },
            lastSync: Date
        },
        healthKit: {
            enabled: { type: Boolean, default: false },
            syncWeight: { type: Boolean, default: false },
            syncWorkouts: { type: Boolean, default: false },
            lastSync: Date
        },
        myFitnessPal: {
            enabled: { type: Boolean, default: false },
            username: String,
            lastSync: Date
        },
        strava: {
            enabled: { type: Boolean, default: false },
            accessToken: String,
            lastSync: Date
        }
    },
    advanced: {
        developerMode: { type: Boolean, default: false },
        debugLogs: { type: Boolean, default: false },
        betaFeatures: { type: Boolean, default: false },
        dataExportFormat: { type: String, enum: ['json', 'csv', 'xml'], default: 'json' }
    }
}, {
    timestamps: true
});
const appConfigSchema = new mongoose_1.Schema({
    version: { type: String, required: true },
    buildNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    features: [{
            name: { type: String, required: true },
            enabled: { type: Boolean, default: true },
            description: String,
            betaOnly: { type: Boolean, default: false }
        }],
    maintenance: {
        enabled: { type: Boolean, default: false },
        message: String,
        startTime: Date,
        endTime: Date
    },
    limits: {
        maxWorkoutsPerDay: { type: Number, default: 10 },
        maxPhotosPerUser: { type: Number, default: 1000 },
        maxGoalsPerUser: { type: Number, default: 50 },
        maxFileSize: { type: Number, default: 10485760 }
    },
    externalServices: {
        openai: {
            enabled: { type: Boolean, default: true },
            model: { type: String, default: 'gpt-3.5-turbo' },
            maxTokens: { type: Number, default: 1000 }
        },
        cloudinary: {
            enabled: { type: Boolean, default: false },
            uploadPreset: String
        },
        analytics: {
            enabled: { type: Boolean, default: true },
            provider: { type: String, default: 'internal' }
        }
    }
}, {
    timestamps: true
});
userSettingsSchema.statics.createDefaultSettings = function (userId) {
    return this.create({ userId });
};
exports.UserSettingsModel = mongoose_1.default.model('UserSettings', userSettingsSchema);
exports.AppConfigModel = mongoose_1.default.model('AppConfig', appConfigSchema);
//# sourceMappingURL=Settings.js.map