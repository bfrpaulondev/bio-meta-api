"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
exports.authOptional = authOptional;
exports.adminRequired = adminRequired;
exports.resourceOwnerOrAdmin = resourceOwnerOrAdmin;
const jwt_1 = require("@shared/utils/jwt");
const User_1 = require("@modules/auth/models/User");
async function authRequired(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        const token = jwt_1.JWTUtils.extractTokenFromHeader(authHeader);
        if (!token) {
            return reply.status(401).send({
                error: 'Token de acesso requerido',
                code: 'MISSING_TOKEN'
            });
        }
        const decoded = jwt_1.JWTUtils.verifyToken(token);
        const user = await User_1.User.findById(decoded.userId).select('+isActive');
        if (!user || !user.isActive) {
            return reply.status(401).send({
                error: 'Usuário não encontrado ou inativo',
                code: 'USER_NOT_FOUND'
            });
        }
        request.user = {
            ...decoded,
            _id: decoded.userId
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro de autenticação';
        return reply.status(401).send({
            error: errorMessage,
            code: 'INVALID_TOKEN'
        });
    }
}
async function authOptional(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        const token = jwt_1.JWTUtils.extractTokenFromHeader(authHeader);
        if (!token) {
            return;
        }
        const decoded = jwt_1.JWTUtils.verifyToken(token);
        const user = await User_1.User.findById(decoded.userId).select('+isActive');
        if (user && user.isActive) {
            request.user = {
                ...decoded,
                _id: decoded.userId
            };
        }
    }
    catch (error) {
    }
}
async function adminRequired(request, reply) {
    await authRequired(request, reply);
    if (reply.sent)
        return;
    const user = await User_1.User.findById(request.user?._id);
    if (!user) {
        return reply.status(403).send({
            error: 'Acesso negado - usuário não encontrado',
            code: 'ACCESS_DENIED'
        });
    }
}
function resourceOwnerOrAdmin(resourceUserIdField = 'userId') {
    return async (request, reply) => {
        await authRequired(request, reply);
        if (reply.sent)
            return;
        const currentUserId = request.user?._id;
        const resourceUserId = request.params[resourceUserIdField] ||
            request.body?.[resourceUserIdField];
        if (currentUserId === resourceUserId) {
            return;
        }
        const user = await User_1.User.findById(currentUserId);
        if (!user) {
            return reply.status(403).send({
                error: 'Acesso negado - usuário não encontrado',
                code: 'ACCESS_DENIED'
            });
        }
        if (currentUserId !== resourceUserId) {
            return reply.status(403).send({
                error: 'Acesso negado - você só pode acessar seus próprios recursos',
                code: 'ACCESS_DENIED'
            });
        }
    };
}
//# sourceMappingURL=auth.js.map