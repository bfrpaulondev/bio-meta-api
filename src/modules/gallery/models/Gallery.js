const mongoose = require("mongoose");
const { Schema } = mongoose;

const MediaType = {
  IMAGE: "image",
  VIDEO: "video"
};

const MediaCategory = {
  PROGRESS: "progress",
  WORKOUT: "workout",
  MEAL: "meal",
  SUPPLEMENT: "supplement",
  ACHIEVEMENT: "achievement",
  BEFORE_AFTER: "before_after",
  OTHER: "other"
};

const mediaMetadataSchema = new Schema({
  width: Number,
  height: Number,
  duration: Number, // para vídeos, em segundos
  size: { type: Number, required: true },
  format: { type: String, required: true },
  quality: String
});

const mediaFileSchema = new Schema({
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
  workoutId: String, // referência para treino
  measurementId: String, // referência para medição
  isPublic: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  uploadedFrom: String, // mobile, web, etc.
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  takenAt: Date
}, {
  timestamps: true
});

const albumSchema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  coverImageUrl: String,
  mediaFiles: [String], // IDs dos arquivos de mídia
  isPublic: { type: Boolean, default: false },
  tags: [String],
  category: { type: String, enum: Object.values(MediaCategory) }
}, {
  timestamps: true
});

const comparisonSchema = new Schema({
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

const mediaShareSchema = new Schema({
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
comparisonSchema.pre("save", function(next) {
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

const MediaFileModel = mongoose.model("MediaFile", mediaFileSchema);
const AlbumModel = mongoose.model("Album", albumSchema);
const ComparisonModel = mongoose.model("Comparison", comparisonSchema);
const MediaShareModel = mongoose.model("MediaShare", mediaShareSchema);

module.exports = {
  MediaType,
  MediaCategory,
  MediaFileModel,
  AlbumModel,
  ComparisonModel,
  MediaShareModel
};


