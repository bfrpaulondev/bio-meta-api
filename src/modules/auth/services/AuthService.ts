import { User, UserDocument } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import { JWTUtils } from '@shared/utils/jwt';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  UserProfile 
} from '@shared/types/auth';

export class AuthService {
  /**
   * Registra um novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Verifica se o email já existe
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Cria o novo usuário
      const user = new User({
        email: data.email,
        password: data.password,
        name: data.name,
        isActive: true,
        emailVerified: false
      });

      await user.save();

      // Gera o token JWT
      const token = JWTUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name
      });

      // Gera refresh token
      await this.createRefreshToken(user._id.toString());

      return {
        user: user.toProfile(),
        token,
        expiresIn: '7d'
      };

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Autentica um usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Busca o usuário com a senha
      const user = await User.findOne({ 
        email: credentials.email,
        isActive: true 
      }).select('+password');

      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Verifica a senha
      const isPasswordValid = await user.comparePassword(credentials.password);
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      // Gera o token JWT
      const token = JWTUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name
      });

      // Gera refresh token
      await this.createRefreshToken(user._id.toString());

      return {
        user: user.toProfile(),
        token,
        expiresIn: '7d'
      };

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Obtém o perfil do usuário
   */
  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user.toProfile();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Atualiza o perfil do usuário
   */
  async updateProfile(
    userId: string, 
    updateData: Partial<Pick<UserDocument, 'name' | 'avatar'>>
  ): Promise<UserProfile> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user.toProfile();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Altera a senha do usuário
   */
  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verifica a senha atual
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Senha atual incorreta');
      }

      // Atualiza a senha
      user.password = newPassword;
      await user.save();

      // Remove todos os refresh tokens do usuário para forçar novo login
      await RefreshToken.deleteMany({ userId });

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Faz logout do usuário (remove refresh tokens)
   */
  async logout(userId: string): Promise<void> {
    try {
      await RefreshToken.deleteMany({ userId });
    } catch (error) {
      throw new Error('Erro ao fazer logout');
    }
  }

  /**
   * Cria um refresh token
   */
  private async createRefreshToken(userId: string): Promise<string> {
    try {
      // Remove refresh tokens antigos do usuário
      await RefreshToken.deleteMany({ userId });

      const token = JWTUtils.generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

      const refreshToken = new RefreshToken({
        userId,
        token,
        expiresAt
      });

      await refreshToken.save();
      return token;
    } catch (error) {
      throw new Error('Erro ao criar refresh token');
    }
  }

  /**
   * Renova o token usando refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const tokenDoc = await RefreshToken.findOne({ 
        token: refreshToken,
        expiresAt: { $gt: new Date() }
      }).populate('userId');

      if (!tokenDoc) {
        throw new Error('Refresh token inválido ou expirado');
      }

      const user = await User.findById(tokenDoc.userId);
      if (!user || !user.isActive) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      // Gera novo token JWT
      const newToken = JWTUtils.generateToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name
      });

      // Gera novo refresh token
      await this.createRefreshToken(user._id.toString());

      return {
        user: user.toProfile(),
        token: newToken,
        expiresIn: '7d'
      };

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor');
    }
  }

  /**
   * Desativa a conta do usuário
   */
  async deactivateAccount(userId: string): Promise<void> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Remove todos os refresh tokens
      await RefreshToken.deleteMany({ userId });

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor');
    }
  }
}

