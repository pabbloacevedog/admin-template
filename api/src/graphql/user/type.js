// schema/user/type.js
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInt } from 'graphql';

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        user_id: { type: new GraphQLNonNull(GraphQLString) },
        rut_user: { type: GraphQLString },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        personal_phone: { type: GraphQLString },
        verification_code: { type: GraphQLString },
        verified: { type: GraphQLBoolean },
        state: { type: GraphQLString },
        avatar: { type: GraphQLString },
        role_id: { type: GraphQLInt }
    })
});

export default UserType;
