// auth/fields/mutations.js

import { GraphQLString, GraphQLID } from 'graphql';
import AuthType from './type.js';
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

// export const updateUser = {
//     type: AuthType,
//     args: {
//         user_id: { type: GraphQLID },
//         name: { type: GraphQLString },
//         email: { type: GraphQLString },
//         password: { type: GraphQLString },
//         personal_phone: { type: GraphQLString },
//         avatar: { type: GraphQLString },
//         state: { type: GraphQLString },
//     },
//     resolve: authResolver.Mutation.updateUser,
// };
