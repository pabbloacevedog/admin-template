// Imports
import {GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean} from 'graphql'
import UserType from  '../user/type.js';
// Auth type
const AuthType = new GraphQLObjectType({
    name: 'Login',
    description: 'Autentincación de usuario',

    fields: () => ({
        user_id: {
            type: GraphQLString
        },
        token: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        message: {
            type: GraphQLString
        },
        verification_code: {
            type: GraphQLString
        },
        actions: { type: new GraphQLList(GraphQLString) },
        user: { type: UserType },
        isAuth: { type: GraphQLBoolean}
    })
})

export default AuthType
