export interface User {
    _id: string;
    email: string;
    password: string;
    name: string;
    avatar?: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserProfile {
    _id: string;
    email: string;
    name: string;
    avatar?: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    email: string;
    password: string;
    name: string;
}
export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
    iat?: number;
    exp?: number;
}
export interface AuthResponse {
    user: UserProfile;
    token: string;
    expiresIn: string;
}
export interface RefreshTokenData {
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}
export interface PasswordResetData {
    userId: string;
    token: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}
//# sourceMappingURL=auth.d.ts.map