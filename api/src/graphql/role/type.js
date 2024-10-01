// src/graphql/role/type.js
import { GraphQLObjectType, GraphQLString } from 'graphql';

const RoleType = new GraphQLObjectType({
    name: 'Role',
    fields: () => ({
        role_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        color: { type: GraphQLString }
    })
});

export default RoleType;
