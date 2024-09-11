import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import schema from '../graphql/index.js';
import context from '../utils/context.js';

export async function setupGraphQL(app, httpServer) {
    console.info('SETUP - Configurando GraphQL...');

    const apolloServer = new ApolloServer({
        schema,
        context,
        formatError: (err) => {
            // formatea el error para que no se vea el stacktrace en el client
            const error = {
                message: err.message,
                extensions: {
                    code: err.extensions.code,
                    http: err.extensions.http
                }
            };
            return error;
        },
        introspection: true,
    });

    await apolloServer.start();

    app.use('/graphql', expressMiddleware(apolloServer,{
        context: context
    }));
}
