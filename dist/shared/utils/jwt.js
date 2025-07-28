"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("@config/environment");
class JWTUtils {
    static generateToken(payload) {
        try {
            return jsonwebtoken_1.default.sign(payload, this.secret, {
                expiresIn: this.expiresIn,
                issuer: 'fitness-app-api',
                audience: 'fitness-app-client'
            });
        }
        catch (error) {
            throw new Error('Erro ao gerar token JWT');
        }
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret, {
                issuer: 'fitness-app-api',
                audience: 'fitness-app-client'
            });
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Error('Token expirado');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Error('Token inválido');
            }
            else {
                throw new Error('Erro ao verificar token');
            }
        }
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            return null;
        }
    }
    static generateRefreshToken() {
        const randomBytes = require('crypto').randomBytes(40);
        return randomBytes.toString('hex');
    }
    static extractToken(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        const parts = authHeader.split(' ');
        return parts[1] || null;
    }
    static isTokenExpiringSoon(token, minutesThreshold = 15) {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp)
                return true;
            const now = Math.floor(Date.now() / 1000);
            const timeUntilExpiry = decoded.exp - now;
            const thresholdInSeconds = minutesThreshold * 60;
            return timeUntilExpiry <= thresholdInSeconds;
        }
        catch (error) {
            return true;
        }
    }
    static getTokenRemainingTime(token) {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.exp)
                return 0;
            const now = Math.floor(Date.now() / 1000);
            return Math.max(0, decoded.exp - now);
        }
        catch (error) {
            return 0;
        }
    }
}
exports.JWTUtils = JWTUtils;
JWTUtils.secret = environment_1.config.jwt.secret;
JWTUtils.expiresIn = environment_1.config.jwt.expiresIn;
//# sourceMappingURL=jwt.js.map