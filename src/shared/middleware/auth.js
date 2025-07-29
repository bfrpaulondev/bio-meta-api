const { JWTUtils } = require("@shared/utils/jwt");
const { User } = require("@modules/auth/models/User");

/**
 * Middleware de autenticação obrigatória
 */
async function authRequired(
  request,
  reply
) {
  try {
    const authHeader = request.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      return reply.status(401).send({
        error: "Token de acesso requerido",
        code: "MISSING_TOKEN"
      });
    }

    // Verifica e decodifica o token
    const decoded = JWTUtils.verifyToken(token);

    // Verifica se o usuário ainda existe e está ativo
    const user = await User.findById(decoded.userId).select("+isActive");
    
    if (!user || !user.isActive) {
      return reply.status(401).send({
        error: "Usuário não encontrado ou inativo",
        code: "USER_NOT_FOUND"
      });
    }

    // Adiciona os dados do usuário à requisição
    request.user = {
      ...decoded,
      _id: decoded.userId
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro de autenticação";
    
    return reply.status(401).send({
      error: errorMessage,
      code: "INVALID_TOKEN"
    });
  }
}

/**
 * Middleware de autenticação opcional
 */
async function authOptional(
  request,
  reply
) {
  try {
    const authHeader = request.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      // Se não há token, continua sem autenticação
      return;
    }

    // Verifica e decodifica o token
    const decoded = JWTUtils.verifyToken(token);

    // Verifica se o usuário ainda existe e está ativo
    const user = await User.findById(decoded.userId).select("+isActive");
    
    if (user && user.isActive) {
      // Adiciona os dados do usuário à requisição apenas se válido
      request.user = {
        ...decoded,
        _id: decoded.userId
      };
    }

  } catch (error) {
    // Em caso de erro, simplesmente não adiciona o usuário
    // Permite que a requisição continue sem autenticação
  }
}

/**
 * Middleware para verificar se o usuário é admin
 */
async function adminRequired(
  request,
  reply
) {
  // Primeiro verifica a autenticação
  await authRequired(request, reply);
  
  if (reply.sent) return; // Se já enviou resposta de erro, para aqui

  // Verifica se o usuário é admin (implementar lógica de roles se necessário)
  const user = await User.findById(request.user?._id);
  
  if (!user) {
    return reply.status(403).send({
      error: "Acesso negado - usuário não encontrado",
      code: "ACCESS_DENIED"
    });
  }

  // Por enquanto, todos os usuários têm acesso admin
  // Implementar sistema de roles se necessário
}

/**
 * Middleware para verificar se o usuário pode acessar o recurso
 */
function resourceOwnerOrAdmin(resourceUserIdField = "userId") {
  return async (request, reply) => {
    // Primeiro verifica a autenticação
    await authRequired(request, reply);
    
    if (reply.sent) return;

    const currentUserId = request.user?._id;
    const resourceUserId = (request.params)[resourceUserIdField] || 
                          (request.body)?.[resourceUserIdField];

    // Se é o próprio usuário ou admin, permite acesso
    if (currentUserId === resourceUserId) {
      return;
    }

    // Verifica se é admin (implementar lógica de roles se necessário)
    const user = await User.findById(currentUserId);
    if (!user) {
      return reply.status(403).send({
        error: "Acesso negado - usuário não encontrado",
        code: "ACCESS_DENIED"
      });
    }

    // Por enquanto, permite acesso se for o próprio usuário
    // Implementar sistema de roles para admin se necessário
    if (currentUserId !== resourceUserId) {
      return reply.status(403).send({
        error: "Acesso negado - você só pode acessar seus próprios recursos",
        code: "ACCESS_DENIED"
      });
    }
  };
}

module.exports = {
  authRequired,
  authOptional,
  adminRequired,
  resourceOwnerOrAdmin
};


