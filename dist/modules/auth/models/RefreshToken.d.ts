import mongoose, { Document } from 'mongoose';
import { RefreshTokenData } from '@shared/types/auth';
export interface RefreshTokenDocument extends Omit<RefreshTokenData, 'userId'>, Document {
    userId: mongoose.Types.ObjectId;
}
export declare const RefreshToken: mongoose.Model<RefreshTokenDocument, {}, {}, {}, mongoose.Document<unknown, {}, RefreshTokenDocument, {}> & RefreshTokenDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=RefreshToken.d.ts.map