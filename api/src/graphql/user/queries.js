// schema/user/queries.js

import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import UserType from './type.js';
import { userResolver } from  './resolvers.js';

export const users = {
    type: new GraphQLList(UserType),
    resolve: userResolver.Query.users
};

export const user = {
    type: UserType,
    args: { user_id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: userResolver.Query.user
};
