const { User } = require("../models/User");
const { RefreshToken } = require("../models/RefreshToken");
const { JWTUtils } = require("../../shared/utils/jwt");

class AuthService {
  async register(data) {
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error("Email já está em uso");
      }

      const user = new User({
        email: data.email,
        password: data.password,
        name: data.name,
        isActive: true,
        emailVerified: false
      });

      await user.save();

      const token = JWTUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name
      });

      await this.createRefreshToken(user._id.toString());

      return {
        user: user.toProfile(),
        token,
        expiresIn: "7d"
      };

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro interno do servidor");
    }
  }

  async login(credentials) {
    try {
      const user = await User.findOne({
        email: credentials.email,
        isActive: true
      }).select("+password");

      if (!user) {
        throw new Error("Credenciais inválidas");
      }

      const isPasswordValid = await user.comparePassword(credentials.password);
      if (!isPasswordValid) {
        throw new Error("Credenciais inválidas");
      }

      const token = JWTUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name
      });

      await this.createRefreshToken(user._id.toString());

      return {
        user: user.toProfile(),
        token,
        expiresIn: "7d"
      };

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro interno do servidor");
    }
  }

  async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      return user.toProfile();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro interno do servidor");
    }
  }

  async updateProfile(
    userId,
    updateData
  ) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      return user.toProfile();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro interno do servidor");
    }
  }

  async changePassword(
    userId,
    currentPassword,
    newPassword
  ) {
    try {
      const user = await User.findById(userId).select("+password");
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error("Senha atual incorreta");
      }

      user.password = newPassword;
      await user.save();

      await RefreshToken.deleteMany({ userId });

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro interno do servidor");
    }
  }

  async logout(userId) {
    try {
      await RefreshToken.deleteMany({ userId });
    } catch (error) {
      throw new Error("Erro ao fazer logout");
    }
  }

  async createRefreshToken(userId) {
    try {
      await RefreshToken.deleteMany({ userId });

      const token = JWTUtils.generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const refreshToken = new RefreshToken({
        userId,
        token,
        expiresAt
      });

      await refreshToken.save();
      return token;
    } catch (error) {
      throw new Error("Erro ao criar refresh token");
    }
  }

  async refreshToken(refreshToken) {
    try {
      const tokenDoc = await RefreshToken.findOne({
        token: refreshToken,
        expiresAt: { $gt: new Date() }
      }).populate("userId");

      if (!tokenDoc) {
        throw new Error("Refresh token inválido ou expirado");
      }

      const user = await User.findById(tokenDoc.userId);
      if (!user || !user.isActive) {
        throw new Error("Usuário não encontrado ou inativo");
      }

      const newToken = JWTUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name
      });

      await this.createRefreshToken(user._id.toString());

      return {
        user: user.toProfile(),
        token: newToken,
        expiresIn: "7d"
      };

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro interno do servidor");
    }
  }

  async deactivateAccount(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      await RefreshToken.deleteMany({ userId });

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Erro interno do servidor");
    }
  }
}

module.exports = { AuthService };


