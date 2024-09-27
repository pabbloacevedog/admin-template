// Imports
import { GraphQLObjectType } from 'graphql';

// Importa las mutaciones de cada modelo
import * as authMutations from './auth/mutations.js';
import * as userMutations from './user/mutations.js';
import * as roleMutations from './role/mutations.js';
// Mutation
const mutation = new GraphQLObjectType({
    name: 'mutations',
    description: 'This object contains all the mutations available for the application.',

    fields: {
        ...authMutations,
        ...userMutations,
        ...roleMutations,
    }
});

export default mutation;
