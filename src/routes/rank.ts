import type { FastifyInstance } from 'fastify';
import { getOrdinalRank, NetworkError } from '../services/rank-service.js';
import {
  rankParamsSchema,
  rankQuerySchema,
  rankResponseSchema,
} from '../types/routes.js';

export async function registerRankRoutes(app: FastifyInstance): Promise<void> {
  app.get('/rank/:country/:username', {
    schema: {
      params: rankParamsSchema,
      querystring: rankQuerySchema,
      response: {
        200: rankResponseSchema,
        400: rankResponseSchema,
        503: rankResponseSchema,
        404: rankResponseSchema
      },
      summary: 'Get the rank of a user in a country (JSON format).',
      tags: ['json'],
    },
    handler: async (request, reply) => {
      const { username, country } = request.params as {
        username: string;
        country: string;
      };
      const { category } = request.query as {
        category?: string;
      };
      
      try {
        const rank = await getOrdinalRank(
          username,
          country,
          (category as 'all' | 'commits' | 'contributes') ?? 'commits',
        );
        
        if (!rank) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'Username not found. Please check your username and country here https://commits.top',
          });
        }
        
        return { rank };
      } catch (error) {
        if (error instanceof NetworkError) {
          return reply.status(503).send({
            statusCode: 503,
            error: 'Service Unavailable',
            message: 'Failed to fetch rank data. Please try again later.',
          });
        }
        throw error;
      }
    },
  });
}
