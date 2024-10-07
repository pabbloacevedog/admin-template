import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} from 'graphql';

import { RouteType, ActionType, ConditionType } from '../route/type.js';

// Definición del tipo de Permission
const PermissionType = new GraphQLObjectType({
    name: 'Permission',
    fields: () => ({
        permission_id: { type: GraphQLInt },
        role_id: { type: GraphQLInt },
        route: {
            type: new GraphQLList(RouteType),
        },  // Relación con Route
        action: {
            type: new GraphQLList(ActionType),
        },  // Relación con Route
        condition: { type: ConditionType }
    })
});

// Definición del tipo de rol, ahora con las relaciones hacia las permissions, routes, actions y conditions
const RoleType = new GraphQLObjectType({
    name: 'Role',
    fields: () => ({
        role_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        color: { type: GraphQLString },
        permission: {
            type: new GraphQLList(PermissionType),
        },
        message: {
            type: GraphQLString
        },
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

export {
    RoleType,
    RoleInputType,
    RoleUpdateInputType,
    UpdateRoleResponseType,
    PermissionType
};
