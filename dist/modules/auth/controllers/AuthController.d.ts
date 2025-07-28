import { FastifyRequest, FastifyReply } from 'fastify';
import { LoginCredentials, RegisterData } from '@shared/types/auth';
export declare class AuthController {
    private authService;
    constructor();
    register(request: FastifyRequest<{
        Body: RegisterData;
    }>, reply: FastifyReply): Promise<void>;
    login(request: FastifyRequest<{
        Body: LoginCredentials;
    }>, reply: FastifyReply): Promise<void>;
    getProfile(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    updateProfile(request: FastifyRequest<{
        Body: {
            name?: string;
            avatar?: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    changePassword(request: FastifyRequest<{
        Body: {
            currentPassword: string;
            newPassword: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    logout(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    refreshToken(request: FastifyRequest<{
        Body: {
            refreshToken: string;
        };
    }>, reply: FastifyReply): Promise<void>;
    deactivateAccount(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map