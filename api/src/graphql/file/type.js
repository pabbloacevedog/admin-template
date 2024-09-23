// Imports
import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
} from 'graphql'
// FileType
const FileType = new GraphQLObjectType({
    name: 'FileType',
    description: 'File',

    fields: () => ({
        id: {
            description: 'Unique ID.',
            type: new GraphQLNonNull(GraphQLID),
        },
        path: {
            description: 'Where it’s stored in the filesystem.',
            type: new GraphQLNonNull(GraphQLString),
        },
        filename: {
            description: 'Filename, including extension.',
            type: new GraphQLNonNull(GraphQLString),
        },
        mimetype: {
            description: 'MIME type.',
            type: new GraphQLNonNull(GraphQLString),
        },
    })
})

export default FileType
