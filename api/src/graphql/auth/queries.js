
import { GraphQLString } from 'graphql';
import AuthType from './type.js';
import { authResolver } from './resolvers.js';

export const login = {
    type: AuthType,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    resolve: authResolver.Query.login
};

export const userSettings = {
    type: AuthType,
    args: {
        userId: { type: GraphQLString },
    },
    resolve: authResolver.Query.userSettings,
};
