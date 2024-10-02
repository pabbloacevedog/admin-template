// schema/user/type.js
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInt, GraphQLInputObjectType } from 'graphql';
import RoleType from  '../role/type.js';
// Input para los usuarios
const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        user_id: { type: new GraphQLNonNull(GraphQLString) },
        // rut_user: { type: GraphQLString },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        personal_phone: { type: GraphQLString },
        verification_code: { type: GraphQLString },
        verified: { type: GraphQLBoolean },
        state: { type: GraphQLBoolean },
        avatar: { type: GraphQLString },
        role_id: { type: GraphQLInt },
        role: {
            type: RoleType,
            resolve: (user) => {
                return user.Role; // Asegúrate de que Sequelize devuelva el modelo 'Role'
            }
        },
        message: {
            type: GraphQLString
        },
    })
});
// Input para paginación
const PaginationInput = new GraphQLInputObjectType({
    name: 'PaginationInput',
    fields: {
        page: { type: GraphQLInt },
        rowsPerPage: { type: GraphQLInt }
    }
});

// Input para filtros
const FilterInput = new GraphQLInputObjectType({
    name: 'FilterInput',
    fields: {
        search: { type: GraphQLString },
    }
});
const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
        user_id: { type: new GraphQLNonNull(GraphQLString) },
        // rut_user: { type: GraphQLString },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        personal_phone: { type: GraphQLString },
        state: { type: GraphQLBoolean },
        role_id: { type: GraphQLInt },
    }
});
const UserUpdateInputType = new GraphQLInputObjectType({
    name: 'UserUpdateInput',
    fields: {
        user_id: { type: new GraphQLNonNull(GraphQLString) },
        // rut_user: { type: GraphQLString },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        personal_phone: { type: GraphQLString },
        state: { type: GraphQLBoolean },
        role_id: { type: GraphQLInt },
        message: { type: GraphQLString },
        user: { type: UserInputType } // Asegúrate de que sea UserInputType
    }
});
const UpdateUserResponseType = new GraphQLObjectType({
    name: 'UpdateUserResponse',
    fields: {
        user: { type: UserType }, // Asegúrate de que UserType esté bien definido
        message: { type: GraphQLString }
    }
});
export { PaginationInput, FilterInput, UserType, UserUpdateInputType, UpdateUserResponseType };
