import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';

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

// ActionType
const ActionType = new GraphQLObjectType({
    name: 'Action',
    fields: () => ({
        action_id: { type: GraphQLString },
        name: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        condition: { type: ConditionType }  // Relación con Condition
    })
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
        action: { type: new GraphQLList(ActionType) }  // Relación con Action
    })
});

export { RouteType, ActionType, ConditionType };
