// src/graphql/role/queries.js
import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import RoleType from './type.js'; // Asegúrate de tener definido el RoleType
import { roleResolver } from './resolvers.js';

export const getRoles = {
    type: new GraphQLList(RoleType), // Retorna una lista de roles
    resolve: roleResolver.Query.getRoles
};

export const getRoleById = {
    type: RoleType, // Retorna un solo rol
    args: {
        roleId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: roleResolver.Query.getRoleById
};
