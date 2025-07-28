import { FastifyInstance } from 'fastify';
import { authRequired } from '@shared/middleware/auth';

export async function galleryRoutes(fastify: FastifyInstance) {
  // Aplicar autenticação a todas as rotas
  fastify.addHook('preHandler', authRequired);

  // CRUD básico para arquivos de mídia
  
  // GET /api/gallery/media - Listar arquivos de mídia
  fastify.get('/media', {
    schema: {
      description: 'Lista todos os arquivos de mídia do usuário',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          type: { type: 'string', enum: ['image', 'video'] },
          category: { type: 'string', enum: ['progress', 'workout', 'meal', 'supplement', 'achievement', 'before_after', 'other'] },
          isFavorite: { type: 'boolean' },
          tags: { type: 'string' },
          workoutId: { type: 'string' },
          measurementId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Lista de arquivos de mídia', userId: request.user?._id };
  });

  // POST /api/gallery/media - Upload de arquivo
  fastify.post('/media', {
    schema: {
      description: 'Faz upload de um arquivo de mídia',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        required: ['category'],
        properties: {
          category: { type: 'string', enum: ['progress', 'workout', 'meal', 'supplement', 'achievement', 'before_after', 'other'] },
          description: { type: 'string', maxLength: 500 },
          tags: { type: 'array', items: { type: 'string' } },
          workoutId: { type: 'string' },
          measurementId: { type: 'string' },
          isPublic: { type: 'boolean', default: false },
          location: {
            type: 'object',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' },
              address: { type: 'string' }
            }
          },
          takenAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica de upload
    return { message: 'Arquivo de mídia enviado', data: request.body };
  });

  // GET /api/gallery/media/:id - Obter arquivo específico
  fastify.get('/media/:id', {
    schema: {
      description: 'Obtém um arquivo de mídia específico',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Implementar lógica
    return { message: 'Detalhes do arquivo', id };
  });

  // PUT /api/gallery/media/:id - Atualizar arquivo
  fastify.put('/media/:id', {
    schema: {
      description: 'Atualiza um arquivo de mídia',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          description: { type: 'string', maxLength: 500 },
          tags: { type: 'array', items: { type: 'string' } },
          category: { type: 'string', enum: ['progress', 'workout', 'meal', 'supplement', 'achievement', 'before_after', 'other'] },
          isPublic: { type: 'boolean' },
          isFavorite: { type: 'boolean' },
          workoutId: { type: 'string' },
          measurementId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Implementar lógica
    return { message: 'Arquivo atualizado', id, data: request.body };
  });

  // DELETE /api/gallery/media/:id - Deletar arquivo
  fastify.delete('/media/:id', {
    schema: {
      description: 'Deleta um arquivo de mídia',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Implementar lógica
    return { message: 'Arquivo deletado', id };
  });

  // Operações adicionais para mídia

  // POST /api/gallery/media/:id/favorite - Marcar como favorito
  fastify.post('/media/:id/favorite', {
    schema: {
      description: 'Marca/desmarca um arquivo como favorito',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['isFavorite'],
        properties: {
          isFavorite: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Implementar lógica
    return { message: 'Status de favorito atualizado', id, data: request.body };
  });

  // POST /api/gallery/media/bulk-delete - Deletar múltiplos arquivos
  fastify.post('/media/bulk-delete', {
    schema: {
      description: 'Deleta múltiplos arquivos de mídia',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['mediaIds'],
        properties: {
          mediaIds: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Arquivos deletados em lote', data: request.body };
  });

  // CRUD para álbuns

  // GET /api/gallery/albums - Listar álbuns
  fastify.get('/albums', {
    schema: {
      description: 'Lista todos os álbuns do usuário',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          category: { type: 'string' },
          isPublic: { type: 'boolean' },
          tags: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Lista de álbuns', userId: request.user?._id };
  });

  // POST /api/gallery/albums - Criar novo álbum
  fastify.post('/albums', {
    schema: {
      description: 'Cria um novo álbum',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          coverImageUrl: { type: 'string' },
          mediaFiles: { type: 'array', items: { type: 'string' } },
          isPublic: { type: 'boolean', default: false },
          tags: { type: 'array', items: { type: 'string' } },
          category: { type: 'string', enum: ['progress', 'workout', 'meal', 'supplement', 'achievement', 'before_after', 'other'] }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Álbum criado', data: request.body };
  });

  // PUT /api/gallery/albums/:id - Atualizar álbum
  fastify.put('/albums/:id', {
    schema: {
      description: 'Atualiza um álbum',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Implementar lógica
    return { message: 'Álbum atualizado', id };
  });

  // DELETE /api/gallery/albums/:id - Deletar álbum
  fastify.delete('/albums/:id', {
    schema: {
      description: 'Deleta um álbum',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Implementar lógica
    return { message: 'Álbum deletado', id };
  });

  // CRUD para comparações

  // GET /api/gallery/comparisons - Listar comparações
  fastify.get('/comparisons', {
    schema: {
      description: 'Lista todas as comparações do usuário',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          isFavorite: { type: 'boolean' },
          isPublic: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Lista de comparações', userId: request.user?._id };
  });

  // POST /api/gallery/comparisons - Criar nova comparação
  fastify.post('/comparisons', {
    schema: {
      description: 'Cria uma nova comparação antes/depois',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'beforeImage', 'afterImage', 'beforeDate', 'afterDate'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          beforeImage: { type: 'string' },
          afterImage: { type: 'string' },
          beforeDate: { type: 'string', format: 'date' },
          afterDate: { type: 'string', format: 'date' },
          measurements: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                beforeValue: { type: 'number' },
                afterValue: { type: 'number' },
                unit: { type: 'string' }
              }
            }
          },
          notes: { type: 'string', maxLength: 1000 },
          isPublic: { type: 'boolean', default: false }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Comparação criada', data: request.body };
  });

  // PUT /api/gallery/comparisons/:id - Atualizar comparação
  fastify.put('/comparisons/:id', {
    schema: {
      description: 'Atualiza uma comparação',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Implementar lógica
    return { message: 'Comparação atualizada', id };
  });

  // DELETE /api/gallery/comparisons/:id - Deletar comparação
  fastify.delete('/comparisons/:id', {
    schema: {
      description: 'Deleta uma comparação',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Implementar lógica
    return { message: 'Comparação deletada', id };
  });

  // Compartilhamento em redes sociais

  // POST /api/gallery/share - Compartilhar mídia
  fastify.post('/share', {
    schema: {
      description: 'Compartilha mídia em redes sociais',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['mediaId', 'platform'],
        properties: {
          mediaId: { type: 'string' },
          platform: { type: 'string', enum: ['instagram', 'facebook', 'twitter', 'whatsapp'] },
          caption: { type: 'string', maxLength: 500 },
          hashtags: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Mídia compartilhada', data: request.body };
  });

  // GET /api/gallery/share/history - Histórico de compartilhamentos
  fastify.get('/share/history', {
    schema: {
      description: 'Obtém o histórico de compartilhamentos',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          platform: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Histórico de compartilhamentos', userId: request.user?._id };
  });

  // GET /api/gallery/stats - Estatísticas da galeria
  fastify.get('/stats', {
    schema: {
      description: 'Obtém estatísticas da galeria do usuário',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Estatísticas da galeria', userId: request.user?._id };
  });

  // GET /api/gallery/export - Exportar galeria
  fastify.get('/export', {
    schema: {
      description: 'Exporta a galeria do usuário',
      tags: ['Galeria'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          format: { type: 'string', enum: ['zip', 'json'], default: 'zip' },
          includeMetadata: { type: 'boolean', default: true },
          category: { type: 'string' },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' }
        }
      }
    }
  }, async (request, reply) => {
    // TODO: Implementar lógica
    return { message: 'Galeria exportada', userId: request.user?._id };
  });
}

