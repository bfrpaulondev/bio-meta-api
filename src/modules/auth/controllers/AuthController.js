const { AuthService } = require("../services/AuthService");

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.deactivateAccount = this.deactivateAccount.bind(this);
  }

  async register(request, reply) {
    try {
      const result = await this.authService.register(request.body);
      
      reply.status(201).send({
        success: true,
        message: "Usuário registrado com sucesso",
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno do servidor";
      
      reply.status(400).send({
        success: false,
        error: message,
        code: "REGISTRATION_ERROR"
      });
    }
  }

  async login(request, reply) {
    try {
      const result = await this.authService.login(request.body);
      
      reply.status(200).send({
        success: true,
        message: "Login realizado com sucesso",
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno do servidor";
      
      reply.status(401).send({
        success: false,
        error: message,
        code: "LOGIN_ERROR"
      });
    }
  }

  async getProfile(request, reply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: "Usuário não autenticado",
          code: "UNAUTHORIZED"
        });
      }

      const profile = await this.authService.getProfile(request.user._id);
      
      reply.status(200).send({
        success: true,
        message: "Perfil obtido com sucesso",
        data: profile
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno do servidor";
      
      reply.status(404).send({
        success: false,
        error: message,
        code: "PROFILE_ERROR"
      });
    }
  }

  async updateProfile(request, reply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: "Usuário não autenticado",
          code: "UNAUTHORIZED"
        });
      }

      const updatedProfile = await this.authService.updateProfile(
        request.user._id,
        request.body
      );
      
      reply.status(200).send({
        success: true,
        message: "Perfil atualizado com sucesso",
        data: updatedProfile
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno do servidor";
      
      reply.status(400).send({
        success: false,
        error: message,
        code: "UPDATE_PROFILE_ERROR"
      });
    }
  }

  async changePassword(request, reply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: "Usuário não autenticado",
          code: "UNAUTHORIZED"
        });
      }

      const { currentPassword, newPassword } = request.body;

      if (!currentPassword || !newPassword) {
        return reply.status(400).send({
          success: false,
          error: "Senha atual e nova senha são obrigatórias",
          code: "MISSING_PASSWORDS"
        });
      }

      if (newPassword.length < 6) {
        return reply.status(400).send({
          success: false,
          error: "Nova senha deve ter pelo menos 6 caracteres",
          code: "WEAK_PASSWORD"
        });
      }

      await this.authService.changePassword(
        request.user._id,
        currentPassword,
        newPassword
      );
      
      reply.status(200).send({
        success: true,
        message: "Senha alterada com sucesso"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno do servidor";
      
      reply.status(400).send({
        success: false,
        error: message,
        code: "CHANGE_PASSWORD_ERROR"
      });
    }
  }

  async logout(request, reply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: "Usuário não autenticado",
          code: "UNAUTHORIZED"
        });
      }

      await this.authService.logout(request.user._id);
      
      reply.status(200).send({
        success: true,
        message: "Logout realizado com sucesso"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno do servidor";
      
      reply.status(500).send({
        success: false,
        error: message,
        code: "LOGOUT_ERROR"
      });
    }
  }

  async refreshToken(request, reply) {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        return reply.status(400).send({
          success: false,
          error: "Refresh token é obrigatório",
          code: "MISSING_REFRESH_TOKEN"
        });
      }

      const result = await this.authService.refreshToken(refreshToken);
      
      reply.status(200).send({
        success: true,
        message: "Token renovado com sucesso",
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno do servidor";
      
      reply.status(401).send({
        success: false,
        error: message,
        code: "REFRESH_TOKEN_ERROR"
      });
    }
  }

  async deactivateAccount(request, reply) {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          error: "Usuário não autenticado",
          code: "UNAUTHORIZED"
        });
      }

      await this.authService.deactivateAccount(request.user._id);
      
      reply.status(200).send({
        success: true,
        message: "Conta desativada com sucesso"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro interno do servidor";
      
      reply.status(500).send({
        success: false,
        error: message,
        code: "DEACTIVATE_ACCOUNT_ERROR"
      });
    }
  }
}

module.exports = { AuthController };


