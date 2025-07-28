import mongoose from 'mongoose';
import { UserOwnedDocument, MeasurementUnit } from '@shared/types/common';
export declare enum Theme {
    LIGHT = "light",
    DARK = "dark",
    AUTO = "auto"
}
export declare enum Language {
    PT_BR = "pt-BR",
    EN_US = "en-US",
    ES_ES = "es-ES"
}
export declare enum DateFormat {
    DD_MM_YYYY = "DD/MM/YYYY",
    MM_DD_YYYY = "MM/DD/YYYY",
    YYYY_MM_DD = "YYYY-MM-DD"
}
export declare enum TimeFormat {
    TWELVE_HOUR = "12h",
    TWENTY_FOUR_HOUR = "24h"
}
export interface NotificationSettings {
    enabled: boolean;
    workoutReminders: boolean;
    goalDeadlines: boolean;
    achievementUnlocked: boolean;
    weeklyProgress: boolean;
    dailyTips: boolean;
    socialUpdates: boolean;
    systemUpdates: boolean;
    quietHours: {
        enabled: boolean;
        startTime: string;
        endTime: string;
    };
    sound: boolean;
    vibration: boolean;
    email: boolean;
    push: boolean;
}
export interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    workoutVisibility: 'public' | 'friends' | 'private';
    progressVisibility: 'public' | 'friends' | 'private';
    allowFriendRequests: boolean;
    allowMessages: boolean;
    showOnlineStatus: boolean;
    dataSharing: {
        analytics: boolean;
        thirdParty: boolean;
        marketing: boolean;
    };
}
export interface WorkoutSettings {
    defaultRestTime: number;
    autoStartTimer: boolean;
    countdownWarning: number;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    keepScreenOn: boolean;
    defaultWeightUnit: 'kg' | 'lbs';
    defaultDistanceUnit: 'km' | 'miles';
    showProgressPhotos: boolean;
    autoLogWorkouts: boolean;
}
export interface AppearanceSettings {
    theme: Theme;
    primaryColor: string;
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
    showAnimations: boolean;
    compactMode: boolean;
    showAvatarEverywhere: boolean;
}
export interface UserSettings extends UserOwnedDocument {
    language: Language;
    measurementUnit: MeasurementUnit;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
    timezone: string;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    workout: WorkoutSettings;
    appearance: AppearanceSettings;
    backup: {
        autoBackup: boolean;
        backupFrequency: 'daily' | 'weekly' | 'monthly';
        includePhotos: boolean;
        cloudProvider?: 'google' | 'icloud' | 'dropbox';
    };
    integrations: {
        googleFit: {
            enabled: boolean;
            syncWeight: boolean;
            syncWorkouts: boolean;
            lastSync?: Date;
        };
        healthKit: {
            enabled: boolean;
            syncWeight: boolean;
            syncWorkouts: boolean;
            lastSync?: Date;
        };
        myFitnessPal: {
            enabled: boolean;
            username?: string;
            lastSync?: Date;
        };
        strava: {
            enabled: boolean;
            accessToken?: string;
            lastSync?: Date;
        };
    };
    advanced: {
        developerMode: boolean;
        debugLogs: boolean;
        betaFeatures: boolean;
        dataExportFormat: 'json' | 'csv' | 'xml';
    };
}
export interface AppConfig {
    version: string;
    buildNumber: number;
    releaseDate: Date;
    features: {
        name: string;
        enabled: boolean;
        description?: string;
        betaOnly?: boolean;
    }[];
    maintenance: {
        enabled: boolean;
        message?: string;
        startTime?: Date;
        endTime?: Date;
    };
    limits: {
        maxWorkoutsPerDay: number;
        maxPhotosPerUser: number;
        maxGoalsPerUser: number;
        maxFileSize: number;
    };
    externalServices: {
        openai: {
            enabled: boolean;
            model: string;
            maxTokens: number;
        };
        cloudinary: {
            enabled: boolean;
            uploadPreset: string;
        };
        analytics: {
            enabled: boolean;
            provider: string;
        };
    };
}
export declare const UserSettingsModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, UserSettings & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const AppConfigModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, AppConfig & mongoose.Document<unknown, any, any, Record<string, any>>>;
//# sourceMappingURL=Settings.d.ts.map