// src/graphql/role/mutations.js
import { GraphQLString, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import RoleType from './type.js'; // Asegúrate de tener definido el RoleType
import { roleResolver } from './resolvers.js';

export const createRole = {
    type: RoleType, // Retorna el RoleType
    args: {
        input: {
            type: new GraphQLNonNull(new GraphQLInputObjectType({
                name: 'CreateRoleInput',
                fields: {
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    title: { type: new GraphQLNonNull(GraphQLString) },
                    description: { type: new GraphQLNonNull(GraphQLString) },
                }
            })),
        },
    },
    resolve: roleResolver.Mutation.createRole
};

export const updateRole = {
    type: RoleType, // Retorna el RoleType actualizado
    args: {
        roleId: { type: new GraphQLNonNull(GraphQLString) },
        input: {
            type: new GraphQLNonNull(new GraphQLInputObjectType({
                name: 'UpdateRoleInput',
                fields: {
                    name: { type: GraphQLString },
                    title: { type: GraphQLString },
                    description: { type: GraphQLString },
                }
            })),
        },
    },
    resolve: roleResolver.Mutation.updateRole
};

export const deleteRole = {
    type: GraphQLString, // Retorna un mensaje indicando si se eliminó con éxito
    args: {
        roleId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: roleResolver.Mutation.deleteRole
};
