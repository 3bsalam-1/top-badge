import { makeBadge } from 'badge-maker';
import type { FastifyInstance } from 'fastify';
import { config } from '../config/index.js';
import { getOrdinalRank } from '../services/rank-service.js';
import { badgeParamsSchema, badgeQuerySchema } from '../types/routes.js';

type BadgeStyle =
  | 'flat'
  | 'plastic'
  | 'flat-square'
  | 'for-the-badge'
  | 'social';

export async function registerBadgeRoutes(app: FastifyInstance): Promise<void> {
  app.get('/:country/:username', {
    schema: {
      params: badgeParamsSchema,
      querystring: badgeQuerySchema,
      summary: 'Get the rank of a user in a country (badge format).',
      tags: ['badge'],
    },
    handler: async (request, reply) => {
      const { username, country } = request.params as {
        username: string;
        country: string;
      };
      const { style, label, labelColor, color, rnkPrefix, rnkSuffix, category } =
        request.query as {
          style?: string;
          label?: string;
          labelColor?: string;
          color?: string;
          rnkPrefix?: string;
          rnkSuffix?: string;
          category?: string;
        };

      const userRank = await getOrdinalRank(username, country, (category as 'all' | 'commits' | 'contributes') ?? 'commits');
      if (!userRank) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message:
            'Username not found. Please check your username and country here https://commits.top',
        });
      }

      const badge = makeBadge({
        style: (style ?? config.badge.defaultStyle) as BadgeStyle,
        label: label ?? config.badge.defaultLabel,
        labelColor: labelColor ?? config.badge.defaultLabelColor,
        color: color ?? config.badge.defaultColor,
        message: (rnkPrefix ?? '') + userRank + (rnkSuffix ?? ''),
      });

      reply
        .headers({
          'Content-Type': 'image/svg+xml',
          'Cache-Control': `max-age=${config.cache.ttl}`,
        })
        .send(badge);
    },
  });
}
