// Imports
import { GraphQLSchema } from 'graphql';
import query from './query.js';
import mutation from './mutation.js';

// Schema
const schema = new GraphQLSchema({
    query,
    mutation,
});

export default schema;
