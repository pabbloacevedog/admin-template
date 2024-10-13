import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} from 'graphql';

import { RouteType, ActionType, ConditionType,ActionInputType } from '../route/type.js';

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
        owner_id: { type: GraphQLString},
        totalUsers: { type: GraphQLInt }, // Nuevo campo para el número total de usuarios
        avatars: { type: new GraphQLList(GraphQLString) }, // Nuevo campo para la lista de avatares
        message: {
            type: GraphQLString
        },
    })
});
// Input para crear un los permisos del role
const PermissionInputType = new GraphQLInputObjectType({
    name: 'PermissionInputType',
    fields: {
        route_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        path: { type: GraphQLString },
        icon: { type: GraphQLString },
        module_id: { type: GraphQLString },
        resource: { type: GraphQLString },
        actions: { type: new GraphQLList(ActionInputType) }  // Relación con Action
    }
});
// Input para crear un rol
const RoleInputType = new GraphQLInputObjectType({
    name: 'RoleInput',
    fields: {
        role_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        color: { type: GraphQLString },
        permission: {
            type: new GraphQLList(PermissionInputType),
        },
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
        color: { type: GraphQLString },
        permission: {
            type: new GraphQLList(PermissionInputType),
        },
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
