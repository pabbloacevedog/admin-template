// Imports
import { GraphQLObjectType } from 'graphql';

// Importa las mutaciones de cada modelo
import * as authMutations from './auth/mutations.js';
// Mutation
const mutation = new GraphQLObjectType({
    name: 'mutations',
    description: 'This object contains all the mutations available for the application.',

    fields: {
        ...authMutations,
    }
});

export default mutation;
