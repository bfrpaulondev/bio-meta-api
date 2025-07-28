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
exports.MediaShareModel = exports.ComparisonModel = exports.AlbumModel = exports.MediaFileModel = exports.MediaCategory = exports.MediaType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
})(MediaType || (exports.MediaType = MediaType = {}));
var MediaCategory;
(function (MediaCategory) {
    MediaCategory["PROGRESS"] = "progress";
    MediaCategory["WORKOUT"] = "workout";
    MediaCategory["MEAL"] = "meal";
    MediaCategory["SUPPLEMENT"] = "supplement";
    MediaCategory["ACHIEVEMENT"] = "achievement";
    MediaCategory["BEFORE_AFTER"] = "before_after";
    MediaCategory["OTHER"] = "other";
})(MediaCategory || (exports.MediaCategory = MediaCategory = {}));
const mediaMetadataSchema = new mongoose_1.Schema({
    width: Number,
    height: Number,
    duration: Number,
    size: { type: Number, required: true },
    format: { type: String, required: true },
    quality: String
});
const mediaFileSchema = new mongoose_1.Schema({
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
const albumSchema = new mongoose_1.Schema({
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
const comparisonSchema = new mongoose_1.Schema({
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
const mediaShareSchema = new mongoose_1.Schema({
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
comparisonSchema.pre('save', function (next) {
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
exports.MediaFileModel = mongoose_1.default.model('MediaFile', mediaFileSchema);
exports.AlbumModel = mongoose_1.default.model('Album', albumSchema);
exports.ComparisonModel = mongoose_1.default.model('Comparison', comparisonSchema);
exports.MediaShareModel = mongoose_1.default.model('MediaShare', mediaShareSchema);
//# sourceMappingURL=Gallery.js.map