import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import schema from '../graphql/index.js';
import context from '../utils/context.js';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

export async function setupGraphQL(app, httpServer) {
    console.info('SETUP - Configurando GraphQL...');

    const apolloServer = new ApolloServer({
        uploads: false, // No es necesario gestionar la carga aquí porque `graphql-upload` lo hace
        schema,
        context,
        formatError: (err) => {
            const error = {
                message: err.message,
                extensions: {
                    code: err.extensions.code,
                    http: err.extensions.http,
                },
            };
            return error;
        },
        introspection: true, // Para entornos de desarrollo
    });

    await apolloServer.start();

    // // Añade el middleware de graphqlUploadExpress para procesar las cargas de archivos
    app.use(
        '/graphql',
        graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), // Define límites de archivo
        expressMiddleware(apolloServer, {
            context: context,
        })
    );
}
