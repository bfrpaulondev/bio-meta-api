const { AuthController } = require("../controllers/AuthController");
const { authRequired } = require("../../shared/middleware/auth");

async function authRoutes(fastify) {
  const authController = new AuthController();

  // Schemas para validação e documentação
  const registerSchema = {
    description: "Registra um novo usuário",
    tags: ["Autenticação"],
    body: {
      type: "object",
      required: ["email", "password", "name"],
      properties: {
        email: { 
          type: "string", 
          format: "email",
          description: "Email do usuário"
        },
        password: { 
          type: "string", 
          minLength: 6,
          description: "Senha do usuário (mínimo 6 caracteres)"
        },
        name: { 
          type: "string", 
          minLength: 2, 
          maxLength: 100,
          description: "Nome completo do usuário"
        }
      }
    },
    response: {
      201: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  email: { type: "string" },
                  name: { type: "string" },
                  avatar: { type: "string" },
                  isActive: { type: "boolean" },
                  emailVerified: { type: "boolean" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" }
                }
              },
              token: { type: "string" },
              expiresIn: { type: "string" }
            }
          }
        }
      },
      400: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          error: { type: "string" },
          code: { type: "string" }
        }
      }
    }
  };

  const loginSchema = {
    description: "Autentica um usuário",
    tags: ["Autenticação"],
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { 
          type: "string", 
          format: "email",
          description: "Email do usuário"
        },
        password: { 
          type: "string",
          description: "Senha do usuário"
        }
      }
    },
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  email: { type: "string" },
                  name: { type: "string" },
                  avatar: { type: "string" },
                  isActive: { type: "boolean" },
                  emailVerified: { type: "boolean" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" }
                }
              },
              token: { type: "string" },
              expiresIn: { type: "string" }
            }
          }
        }
      },
      401: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          error: { type: "string" },
          code: { type: "string" }
        }
      }
    }
  };

  const profileSchema = {
    description: "Obtém o perfil do usuário autenticado",
    tags: ["Autenticação"],
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              _id: { type: "string" },
              email: { type: "string" },
              name: { type: "string" },
              avatar: { type: "string" },
              isActive: { type: "boolean" },
              emailVerified: { type: "boolean" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" }
            }
          }
        }
      },
      401: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          error: { type: "string" },
          code: { type: "string" }
        }
      }
    }
  };

  // Rotas públicas
  fastify.post("/register", { schema: registerSchema }, authController.register);
  fastify.post("/login", { schema: loginSchema }, authController.login);
  
  fastify.post("/refresh-token", {
    schema: {
      description: "Renova o token de acesso",
      tags: ["Autenticação"],
      body: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { 
            type: "string",
            description: "Refresh token para renovação"
          }
        }
      }
    }
  }, authController.refreshToken);

  // Rotas protegidas
  fastify.register(async function (fastify) {
    fastify.addHook("preHandler", authRequired);

    fastify.get("/profile", { schema: profileSchema }, authController.getProfile);
    
    fastify.put("/profile", {
      schema: {
        description: "Atualiza o perfil do usuário",
        tags: ["Autenticação"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            name: { 
              type: "string", 
              minLength: 2, 
              maxLength: 100,
              description: "Nome do usuário"
            },
            avatar: { 
              type: "string",
              description: "URL do avatar do usuário"
            }
          }
        }
      }
    }, authController.updateProfile);

    fastify.put("/change-password", {
      schema: {
        description: "Altera a senha do usuário",
        tags: ["Autenticação"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { 
              type: "string",
              description: "Senha atual do usuário"
            },
            newPassword: { 
              type: "string", 
              minLength: 6,
              description: "Nova senha (mínimo 6 caracteres)"
            }
          }
        }
      }
    }, authController.changePassword);

    fastify.post("/logout", {
      schema: {
        description: "Faz logout do usuário",
        tags: ["Autenticação"],
        security: [{ bearerAuth: [] }]
      }
    }, authController.logout);

    fastify.delete("/deactivate", {
      schema: {
        description: "Desativa a conta do usuário",
        tags: ["Autenticação"],
        security: [{ bearerAuth: [] }]
      }
    }, authController.deactivateAccount);
  });
}

module.exports = { authRoutes };


