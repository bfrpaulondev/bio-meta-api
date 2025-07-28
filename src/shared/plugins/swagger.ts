import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from '@config/environment';

export async function registerSwagger(fastify: FastifyInstance) {
  // Registrar plugin do Swagger
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Fitness App API - Modular Monolith',
        description: `
# API Completa para Aplicativo de Fitness

Esta é uma API RESTful completa desenvolvida com arquitetura **Modular Monolith** usando **Fastify**, **TypeScript**, **MongoDB** e **JWT**.

## Funcionalidades Principais

### 🏋️ Treinos e Exercícios
- Criação e gerenciamento de treinos personalizados
- Biblioteca de exercícios com instruções detalhadas
- Logs de treino com métricas de performance
- Templates de treino públicos e privados

### 📊 Dashboard e Estatísticas
- Dashboard personalizado com widgets configuráveis
- Estatísticas detalhadas de progresso
- Insights personalizados com IA
- Comparações entre períodos

### 🛒 Lista de Compras Inteligente
- Gerenciamento de listas de compras
- Controle de orçamento mensal
- Histórico de preços
- Alertas de gastos

### 📏 Medidas Corporais
- Registro de medidas corporais
- Fotos de progresso
- Metas de medidas
- Perfil de saúde completo

### 🎯 Metas e Lembretes
- Sistema de metas SMART
- Lembretes personalizáveis
- Conquistas e gamificação
- Dicas diárias

### 📱 Galeria e Mídia
- Upload de fotos e vídeos
- Comparações antes/depois
- Álbuns organizados
- Compartilhamento social

### ⏱️ Cronômetros e Timers
- Timers de treino
- Cronômetros de descanso
- Templates de intervalos
- Histórico de sessões

### ⚙️ Configurações Avançadas
- Configurações personalizáveis
- Integrações externas (Google Fit, HealthKit)
- Backup e sincronização
- Exportação de dados

## Tecnologias Utilizadas

- **Backend**: Fastify + TypeScript
- **Banco de Dados**: MongoDB + Mongoose
- **Autenticação**: JWT + Refresh Tokens
- **Validação**: TypeBox + Zod
- **Documentação**: Swagger/OpenAPI 3.0
- **Upload**: Multipart + Sharp
- **Segurança**: Helmet + Rate Limiting
- **IA**: Integração com ChatGPT

## Arquitetura

A API segue o padrão **Modular Monolith**, organizando o código em módulos independentes:

\`\`\`
src/
├── modules/           # Módulos de negócio
│   ├── auth/         # Autenticação e autorização
│   ├── dashboard/    # Dashboard e estatísticas
│   ├── workouts/     # Treinos e exercícios
│   ├── shopping/     # Lista de compras
│   ├── measurements/ # Medidas corporais
│   ├── gallery/      # Galeria de mídia
│   ├── timer/        # Cronômetros
│   ├── goals/        # Metas e lembretes
│   └── settings/     # Configurações
├── shared/           # Código compartilhado
│   ├── middleware/   # Middlewares
│   ├── utils/        # Utilitários
│   ├── types/        # Tipos TypeScript
│   └── database/     # Conexão com banco
└── config/           # Configurações
\`\`\`

## Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação:

1. **Login**: \`POST /api/auth/login\`
2. **Registro**: \`POST /api/auth/register\`
3. **Refresh Token**: \`POST /api/auth/refresh\`
4. **Logout**: \`POST /api/auth/logout\`

### Como usar:

1. Faça login para obter o token
2. Inclua o token no header: \`Authorization: Bearer <token>\`
3. Use o refresh token para renovar quando necessário

## Rate Limiting

- **Limite geral**: 100 requisições por minuto
- **Login**: 5 tentativas por minuto
- **Upload**: 10 uploads por minuto

## Códigos de Resposta

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado
- **403**: Acesso negado
- **404**: Não encontrado
- **429**: Muitas requisições
- **500**: Erro interno do servidor

## Suporte

Para dúvidas ou suporte, entre em contato:
- **Email**: paulo@example.com
- **GitHub**: https://github.com/bfrpaulondev/fastify-modular-monolith-api
        `,
        version: '1.0.0',
        contact: {
          name: 'Paulo Neto',
          email: 'paulo@example.com',
          url: 'https://github.com/bfrpaulondev'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        },
        termsOfService: 'https://fitness-app.com/terms'
      },
      servers: [
        {
          url: `http://${config.server.host}:${config.server.port}`,
          description: 'Servidor de desenvolvimento'
        },
        {
          url: 'https://api.fitness-app.com',
          description: 'Servidor de produção'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Token JWT obtido através do endpoint de login'
          }
        },
        responses: {
          UnauthorizedError: {
            description: 'Token de acesso inválido ou expirado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Token de acesso inválido ou expirado' },
                    code: { type: 'string', example: 'UNAUTHORIZED' }
                  }
                }
              }
            }
          },
          ValidationError: {
            description: 'Dados de entrada inválidos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Dados de entrada inválidos' },
                    code: { type: 'string', example: 'VALIDATION_ERROR' },
                    details: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          RateLimitError: {
            description: 'Limite de requisições excedido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Muitas requisições. Tente novamente mais tarde.' },
                    code: { type: 'string', example: 'RATE_LIMIT_EXCEEDED' }
                  }
                }
              }
            }
          },
          NotFoundError: {
            description: 'Recurso não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Recurso não encontrado' },
                    code: { type: 'string', example: 'NOT_FOUND' }
                  }
                }
              }
            }
          },
          InternalServerError: {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Erro interno do servidor' },
                    code: { type: 'string', example: 'INTERNAL_SERVER_ERROR' }
                  }
                }
              }
            }
          }
        },
        examples: {
          SuccessResponse: {
            summary: 'Resposta de sucesso padrão',
            value: {
              success: true,
              message: 'Operação realizada com sucesso',
              data: {}
            }
          },
          PaginatedResponse: {
            summary: 'Resposta paginada padrão',
            value: {
              success: true,
              data: [],
              pagination: {
                page: 1,
                limit: 10,
                total: 100,
                totalPages: 10,
                hasNext: true,
                hasPrev: false
              }
            }
          }
        }
      },
      tags: [
        { 
          name: 'Autenticação', 
          description: 'Operações de autenticação e autorização',
          externalDocs: {
            description: 'Documentação de autenticação',
            url: 'https://docs.fitness-app.com/auth'
          }
        },
        { 
          name: 'Dashboard', 
          description: 'Estatísticas e visão geral do usuário',
          externalDocs: {
            description: 'Guia do dashboard',
            url: 'https://docs.fitness-app.com/dashboard'
          }
        },
        { 
          name: 'Treinos', 
          description: 'Gerenciamento de treinos e exercícios',
          externalDocs: {
            description: 'Guia de treinos',
            url: 'https://docs.fitness-app.com/workouts'
          }
        },
        { 
          name: 'Lista de Compras', 
          description: 'Gerenciamento de compras e orçamento',
          externalDocs: {
            description: 'Guia de compras',
            url: 'https://docs.fitness-app.com/shopping'
          }
        },
        { 
          name: 'Cronômetro', 
          description: 'Cronômetros e temporizadores de treino',
          externalDocs: {
            description: 'Guia de timers',
            url: 'https://docs.fitness-app.com/timer'
          }
        },
        { 
          name: 'Galeria', 
          description: 'Fotos e vídeos de progresso',
          externalDocs: {
            description: 'Guia da galeria',
            url: 'https://docs.fitness-app.com/gallery'
          }
        },
        { 
          name: 'Medidas', 
          description: 'Medidas corporais e metas',
          externalDocs: {
            description: 'Guia de medidas',
            url: 'https://docs.fitness-app.com/measurements'
          }
        },
        { 
          name: 'Metas', 
          description: 'Metas, lembretes e conquistas',
          externalDocs: {
            description: 'Guia de metas',
            url: 'https://docs.fitness-app.com/goals'
          }
        },
        { 
          name: 'Configurações', 
          description: 'Configurações do usuário e aplicativo',
          externalDocs: {
            description: 'Guia de configurações',
            url: 'https://docs.fitness-app.com/settings'
          }
        }
      ],
      externalDocs: {
        description: 'Documentação completa',
        url: 'https://docs.fitness-app.com'
      }
    }
  });

  // Registrar Swagger UI
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      displayOperationId: false,
      displayRequestDuration: true,
      filter: true,
      showExtensions: false,
      showCommonExtensions: false,
      tryItOutEnabled: true,
      requestSnippets: {
        generators: {
          curl_bash: {
            title: 'cURL (bash)',
            syntax: 'bash'
          },
          curl_powershell: {
            title: 'cURL (PowerShell)',
            syntax: 'powershell'
          }
        }
      },
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      validatorUrl: null
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        // Adicionar headers de segurança para o Swagger UI
        reply.header('X-Frame-Options', 'DENY');
        reply.header('X-Content-Type-Options', 'nosniff');
        next();
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      // Personalizar a especificação baseada no ambiente
      if (config.server.nodeEnv === 'production') {
        // Remover servidor de desenvolvimento em produção
        const servers = swaggerObject.servers?.filter(
          (server: any) => !server.url.includes('localhost')
        );
        return { ...swaggerObject, servers };
      }
      return swaggerObject;
    },
    transformSpecificationClone: true
  });

  // Adicionar rota para baixar a especificação OpenAPI
  fastify.get('/docs/openapi.json', async (request, reply) => {
    return fastify.swagger();
  });

  // Adicionar rota para baixar a especificação em YAML
  fastify.get('/docs/openapi.yaml', async (request, reply) => {
    const yaml = await import('yaml');
    const spec = fastify.swagger();
    reply.type('application/x-yaml');
    return yaml.stringify(spec);
  });

  // Rota de redirecionamento para a documentação
  fastify.get('/documentation', async (request, reply) => {
    return reply.redirect('/docs');
  });

  fastify.log.info('Swagger documentation configured successfully');
  fastify.log.info(`Documentation available at: http://${config.server.host}:${config.server.port}/docs`);
}

