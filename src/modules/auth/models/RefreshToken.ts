import mongoose, { Schema, Document } from 'mongoose';
import { RefreshTokenData } from '@shared/types/auth';

export interface RefreshTokenDocument extends Omit<RefreshTokenData, 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index - remove automaticamente após expirar
  }
}, {
  timestamps: true
});

// Índices compostos
refreshTokenSchema.index({ userId: 1, token: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

export const RefreshToken = mongoose.model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);

