import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import cors, { CorsOptions } from 'cors';
import { json } from 'body-parser';
import { makeExecutableSchema } from '@graphql-tools/schema';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const main = async () => {
	dotenv.config();
	const app = express();
	const httpServer = createServer(app);

	const schema = makeExecutableSchema({ typeDefs, resolvers });

	const server = new ApolloServer({
		schema,
		csrfPrevention: true,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await server.start();

	const corsOptions: CorsOptions = {
		origin: process.env.BASE_URL,
		credentials: true,
	};

	app.use(
		'/graphql',
		cors<cors.CorsRequest>(corsOptions),
		json(),
		expressMiddleware(server, {
			context: async ({ req }) => ({ token: req.headers.token }),
		})
	);

	const PORT: number = +(process.env.PORT || 8080);

	await new Promise<void>((resolve) =>
		httpServer.listen({ port: PORT }, resolve)
	);
	console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

main().catch((err) => console.log(err));
