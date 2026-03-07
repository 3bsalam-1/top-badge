import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const registerSwagger = (app: FastifyInstance) => {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Top Badge',
        description:
          'Top Badge is a simple web service. It returns a badge (or JSON) that shows your rank among other GitHub users from your country according to your GitHub contributions.',
        contact: {
          name: 'Ahmed Mohamed',
          url: 'https://github.com/3bsalam-1/top-badge',
          email: '3bsalam0@gmail.com',
        },
        version: '1.0.0',
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUI, { routePrefix: '/swagger' });
};
