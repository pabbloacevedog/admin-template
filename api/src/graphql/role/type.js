// src/graphql/role/type.js
import { GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLInt } from 'graphql';

// Definición del tipo de rol
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

// Input para crear un rol
const RoleInputType = new GraphQLInputObjectType({
    name: 'RoleInput',
    fields: {
        role_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        color: { type: GraphQLString }
    }
});

// Input para actualizar un rol
const RoleUpdateInputType = new GraphQLInputObjectType({
    name: 'RoleUpdateInput',
    fields: {
        role_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        color: { type: GraphQLString }
    }
});

// Tipo de respuesta para la actualización de roles
const UpdateRoleResponseType = new GraphQLObjectType({
    name: 'UpdateRoleResponse',
    fields: {
        role: { type: RoleType },
        message: { type: GraphQLString }
    }
});

export { RoleType, RoleInputType, RoleUpdateInputType, UpdateRoleResponseType };
