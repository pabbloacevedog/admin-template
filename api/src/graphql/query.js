// Imports
import { GraphQLObjectType } from 'graphql';

// Importa las consultas de cada modelo

import * as authQueries from './auth/queries.js';
import * as userQueries from './user/queries.js';
import * as roleQueries from './role/queries.js';
console.info(`INFO - Cargando queries.`);

// Queries
const query = new GraphQLObjectType({
    name: 'query',
    description: 'This object contains all the queries available for the application.',

    fields: () => ({
        ...authQueries,
        ...userQueries,
        ...roleQueries,
    })
});

export default query;
