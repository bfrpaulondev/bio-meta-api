import mongoose from 'mongoose';
import { UserOwnedDocument } from '@shared/types/common';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}
export declare enum MediaCategory {
    PROGRESS = "progress",
    WORKOUT = "workout",
    MEAL = "meal",
    SUPPLEMENT = "supplement",
    ACHIEVEMENT = "achievement",
    BEFORE_AFTER = "before_after",
    OTHER = "other"
}
export interface MediaMetadata {
    width?: number;
    height?: number;
    duration?: number;
    size: number;
    format: string;
    quality?: string;
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
    workoutId?: string;
    measurementId?: string;
    isPublic: boolean;
    isFavorite: boolean;
    uploadedFrom?: string;
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    takenAt?: Date;
}
export interface Album extends UserOwnedDocument {
    name: string;
    description?: string;
    coverImageUrl?: string;
    mediaFiles: string[];
    isPublic: boolean;
    tags: string[];
    category?: MediaCategory;
}
export interface Comparison extends UserOwnedDocument {
    name: string;
    description?: string;
    beforeImage: string;
    afterImage: string;
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
    mediaId: string;
    platform: string;
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
export declare const MediaFileModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, MediaFile & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const AlbumModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Album & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const ComparisonModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, Comparison & mongoose.Document<unknown, any, any, Record<string, any>>>;
export declare const MediaShareModel: mongoose.Model<unknown, unknown, unknown, unknown, mongoose.Document<unknown, unknown, unknown, unknown> & Omit<{
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, never>, MediaShare & mongoose.Document<unknown, any, any, Record<string, any>>>;
//# sourceMappingURL=Gallery.d.ts.map