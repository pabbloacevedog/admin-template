// schema/user/mutations.js
import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
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

