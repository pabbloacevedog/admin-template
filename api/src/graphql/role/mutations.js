// src/graphql/role/mutations.js
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { RoleType, RoleUpdateInputType, UpdateRoleResponseType }  from './type.js'; // Asegúrate de tener definido el RoleType
import { roleResolver } from './resolvers.js';

export const createRole = {
    type: RoleType,  // El tipo de retorno será el RoleType
    args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        color: { type: GraphQLString }
    },
    resolve: roleResolver.Mutation.createRole
};

export const updateRole = {
    type: UpdateRoleResponseType, // Cambia esto al tipo de respuesta que has definido
    args: {
        roleId: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(RoleUpdateInputType) }
    },
    resolve: roleResolver.Mutation.updateRole
};

export const deleteRole = {
    type: RoleType,  // Retorna un mensaje indicando si se eliminó con éxito
    args: {
        roleId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: roleResolver.Mutation.deleteRole
};
