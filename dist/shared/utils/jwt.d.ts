import { JWTPayload } from '@shared/types/auth';
export declare class JWTUtils {
    private static secret;
    private static expiresIn;
    static generateToken(payload: object): string;
    static verifyToken(token: string): JWTPayload;
    static decodeToken(token: string): JWTPayload | null;
    static generateRefreshToken(): string;
    static extractToken(authHeader: string): string | null;
    static isTokenExpiringSoon(token: string, minutesThreshold?: number): boolean;
    static getTokenRemainingTime(token: string): number;
}
//# sourceMappingURL=jwt.d.ts.map