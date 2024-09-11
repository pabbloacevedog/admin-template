import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import schema from './src/graphql/index.js';
import context from './src/utils/context.js';
import models from './src/models/index.js';

let server;
let url;

const startTestServer = async () => {
    server = new ApolloServer({
        schema,
        context,
    });

    const { url: serverUrl } = await startStandaloneServer(server, { listen: { port: 0 } }); // Use a random available port
    url = serverUrl;

    return { server, url };
};

const stopTestServer = async () => {
    if (server) {
        await server.stop();
    }
};

export { startTestServer, stopTestServer };
