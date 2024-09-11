// Imports
import {GraphQLObjectType, GraphQLString, GraphQLList} from 'graphql'

// Auth type
const AuthType = new GraphQLObjectType({
    name: 'Login',
    description: 'Autentincación de usuario',

    fields: () => ({
        user_id: {
            type: GraphQLString
        },
        rut_user: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        personal_phone: {
            type: GraphQLString
        },
        verification_code: {
            type: GraphQLString
        },
        verified: {
            type: GraphQLString
        },
        avatar: {
            type: GraphQLString
        },
        state: {
            type: GraphQLString
        },
		role_id: {
            type: GraphQLString
        },
        token: {
            type: GraphQLString
        },
        message: {
            type: GraphQLString
        },
        actions: { type: new GraphQLList(GraphQLString) },
        userData: { type: new GraphQLList(GraphQLString) },
    })
})

export default AuthType
