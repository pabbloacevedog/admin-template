// src/graphql/user/mutations.js
import { GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType } from 'graphql';
import UserType from './type.js'; // Asegúrate de tener definido el UserType
import { userResolver } from './resolvers.js';

export const createUser = {
    type: UserType,  // El tipo de retorno será el UserType
    args: {
        input: {
            type: new GraphQLNonNull(new GraphQLInputObjectType({
                name: 'CreateUserInput',
                fields: {
                    email: { type: new GraphQLNonNull(GraphQLString) },
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                    rut_user: { type: GraphQLString },
                    personal_phone: { type: GraphQLString },
                    role_id: { type: new GraphQLNonNull(GraphQLInt) },
                }
            })),
        },
    },
    resolve: userResolver.Mutation.createUser
};

export const updateUser = {
    type: UserType,  // Retorna el UserType actualizado
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        input: {
            type: new GraphQLNonNull(new GraphQLInputObjectType({
                name: 'UpdateUserInput',
                fields: {
                    email: { type: GraphQLString },
                    name: { type: GraphQLString },
                    password: { type: GraphQLString },
                    rut_user: { type: GraphQLString },
                    personal_phone: { type: GraphQLString },
                    verified: { type: GraphQLBoolean },
                    role_id: { type: GraphQLInt },
                }
            })),
        },
    },
    resolve: userResolver.Mutation.updateUser
};

export const deleteUser = {
    type: GraphQLString,  // Retorna un mensaje indicando si se eliminó con éxito
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: userResolver.Mutation.deleteUser
};
