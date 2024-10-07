export async function initializeModule(models) {
    /////////////////////> Dependecias fijas de todos los modulos </////////////////////////////////////////
    // Insertar módulos
    const [adminModule, created] = await models.Module.findOrCreate({
        where: { name: 'admin' },
        defaults: {
            name: 'admin',
            title: 'Administrator',
            description: 'Module for administrator web, with users, actions, roles, authorization and authentication.'
        }
    });

    const moduleId = adminModule.module_id;

    // Insertar rutas
    const routesArray = [
        {
            name: 'dashboard',
            title: 'Dashboard',
            description: 'View an overview of system metrics and important information. Provides quick access to the main features and statistics.',
            path: '/admin',
            icon: 'dashboard',
            public: true,
            resource: 'dashboard',
            module_id: moduleId
        },
        {
            name: 'users',
            title: 'Users',
            description: 'Access and manage your account settings, including personal information, security options, and notification preferences.',
            path: '/admin/users',
            icon: 'supervised_user_circle',
            public: false,
            resource: 'user',
            module_id: moduleId
        },
        {
            name: 'roles',
            title: 'Roles',
            description: 'Manage roles and permissions.',
            path: '/admin/roles',
            icon: 'attribution',
            public: false,
            resource: 'role',
            module_id: moduleId
        },
        {
            name: 'account_settings',
            title: 'Settings',
            description: 'Access and manage your account settings, including personal information, security options, and notification preferences.',
            path: '/admin/settings',
            icon: 'manage_accounts',
            public: false,
            resource: 'user',
            module_id: moduleId
        },
    ];

    const routes = await Promise.all(
        routesArray.map(route =>
            models.Route.findOrCreate({
                where: { name: route.name },
                defaults: {
                    title: route.title,
                    description: route.description,
                    path: route.path,
                    icon: route.icon,
                    public: route.public,
                    resource: route.resource,
                    module_id: route.module_id
                }
            })
        )
    );

    /////////////////////> Dependecias necesarias del modulo </////////////////////////////////////////

    // Insertar acciones
    const actionsArray = [
        {
            name: 'create',
            title: 'Create',
            description: 'Allows the user to create new records or entries in the system, giving them permission to add new data.'
        },
        {
            name: 'view',
            title: 'View',
            description: 'Grants the user access to view and retrieve data or records from the system without making modifications.'
        },
        {
            name: 'update',
            title: 'Update',
            description: 'Provides the user with the ability to modify or edit existing records or data in the system.'
        },
        {
            name: 'delete',
            title: 'Delete',
            description: 'Enables the user to remove or permanently delete existing records or data from the system.'
        }
    ];

    const actions = await Promise.all(
        actionsArray.map(action =>
            models.Action.findOrCreate({
                where: { name: action.name },
                defaults: {
                    title: action.title,
                    description: action.description
                }
            })
        )
    );
    // Insertar Condiciones
    const conditionsArray = [
        {
            name: 'owner_only',
            title: 'owner_only',
            description: 'Allows the user to access only if the user is the owner of the resource.'
        },
        {
            name: 'all',
            title: 'All',
            description: 'Allows the user to access all resources.'
        }
    ];

    const conditions = await Promise.all(
        conditionsArray.map(condition =>
            models.Condition.findOrCreate({
                where: { name: condition.name },
                defaults: {
                    title: condition.title,
                    description: condition.description
                }
            })
        )
    );
    // Insertar roles
    const rolesArray = [
        {
            name: 'admin',
            title: 'Administrator',
            description: 'The administrator role has full access to all features and settings in the system, including user management and system configuration.',
            color: 'admin',
            owner_id: '1',
            role_id: 1
        },
        {
            name: 'user',
            title: 'User',
            description: 'The user role provides access to basic system functionalities, allowing the user to interact with the platform but with limited permissions.',
            color: 'role-color-3',
            owner_id: '1',
            role_id: 2
        }
    ];

    const roles = await Promise.all(
        rolesArray.map(role =>
            models.Role.findOrCreate({
                where: { name: role.name },
                defaults: {
                    title: role.title,
                    description: role.description,
                    color: role.color,
                    owner_id: role.owner_id
                }
            })
        )
    );

    const roleIndex = roles.reduce((acc, [role]) => {
        acc[role.name] = role;
        return acc;
    }, {});

    const actionIndex = actions.reduce((acc, [action]) => {
        acc[action.name] = action;
        return acc;
    }, {});

    const conditionIndex = conditions.reduce((acc, [condition]) => {
        acc[condition.name] = condition;
        return acc;
    }, {});
    const routeIndex = routes.reduce((acc, [route]) => {
        acc[route.name] = route;
        return acc;
    }, {});

    // Obtener los IDs de roles, acciones y rutas
    const adminRole = roleIndex['admin'];
    const userRole = roleIndex['user'];
    const createAction = actionIndex['create'];
    const viewAction = actionIndex['view'];
    const updateAction = actionIndex['update'];
    const deleteAction = actionIndex['delete'];

    const ownerCondition = conditionIndex['owner_only'];
    const allCondition = conditionIndex['all'];

    const dashboardRoute = routeIndex['dashboard'];
    const settingsRoute = routeIndex['account_settings'];
    const userRoute = routeIndex['users'];
    const roleRoute = routeIndex['roles'];

    // Insertar permisos en la tabla Permission
    const permissions = [
        // Permisos para el rol admin
        { role_id: adminRole.dataValues.role_id, route_id: dashboardRoute.dataValues.route_id, action_id: createAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: dashboardRoute.dataValues.route_id, action_id: viewAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: dashboardRoute.dataValues.route_id, action_id: updateAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: dashboardRoute.dataValues.route_id, action_id: deleteAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: userRoute.dataValues.route_id, action_id: createAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: userRoute.dataValues.route_id, action_id: viewAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: userRoute.dataValues.route_id, action_id: updateAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: roleRoute.dataValues.route_id, action_id: deleteAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },

        { role_id: adminRole.dataValues.role_id, route_id: roleRoute.dataValues.route_id, action_id: createAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: roleRoute.dataValues.route_id, action_id: viewAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: roleRoute.dataValues.route_id, action_id: updateAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: settingsRoute.dataValues.route_id, action_id: viewAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: adminRole.dataValues.role_id, route_id: settingsRoute.dataValues.route_id, action_id: viewAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        // Permisos para el rol user
        { role_id: userRole.dataValues.role_id, route_id: dashboardRoute.dataValues.route_id, action_id: viewAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: userRole.dataValues.role_id, route_id: settingsRoute.dataValues.route_id, action_id: viewAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: userRole.dataValues.role_id, route_id: userRoute.dataValues.route_id, action_id: viewAction.dataValues.action_id, condition_id: allCondition.dataValues.condition_id },
        { role_id: userRole.dataValues.role_id, route_id: userRoute.dataValues.route_id, action_id: updateAction.dataValues.action_id, condition_id: ownerCondition.dataValues.condition_id }
    ];

    // Crear todos los permisos en la tabla Permission
    const createdPermissions = await Promise.all(
        permissions.map(permission =>
            models.Permission.findOrCreate({ where: permission })
        )
    );

    console.log('Datos iniciales insertados con éxito.');
}
