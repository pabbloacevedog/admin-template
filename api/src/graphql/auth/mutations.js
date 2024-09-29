// auth/fields/mutations.js

import { GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType } from 'graphql';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import AuthType from './type.js';
import {UserType} from '../user/type.js';
import { authResolver } from './resolvers.js';

export const register = {
    type: AuthType,
    args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString },
        // ... otros campos necesarios
    },
    resolve: authResolver.Mutation.signup
};
export const VerifyEmail = {
    type: AuthType,
    args: {
        token: { type: GraphQLString },
    },
    resolve: authResolver.Mutation.verifyEmailToken,
};
export const forgotPassword = {
    type: AuthType,
    args: {
        email: { type: GraphQLString },
    },
    resolve: authResolver.Mutation.forgotPassword,
};
export const verifyCode = {
    type: AuthType,
    args: {
        verification_code: { type: GraphQLString },
    },
    resolve: authResolver.Mutation.verifyCode,
};
export const resetPassword = {
    type: AuthType,
    args: {
        userId: { type: GraphQLString },
        newPassword: { type: GraphQLString },
    },
    resolve: authResolver.Mutation.resetPassword,
};

export const changePassword = {
    type: AuthType,  // Devuelve true si la contraseña se actualizó correctamente
    args: {
        currentPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: authResolver.Mutation.changePassword
};
const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
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
        role_id: { type: GraphQLInt },
    }
});

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
        role_id: { type: GraphQLInt },
        message: { type: GraphQLString },
        user: { type: UserInputType } // Asegúrate de que sea UserInputType
    }
});
const UpdateUserResponseType = new GraphQLObjectType({
    name: 'UpdateUserResponse',
    fields: {
        user: { type: UserType }, // Asegúrate de que UserType esté bien definido
        message: { type: GraphQLString }
    }
});

export const updateUser = {
    type: UpdateUserResponseType, // Cambia esto al tipo de respuesta que has definido
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(UserUpdateInputType) }
    },
    resolve: authResolver.Mutation.updateUser
};

// Upload Single
export const UploadAvatar = {
	type: new GraphQLNonNull(UserType),
	args: {
		userId: { type: GraphQLString },
        avatar: { type: new GraphQLNonNull(GraphQLUpload), },
    },
	resolve: authResolver.Mutation.uploadAvatar
}
