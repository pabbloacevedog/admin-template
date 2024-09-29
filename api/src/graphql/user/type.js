// schema/user/type.js
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLInt, GraphQLInputObjectType } from 'graphql';
import RoleType from  '../role/type.js';
// Input para los usuarios
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
        role_id: { type: GraphQLInt },
        role: {
            type: RoleType,
            resolve: (user) => {
                return user.Role; // Asegúrate de que Sequelize devuelva el modelo 'Role'
            }
        }
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
export { PaginationInput, FilterInput, UserType };
