// schema/user/mutations.js
import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt,GraphQLInputObjectType } from 'graphql';
import UserType from './type.js';
import { userResolver } from './resolvers.js';

export const addUser = {
    type: UserType,
    args: {
        rut_user: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        personal_phone: { type: new GraphQLNonNull(GraphQLString) },
        verification_code: { type: GraphQLString },
        verified: { type: GraphQLBoolean },
        state: { type: GraphQLString },
        avatar: { type: GraphQLString },
        role_id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve: userResolver.Mutation.addUser
};

export const editUser = {
    type: UserType,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLString) },
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
    },
    resolve: userResolver.Mutation.editUser
};

export const removeUser = {
    type: GraphQLString,
    args: {
        user_id: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: userResolver.Mutation.removeUser
};
export const editUserProfile = {
    type: UserType,
    args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        personal_phone: { type: GraphQLString },
        avatar: { type: GraphQLString }
    },
    resolve: userResolver.Mutation.editUserProfile
};

export const changePassword = {
    type: GraphQLBoolean,  // Devuelve true si la contraseña se actualizó correctamente
    args: {
        currentPassword: { type: new GraphQLNonNull(GraphQLString) },
        newPassword: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: userResolver.Mutation.changePassword
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
    resolve: userResolver.Mutation.updateUser
};
