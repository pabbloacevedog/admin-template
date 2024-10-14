// src/graphql/user/mutations.js
import { GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { UserType, UserUpdateInputType, UpdateUserResponseType }  from './type.js'; // Asegúrate de tener definido el UserType
import { userResolver } from './resolvers.js';

export const createUser = {
    type: UserType,  // El tipo de retorno será el UserType
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLString },
        // rut_user: { type: GraphQLString },
        personal_phone: { type: GraphQLString },
        role_id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: userResolver.Mutation.createUser
};

export const updateUser = {
    type: UpdateUserResponseType, // Cambia esto al tipo de respuesta que has definido
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        input: { type: new GraphQLNonNull(UserUpdateInputType) }
    },
    resolve: userResolver.Mutation.updateUser
};

export const deleteUser = {
    type: UserType,  // Retorna un mensaje indicando si se eliminó con éxito
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: userResolver.Mutation.deleteUser
};
// Upload Single
export const UpdateAvatar = {
	type: new GraphQLNonNull(UserType),
	args: {
		userId: { type: GraphQLString },
        avatar: { type: new GraphQLNonNull(GraphQLUpload), },
    },
	resolve: userResolver.Mutation.updateAvatar
}
