// schema/user/type.js
import {  GraphQLString, GraphQLInt, GraphQLInputObjectType } from 'graphql';
// Input para paginación
const PaginationInput = new GraphQLInputObjectType({
    name: 'PaginationInput',
    fields: {
        page: { type: GraphQLInt },
        rowsPerPage: { type: GraphQLInt }
    }
});

// Input para filtros
const FilterInput = new GraphQLInputObjectType({
    name: 'FilterInput',
    fields: {
        search: { type: GraphQLString },
    }
});
export { PaginationInput, FilterInput };
