import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/AuthService';
import { LoginCredentials, RegisterData } from '@shared/types/auth';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Registra um novo usuário
   */
  async register(
    request: FastifyRequest<{ Body: RegisterData }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const result = await this.authService.register(request.body);
      
      reply.status(201).send({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      
      reply.status(400).send({
        success: false,
        error: message,
        code: 'REGISTRATION_ERROR'
      });
    }
  }

  /**
   * Autentica um usuário
   */
  async login(
    request: FastifyRequest<{ Body: LoginCredentials }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const result = await this.authService.login(request.body);
      
      reply.status(200).send({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      
      reply.status(401).send({
        success: false,
        error: message,
        code: 'LOGIN_ERROR'
      });
    }
  }

  /**
   * Obtém o perfil do usuário autenticado
   */
  async getProfile(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado',
          code: 'UNAUTHORIZED'
        });
      }

      const profile = await this.authService.getProfile(request.user._id);
      
      reply.status(200).send({
        success: true,
        message: 'Perfil obtido com sucesso',
        data: profile
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      
      reply.status(404).send({
        success: false,
        error: message,
        code: 'PROFILE_ERROR'
      });
    }
  }

  /**
   * Atualiza o perfil do usuário
   */
  async updateProfile(
    request: FastifyRequest<{ 
      Body: { name?: string; avatar?: string } 
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado',
          code: 'UNAUTHORIZED'
        });
      }

      const updatedProfile = await this.authService.updateProfile(
        request.user._id,
        request.body
      );
      
      reply.status(200).send({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: updatedProfile
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      
      reply.status(400).send({
        success: false,
        error: message,
        code: 'UPDATE_PROFILE_ERROR'
      });
    }
  }

  /**
   * Altera a senha do usuário
   */
  async changePassword(
    request: FastifyRequest<{ 
      Body: { currentPassword: string; newPassword: string } 
    }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado',
          code: 'UNAUTHORIZED'
        });
      }

      const { currentPassword, newPassword } = request.body;

      if (!currentPassword || !newPassword) {
        return reply.status(400).send({
          success: false,
          error: 'Senha atual e nova senha são obrigatórias',
          code: 'MISSING_PASSWORDS'
        });
      }

      if (newPassword.length < 6) {
        return reply.status(400).send({
          success: false,
          error: 'Nova senha deve ter pelo menos 6 caracteres',
          code: 'WEAK_PASSWORD'
        });
      }

      await this.authService.changePassword(
        request.user._id,
        currentPassword,
        newPassword
      );
      
      reply.status(200).send({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      
      reply.status(400).send({
        success: false,
        error: message,
        code: 'CHANGE_PASSWORD_ERROR'
      });
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado',
          code: 'UNAUTHORIZED'
        });
      }

      await this.authService.logout(request.user._id);
      
      reply.status(200).send({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      
      reply.status(500).send({
        success: false,
        error: message,
        code: 'LOGOUT_ERROR'
      });
    }
  }

  /**
   * Renova o token usando refresh token
   */
  async refreshToken(
    request: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        return reply.status(400).send({
          success: false,
          error: 'Refresh token é obrigatório',
          code: 'MISSING_REFRESH_TOKEN'
        });
      }

      const result = await this.authService.refreshToken(refreshToken);
      
      reply.status(200).send({
        success: true,
        message: 'Token renovado com sucesso',
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      
      reply.status(401).send({
        success: false,
        error: message,
        code: 'REFRESH_TOKEN_ERROR'
      });
    }
  }

  /**
   * Desativa a conta do usuário
   */
  async deactivateAccount(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado',
          code: 'UNAUTHORIZED'
        });
      }

      await this.authService.deactivateAccount(request.user._id);
      
      reply.status(200).send({
        success: true,
        message: 'Conta desativada com sucesso'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno do servidor';
      
      reply.status(500).send({
        success: false,
        error: message,
        code: 'DEACTIVATE_ACCOUNT_ERROR'
      });
    }
  }
}

