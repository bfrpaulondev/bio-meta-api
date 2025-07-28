import { UserDocument } from '../models/User';
import { LoginCredentials, RegisterData, AuthResponse, UserProfile } from '@shared/types/auth';
export declare class AuthService {
    register(data: RegisterData): Promise<AuthResponse>;
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    getProfile(userId: string): Promise<UserProfile>;
    updateProfile(userId: string, updateData: Partial<Pick<UserDocument, 'name' | 'avatar'>>): Promise<UserProfile>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    logout(userId: string): Promise<void>;
    private createRefreshToken;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
    deactivateAccount(userId: string): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map