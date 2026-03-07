import type { FastifyInstance } from 'fastify';
import { getOrdinalRank } from '../services/rank-service';
import {
  rankParamsSchema,
  rankQuerySchema,
  rankResponseSchema,
} from '../types/routes';

export async function registerRankRoutes(app: FastifyInstance): Promise<void> {
  app.get('/rank/:country/:username', {
    schema: {
      params: rankParamsSchema,
      querystring: rankQuerySchema,
      response: {
        200: rankResponseSchema,
        400: rankResponseSchema,
      },
      summary: 'Get the rank of a user in a country (JSON format).',
      tags: ['json'],
    },
    handler: async (request, reply) => {
      const { username, country } = request.params as {
        username: string;
        country: string;
      };
      const rank = await getOrdinalRank(username, country);
      return rank ? { rank } : reply.status(400).send({ rank: null });
    },
  });
}
