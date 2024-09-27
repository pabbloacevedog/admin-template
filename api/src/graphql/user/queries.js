// src/graphql/user/queries.js
import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import UserType from './type.js';  // Asegúrate de tener definido el UserType
import { userResolver } from './resolvers.js';

export const getUsers = {
    type: new GraphQLList(UserType), // Retorna una lista de usuarios
    resolve: userResolver.Query.getUsers
};

export const getUserById = {
    type: UserType,  // Retorna un solo usuario
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: userResolver.Query.getUserById
};
