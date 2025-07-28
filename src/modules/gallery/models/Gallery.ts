import mongoose, { Schema, Document } from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

export enum MediaCategory {
  PROGRESS = 'progress',
  WORKOUT = 'workout',
  MEAL = 'meal',
  SUPPLEMENT = 'supplement',
  ACHIEVEMENT = 'achievement',
  BEFORE_AFTER = 'before_after',
  OTHER = 'other'
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number; // para vídeos, em segundos
  size: number; // tamanho do arquivo em bytes
  format: string; // jpeg, png, mp4, etc.
  quality?: string; // low, medium, high
}

export interface MediaFile extends UserOwnedDocument {
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  category: MediaCategory;
  metadata: MediaMetadata;
  description?: string;
  tags: string[];
  workoutId?: string; // referência para treino
  measurementId?: string; // referência para medição
  isPublic: boolean;
  isFavorite: boolean;
  uploadedFrom?: string; // mobile, web, etc.
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  takenAt?: Date; // quando a foto/vídeo foi tirada
}

export interface Album extends UserOwnedDocument {
  name: string;
  description?: string;
  coverImageUrl?: string;
  mediaFiles: string[]; // IDs dos arquivos de mídia
  isPublic: boolean;
  tags: string[];
  category?: MediaCategory;
}

export interface Comparison extends UserOwnedDocument {
  name: string;
  description?: string;
  beforeImage: string; // ID do arquivo de mídia
  afterImage: string; // ID do arquivo de mídia
  beforeDate: Date;
  afterDate: Date;
  measurements?: {
    type: string;
    beforeValue: number;
    afterValue: number;
    unit: string;
    difference: number;
    percentageChange: number;
  }[];
  notes?: string;
  isPublic: boolean;
  isFavorite: boolean;
}

export interface MediaShare extends UserOwnedDocument {
  mediaId: string; // ID do arquivo de mídia
  platform: string; // instagram, facebook, twitter, etc.
  shareUrl?: string;
  caption?: string;
  hashtags?: string[];
  sharedAt: Date;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

const mediaMetadataSchema = new Schema<MediaMetadata>({
  width: Number,
  height: Number,
  duration: Number,
  size: { type: Number, required: true },
  format: { type: String, required: true },
  quality: String
});

const mediaFileSchema = new Schema<MediaFile>({
  userId: { type: String, required: true, index: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: String,
  type: { type: String, enum: Object.values(MediaType), required: true },
  category: { type: String, enum: Object.values(MediaCategory), required: true },
  metadata: { type: mediaMetadataSchema, required: true },
  description: String,
  tags: [String],
  workoutId: String,
  measurementId: String,
  isPublic: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  uploadedFrom: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  takenAt: Date
}, {
  timestamps: true
});

const albumSchema = new Schema<Album>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  coverImageUrl: String,
  mediaFiles: [String],
  isPublic: { type: Boolean, default: false },
  tags: [String],
  category: { type: String, enum: Object.values(MediaCategory) }
}, {
  timestamps: true
});

const comparisonSchema = new Schema<Comparison>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  beforeImage: { type: String, required: true },
  afterImage: { type: String, required: true },
  beforeDate: { type: Date, required: true },
  afterDate: { type: Date, required: true },
  measurements: [{
    type: String,
    beforeValue: Number,
    afterValue: Number,
    unit: String,
    difference: Number,
    percentageChange: Number
  }],
  notes: String,
  isPublic: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false }
}, {
  timestamps: true
});

const mediaShareSchema = new Schema<MediaShare>({
  userId: { type: String, required: true, index: true },
  mediaId: { type: String, required: true },
  platform: { type: String, required: true },
  shareUrl: String,
  caption: String,
  hashtags: [String],
  sharedAt: { type: Date, default: Date.now },
  engagement: {
    likes: Number,
    comments: Number,
    shares: Number
  }
}, {
  timestamps: true
});

// Middleware para calcular diferenças nas comparações
comparisonSchema.pre('save', function(next) {
  if (this.measurements) {
    this.measurements.forEach(measurement => {
      measurement.difference = measurement.afterValue - measurement.beforeValue;
      measurement.percentageChange = measurement.beforeValue !== 0 
        ? ((measurement.afterValue - measurement.beforeValue) / measurement.beforeValue) * 100 
        : 0;
    });
  }
  next();
});

// Índices
mediaFileSchema.index({ userId: 1, type: 1 });
mediaFileSchema.index({ userId: 1, category: 1 });
mediaFileSchema.index({ userId: 1, tags: 1 });
mediaFileSchema.index({ userId: 1, isFavorite: 1 });
mediaFileSchema.index({ userId: 1, createdAt: -1 });
mediaFileSchema.index({ workoutId: 1 });
mediaFileSchema.index({ measurementId: 1 });

albumSchema.index({ userId: 1, category: 1 });
albumSchema.index({ userId: 1, tags: 1 });
albumSchema.index({ userId: 1, isPublic: 1 });

comparisonSchema.index({ userId: 1, beforeDate: 1 });
comparisonSchema.index({ userId: 1, isFavorite: 1 });

mediaShareSchema.index({ userId: 1, platform: 1 });
mediaShareSchema.index({ userId: 1, sharedAt: -1 });

export const MediaFileModel = mongoose.model<MediaFile & Document>('MediaFile', mediaFileSchema);
export const AlbumModel = mongoose.model<Album & Document>('Album', albumSchema);
export const ComparisonModel = mongoose.model<Comparison & Document>('Comparison', comparisonSchema);
export const MediaShareModel = mongoose.model<MediaShare & Document>('MediaShare', mediaShareSchema);

