const jwt = require("jsonwebtoken");
const { config } = require("@config/environment");
const crypto = require("crypto");

class JWTUtils {
  static secret = config.jwt.secret;
  static expiresIn = config.jwt.expiresIn;

  /**
   * Gera um token JWT
   */
  static generateToken(payload) {
    try {
      return jwt.sign(payload, this.secret, {
        expiresIn: this.expiresIn,
        issuer: "fitness-app-api",
        audience: "fitness-app-client"
      });
    } catch (error) {
      throw new Error("Erro ao gerar token JWT");
    }
  }

  /**
   * Verifica e decodifica um token JWT
   */
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secret, {
        issuer: "fitness-app-api",
        audience: "fitness-app-client"
      });
      
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expirado");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Token inválido");
      } else {
        throw new Error("Erro ao verificar token");
      }
    }
  }

  /**
   * Decodifica um token sem verificar a assinatura (para debug)
   */
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  /**
   * Gera um refresh token (token simples para renovação)
   */
  static generateRefreshToken() {
    const randomBytes = crypto.randomBytes(40);
    return randomBytes.toString("hex");
  }

  /**
   * Extrai o token do header Authorization
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    
    const parts = authHeader.split(" ");
    return parts[1] || null;
  }

  /**
   * Verifica se um token está próximo do vencimento
   */
  static isTokenExpiringSoon(token, minutesThreshold = 15) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - now;
      const thresholdInSeconds = minutesThreshold * 60;
      
      return timeUntilExpiry <= thresholdInSeconds;
    } catch (error) {
      return true;
    }
  }

  /**
   * Obtém o tempo restante do token em segundos
   */
  static getTokenRemainingTime(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return 0;
      
      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, decoded.exp - now);
    } catch (error) {
      return 0;
    }
  }
}

module.exports = { JWTUtils };


