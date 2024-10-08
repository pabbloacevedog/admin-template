// src/graphql/role/queries.js
import { GraphQLList, GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLInt } from 'graphql';
import { RoleType } from './type.js';  // Asegúrate de tener definido el RoleType
import { PaginationInput, FilterInput } from '../global/type.js';
import { roleResolver } from './resolvers.js';
import { RouteType, ActionType, ConditionType } from '../route/type.js';
export const getRoles = {
    type: new GraphQLList(RoleType), // Retorna una lista de usuarios
    resolve: roleResolver.Query.getRoles
};
const RoleConfigurationType = new GraphQLObjectType({
    name: 'RoleConfiguration',
    fields: () => ({
        routes: { type: new GraphQLList(RouteType) },
        actions: { type: new GraphQLList(ActionType) },
        conditions: { type: new GraphQLList(ConditionType) }
    })
});

export const getRoleConfiguration = {
    type: RoleConfigurationType,
    name: 'getRoleConfiguration',
    resolve: roleResolver.Query.getAllRoutesActionsConditions
};

// Definir el tipo que devolverá los usuarios y el total
const RolesResultType = new GraphQLObjectType({
    name: 'RolesResult',
    fields: () => ({
        roles: { type: new GraphQLList(RoleType) },
        totalRoles: { type: GraphQLInt }
    })
});
export const getAllRoles = {
    type: RolesResultType, // Retorna una lista de usuarios
    args: {
        pagination: { type: PaginationInput },
        filter: { type: FilterInput }
    },
    resolve: roleResolver.Query.getAllRoles
};
export const getRolesByOwner = {
    type: RolesResultType, // Retorna una lista de usuarios
    args: {
        pagination: { type: PaginationInput },
        filter: { type: FilterInput }
    },
    resolve: roleResolver.Query.getRolesByOwner
};
export const getRoleById = {
    type: RoleType,  // Retorna un solo usuario
    args: {
        roleId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: roleResolver.Query.getRoleById
};
