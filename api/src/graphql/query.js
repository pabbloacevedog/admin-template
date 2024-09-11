// Imports
import { GraphQLObjectType } from 'graphql';

// Importa las consultas de cada modelo

import * as authQueries from './auth/queries.js';

console.info(`INFO - Cargando queries.`);

// Queries
const query = new GraphQLObjectType({
    name: 'query',
    description: 'This object contains all the queries available for the application.',

    fields: () => ({
        ...authQueries,
    })
});

export default query;
