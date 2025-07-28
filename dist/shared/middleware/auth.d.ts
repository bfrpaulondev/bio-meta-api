import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload } from '@shared/types/auth';
declare module 'fastify' {
    interface FastifyRequest {
        user?: JWTPayload & {
            _id: string;
        };
    }
}
export declare function authRequired(request: FastifyRequest, reply: FastifyReply): Promise<void>;
export declare function authOptional(request: FastifyRequest, reply: FastifyReply): Promise<void>;
export declare function adminRequired(request: FastifyRequest, reply: FastifyReply): Promise<void>;
export declare function resourceOwnerOrAdmin(resourceUserIdField?: string): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map