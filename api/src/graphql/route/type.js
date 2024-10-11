import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInputObjectType } from 'graphql';

// ConditionType
const ConditionType = new GraphQLObjectType({
    name: 'Condition',
    fields: () => ({
        condition_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
    })
});
const OtherInputType = new GraphQLInputObjectType({
    name: 'OtherInputType',
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
        others: { type: new GraphQLList(OtherInputType) } // Definir 'others' como lista de objetos OtherInputType
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
// Input para crear un los permisos del role
// const RouteInputType = new GraphQLInputObjectType({
//     name: 'RouteInputType',
//     fields: {
//         route_id: { type: GraphQLString },
//         name: { type: GraphQLString },
//         title: { type: GraphQLString },
//         description: { type: GraphQLString },
//         path: { type: GraphQLString },
//         icon: { type: GraphQLString },
//         module_id: { type: GraphQLString },
//         actions: { type: new GraphQLList(ActionInputType) }  // Relación con Action
//     }
// });


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
        action: { type: new GraphQLList(ActionType) }  // Relación con Action
    })
});

export { RouteType, ActionType, ConditionType,ActionInputType };
