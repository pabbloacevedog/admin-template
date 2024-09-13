// auth/fields/mutations.js

import { GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInputObjectType, GraphQLInt } from 'graphql';
import AuthType from './type.js';
import UserType from '../user/type.js';
import { authResolver } from './resolvers.js';

export const register = {
    type: AuthType,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        // ... otros campos necesarios
    },
    resolve: authResolver.Mutation.signup
};

export const forgotPassword = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
    },
    resolve: authResolver.Mutation.forgotPassword,
};

export const resetPassword = {
    type: GraphQLString,
    args: {
        verification_code: { type: GraphQLString },
        newPassword: { type: GraphQLString },
    },
    resolve: authResolver.Mutation.resetPassword,
};

export const changePassword = {
    type: GraphQLBoolean,  // Devuelve true si la contraseña se actualizó correctamente
    args: {
        currentPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: authResolver.Mutation.changePassword
};

const UserUpdateInputType = new GraphQLInputObjectType({
    name: 'UserUpdateInput',
    fields: {
        rut_user: { type: GraphQLString },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        personal_phone: { type: GraphQLString },
        verification_code: { type: GraphQLString },
        verified: { type: GraphQLBoolean },
        state: { type: GraphQLString },
        avatar: { type: GraphQLString },
        role_id: { type: GraphQLInt }
    }
});
export const updateUser = {
    type: UserType,
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(UserUpdateInputType) }
    },
    resolve: authResolver.Mutation.updateUser
};

