import mongoose, { Schema, Document } from 'mongoose';
import { UserOwnedDocument, MeasurementUnit, NotificationType } from '@shared/types/common';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

export enum Language {
  PT_BR = 'pt-BR',
  EN_US = 'en-US',
  ES_ES = 'es-ES'
}

export enum DateFormat {
  DD_MM_YYYY = 'DD/MM/YYYY',
  MM_DD_YYYY = 'MM/DD/YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD'
}

export enum TimeFormat {
  TWELVE_HOUR = '12h',
  TWENTY_FOUR_HOUR = '24h'
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
    startTime: string; // HH:MM
    endTime: string; // HH:MM
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
  defaultRestTime: number; // em segundos
  autoStartTimer: boolean;
  countdownWarning: number; // segundos antes do fim
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
  // Configurações gerais
  language: Language;
  measurementUnit: MeasurementUnit;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  timezone: string;
  
  // Configurações de notificação
  notifications: NotificationSettings;
  
  // Configurações de privacidade
  privacy: PrivacySettings;
  
  // Configurações de treino
  workout: WorkoutSettings;
  
  // Configurações de aparência
  appearance: AppearanceSettings;
  
  // Configurações de backup
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    includePhotos: boolean;
    cloudProvider?: 'google' | 'icloud' | 'dropbox';
  };
  
  // Configurações de integração
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
  
  // Configurações avançadas
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
    maxFileSize: number; // em bytes
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

const notificationSettingsSchema = new Schema<NotificationSettings>({
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

const privacySettingsSchema = new Schema<PrivacySettings>({
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

const workoutSettingsSchema = new Schema<WorkoutSettings>({
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

const appearanceSettingsSchema = new Schema<AppearanceSettings>({
  theme: { type: String, enum: Object.values(Theme), default: Theme.AUTO },
  primaryColor: { type: String, default: '#007AFF' },
  accentColor: { type: String, default: '#FF3B30' },
  fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  showAnimations: { type: Boolean, default: true },
  compactMode: { type: Boolean, default: false },
  showAvatarEverywhere: { type: Boolean, default: true }
});

const userSettingsSchema = new Schema<UserSettings>({
  userId: { type: String, required: true, unique: true, index: true },
  
  // Configurações gerais
  language: { type: String, enum: Object.values(Language), default: Language.PT_BR },
  measurementUnit: { type: String, enum: Object.values(MeasurementUnit), default: MeasurementUnit.METRIC },
  dateFormat: { type: String, enum: Object.values(DateFormat), default: DateFormat.DD_MM_YYYY },
  timeFormat: { type: String, enum: Object.values(TimeFormat), default: TimeFormat.TWENTY_FOUR_HOUR },
  timezone: { type: String, default: 'America/Sao_Paulo' },
  
  // Configurações específicas
  notifications: { type: notificationSettingsSchema, default: () => ({}) },
  privacy: { type: privacySettingsSchema, default: () => ({}) },
  workout: { type: workoutSettingsSchema, default: () => ({}) },
  appearance: { type: appearanceSettingsSchema, default: () => ({}) },
  
  // Configurações de backup
  backup: {
    autoBackup: { type: Boolean, default: false },
    backupFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    includePhotos: { type: Boolean, default: false },
    cloudProvider: { type: String, enum: ['google', 'icloud', 'dropbox'] }
  },
  
  // Configurações de integração
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
  
  // Configurações avançadas
  advanced: {
    developerMode: { type: Boolean, default: false },
    debugLogs: { type: Boolean, default: false },
    betaFeatures: { type: Boolean, default: false },
    dataExportFormat: { type: String, enum: ['json', 'csv', 'xml'], default: 'json' }
  }
}, {
  timestamps: true
});

const appConfigSchema = new Schema<AppConfig>({
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
    maxFileSize: { type: Number, default: 10485760 } // 10MB
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

// Middleware para criar configurações padrão quando um usuário é criado
userSettingsSchema.statics.createDefaultSettings = function(userId: string) {
  return this.create({ userId });
};

export const UserSettingsModel = mongoose.model<UserSettings & Document>('UserSettings', userSettingsSchema);
export const AppConfigModel = mongoose.model<AppConfig & Document>('AppConfig', appConfigSchema);

