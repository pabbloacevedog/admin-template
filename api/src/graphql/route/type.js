// Imports
import {
    GraphQLObjectType,
    GraphQLString,
} from 'graphql'
// routeType
const routeType = new GraphQLObjectType({
    name: 'Route',  // Nombre en mayúsculas por convención para tipos de salida
    description: 'Rutas de la aplicación',
    fields: () => ({
        route_id: {
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
        path: {
            type: GraphQLString
        },
        icon: {
            type: GraphQLString
        },
        module_id: {
            type: GraphQLString
        },
    })
});

export default routeType
