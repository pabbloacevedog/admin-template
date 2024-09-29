// src/graphql/user/queries.js
import { GraphQLList, GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLInt } from 'graphql';
import { UserType , PaginationInput, FilterInput} from './type.js';  // Asegúrate de tener definido el UserType
import { userResolver } from './resolvers.js';

export const getUsers = {
    type: new GraphQLList(UserType), // Retorna una lista de usuarios
    resolve: userResolver.Query.getUsers
};
// Definir el tipo que devolverá los usuarios y el total
const UsersResultType = new GraphQLObjectType({
    name: 'UsersResult',
    fields: () => ({
        users: { type: new GraphQLList(UserType) },
        totalUsers: { type: GraphQLInt }
    })
});
export const getAllUsers = {
    type: UsersResultType, // Retorna una lista de usuarios
    args: {
        pagination: { type: PaginationInput },
        filter: { type: FilterInput }
    },
    resolve: userResolver.Query.getAllUsers
};
export const getUserById = {
    type: UserType,  // Retorna un solo usuario
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: userResolver.Query.getUserById
};
