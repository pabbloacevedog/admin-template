import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType } from 'graphql';

// ResourceAccessType
const ResourceAccessType = new GraphQLObjectType({
    name: 'ResourceAccess',
    fields: () => ({
        resource_id: { type: GraphQLString },
        resource_type: { type: GraphQLString },
        user_id: { type: GraphQLString },
        role_id: { type: GraphQLString },
        action_id: { type: GraphQLString },
        condition_id: { type: GraphQLString },
        permission_id: { type: GraphQLString },
    })
});

// ConditionType
const ConditionType = new GraphQLObjectType({
    name: 'Condition',
    fields: () => ({
        condition_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        resourceAccess: {
            type: new GraphQLList(ResourceAccessType),
        }
    })
});
const ResourceAccessInputType = new GraphQLInputObjectType({
    name: 'ResourceAccessInputType',
    fields: {
        role_id: { type: GraphQLString },
        route_id: { type: GraphQLString },
        action_id: { type: GraphQLString },
        condition_id: { type: GraphQLString },
        type: { type: GraphQLString },
        user_id: { type: GraphQLString },
        role_id: { type: GraphQLString },
        resource_type: { type: GraphQLString },
        resource_id: { type: GraphQLString },
        id: { type: GraphQLString },
    }
});

// Input para crear un los permisos del role
const ConditionInputType = new GraphQLInputObjectType({
    name: 'ConditionInputType',
    fields: {
        condition_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        //agregar others como array
        resourceAccess: { type: new GraphQLList(ResourceAccessInputType) } // Definir 'others' como lista de objetos OtherInputType
    }
});
// ActionType
const ActionType = new GraphQLObjectType({
    name: 'Action',
    fields: () => ({
        action_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        icon: { type: GraphQLString },
        condition: { type: ConditionType }  // Relación con Condition
    })
});
// Input para crear un los permisos del role
const ActionInputType = new GraphQLInputObjectType({
    name: 'ActionInputType',
    fields: {
        route_id: { type: GraphQLString },
        action_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        icon: { type: GraphQLString },
        condition: { type: ConditionInputType }  // Relación con Condition
    }
});

// RouteType
const RouteType = new GraphQLObjectType({
    name: 'Route',
    fields: () => ({
        route_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        path: { type: GraphQLString },
        icon: { type: GraphQLString },
        module_id: { type: GraphQLString },
        action: { type: new GraphQLList(ActionType) },  // Relación con Action
        resource: { type: GraphQLString },
    })
});

export { RouteType, ActionType, ConditionType,ActionInputType };
