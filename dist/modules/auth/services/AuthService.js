"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/User");
const RefreshToken_1 = require("../models/RefreshToken");
const jwt_1 = require("@shared/utils/jwt");
class AuthService {
    async register(data) {
        try {
            const existingUser = await User_1.User.findOne({ email: data.email });
            if (existingUser) {
                throw new Error('Email já está em uso');
            }
            const user = new User_1.User({
                email: data.email,
                password: data.password,
                name: data.name,
                isActive: true,
                emailVerified: false
            });
            await user.save();
            const token = jwt_1.JWTUtils.generateToken({
                userId: user._id.toString(),
                email: user.email,
                name: user.name
            });
            await this.createRefreshToken(user._id.toString());
            return {
                user: user.toProfile(),
                token,
                expiresIn: '7d'
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro interno do servidor');
        }
    }
    async login(credentials) {
        try {
            const user = await User_1.User.findOne({
                email: credentials.email,
                isActive: true
            }).select('+password');
            if (!user) {
                throw new Error('Credenciais inválidas');
            }
            const isPasswordValid = await user.comparePassword(credentials.password);
            if (!isPasswordValid) {
                throw new Error('Credenciais inválidas');
            }
            const token = jwt_1.JWTUtils.generateToken({
                userId: user._id.toString(),
                email: user.email,
                name: user.name
            });
            await this.createRefreshToken(user._id.toString());
            return {
                user: user.toProfile(),
                token,
                expiresIn: '7d'
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro interno do servidor');
        }
    }
    async getProfile(userId) {
        try {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user.toProfile();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro interno do servidor');
        }
    }
    async updateProfile(userId, updateData) {
        try {
            const user = await User_1.User.findByIdAndUpdate(userId, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user.toProfile();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro interno do servidor');
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User_1.User.findById(userId).select('+password');
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                throw new Error('Senha atual incorreta');
            }
            user.password = newPassword;
            await user.save();
            await RefreshToken_1.RefreshToken.deleteMany({ userId });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro interno do servidor');
        }
    }
    async logout(userId) {
        try {
            await RefreshToken_1.RefreshToken.deleteMany({ userId });
        }
        catch (error) {
            throw new Error('Erro ao fazer logout');
        }
    }
    async createRefreshToken(userId) {
        try {
            await RefreshToken_1.RefreshToken.deleteMany({ userId });
            const token = jwt_1.JWTUtils.generateRefreshToken();
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);
            const refreshToken = new RefreshToken_1.RefreshToken({
                userId,
                token,
                expiresAt
            });
            await refreshToken.save();
            return token;
        }
        catch (error) {
            throw new Error('Erro ao criar refresh token');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const tokenDoc = await RefreshToken_1.RefreshToken.findOne({
                token: refreshToken,
                expiresAt: { $gt: new Date() }
            }).populate('userId');
            if (!tokenDoc) {
                throw new Error('Refresh token inválido ou expirado');
            }
            const user = await User_1.User.findById(tokenDoc.userId);
            if (!user || !user.isActive) {
                throw new Error('Usuário não encontrado ou inativo');
            }
            const newToken = jwt_1.JWTUtils.generateToken({
                userId: user._id.toString(),
                email: user.email,
                name: user.name
            });
            await this.createRefreshToken(user._id.toString());
            return {
                user: user.toProfile(),
                token: newToken,
                expiresIn: '7d'
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro interno do servidor');
        }
    }
    async deactivateAccount(userId) {
        try {
            const user = await User_1.User.findByIdAndUpdate(userId, { isActive: false, updatedAt: new Date() }, { new: true });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            await RefreshToken_1.RefreshToken.deleteMany({ userId });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro interno do servidor');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map