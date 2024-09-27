// Imports
import {
    GraphQLObjectType,
    GraphQLString,
} from 'graphql'
// actionType
const actionType = new GraphQLObjectType({
    name: 'Action',  // Nombre en mayúsculas por convención para tipos de salida
    description: 'Acciones de la aplicación',
    fields: () => ({
        action_id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
    })
});

export default actionType
