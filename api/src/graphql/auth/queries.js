
import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';
import AuthType from './type.js';
import { RouteType } from '../route/type.js';
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

export const userRoutes = {
    type: new GraphQLList(RouteType),
    resolve: authResolver.Query.userRoutes,
};
export const isAuth = {
    type: AuthType,
    resolve: authResolver.Query.isAuth, // Resolver que manejará la autenticación
};
export const isAuthBool = {
    type: AuthType,
    resolve: authResolver.Query.isAuthBool, // Resolver que manejará la autenticación
};
export const logout = {
    type: AuthType,
    resolve: authResolver.Query.logout, // Resolver que manejará la autenticación
};
