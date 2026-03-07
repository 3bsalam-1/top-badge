import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { config } from './config';
import { registerBadgeRoutes, registerRankRoutes } from './routes';
import { registerSwagger } from './swagger';

const app = fastify();

app.get('/', async (_, reply) =>
  reply.redirect('https://github.com/3bsalam-1/top-badge'),
);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

registerSwagger(app);

app.setErrorHandler((error, _, reply) =>
  error instanceof ZodError
    ? reply.status(400).send({ message: 'Bad Request', error: error.issues })
    : reply.send(error),
);

// Register routes
registerRankRoutes(app);
registerBadgeRoutes(app);

app.listen(
  { port: config.server.port, host: config.server.host },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
