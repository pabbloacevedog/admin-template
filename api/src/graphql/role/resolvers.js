import models from '../../models/index.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';
import validatePermission from '../../utils/permissionValidator.js';
import { Op } from 'sequelize';

export const roleResolver = {
    Mutation: {
        // Crear un nuevo rol
        createRole: async (_, { input }, { user }) => {
            //validamos permisos antes de ejecutar la accion
            await validatePermission(user.user_id, 'create', 'roles', null);
            const { name, title, description, color, permission } = input;

            // Verificar si el rol ya existe
            const existingRole = await models.Role.findOne({ where: { name } });
            if (existingRole) throwCustomError(ErrorTypes.ROLE_ALREADY_EXISTS);

            // Iniciar una transacción
            const transaction = await models.sequelize.transaction();
            try {
                // Crear el rol
                const newRole = await models.Role.create({
                    name,
                    title,
                    description,
                    color,
                    owner_id: user.user_id
                }, { transaction });

                // Asignar permisos obligatorios (rutas obligatorias no públicas)
                const obligatoryRoutes = await models.Route.findAll({
                    where: { public: 0, obligatory: 1 }
                }, { transaction });

                // Asignar permisos obligatorios con la acción 'view' y la condición 'all'
                for (const route of obligatoryRoutes) {
                    await models.Permission.create({
                        role_id: newRole.role_id,
                        route_id: route.route_id,
                        action_id: 1, // Asumiendo que la acción 'view' tiene action_id = 1
                        condition_id: 2 // Asumiendo que la condición 'all' tiene condition_id = 2
                    }, { transaction });
                }
                // Asignar permisos dinámicos del formulario
                if (permission && permission.length > 0) {
                    for (const perm of permission) {
                        const { route_id, actions } = perm;

                        // Para cada acción dentro de la ruta
                        for (const action of actions) {
                            const { action_id, condition } = action;

                            // Crear un permiso por cada acción en la ruta
                            const createdPermission = await models.Permission.create({
                                role_id: newRole.role_id,
                                route_id: route_id,
                                action_id: action_id,
                                condition_id: condition ? condition.condition_id : null // Verifica si hay una condición
                            }, { transaction });

                            // Si la condición es 'others', insertar en ResourceAccess
                            if (condition && condition.name === 'others' || condition && condition.name === 'resource') {
                                const resourceAccess = condition.resourceAccess;
                                for (const other of resourceAccess) {
                                    await models.ResourceAccess.create({
                                        role_id: other.role_id || null,
                                        user_id: other.user_id || null,
                                        route_id: route_id,
                                        action_id: other.action_id,
                                        condition_id: other.condition_id || null,
                                        resource_type: other.resource_type,
                                        resource_id: other.resource_id,
                                        permission_id: createdPermission.permission_id
                                    }, { transaction });
                                }
                            }
                            // // Su la condición es 'resource' y se agrega el recurso al acceso
                            // if (condition && condition.name === 'resource') {
                            //     const resources = condition.resources;
                            //     for (const resource of resources) {
                            //         await models.ResourceAccess.create({
                            //             role_id: resource.role_id || null,
                            //             user_id: resource.user_id || null,
                            //             route_id: resource.route_id,
                            //             action_id: resource.action_id,
                            //             condition_id: resource.condition_id || null,
                            //             resource_type: resource.resource_type,
                            //             resource_id: resource.resource_id,
                            //             permission_id: createdPermission.permission_id
                            //         }, { transaction });
                            //     }
                            // }
                        }
                    }
                }

                // Confirmar la transacción
                await transaction.commit();
                const successMessage = getSuccessMessage('ROLE_CREATED');
                return { role_id: newRole.role_id, message: successMessage };
            } catch (error) {
                // Revertir la transacción en caso de error
                await transaction.rollback();
                throw error;
            }
        },
        // Actualizar un rol existente
        updateRole: async (_, { roleId, input }, { user }) => {
            // Verificar que el usuario tenga la acción de editar roles
            await validatePermission(user.user_id, 'update', 'roles', roleId);

            const { name, title, description, color, permission } = input;

            const transaction = await models.sequelize.transaction();
            try {
                // Actualizar el rol
                const role = await models.Role.findByPk(roleId);
                if (!role) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

                await role.update({
                    name,
                    title,
                    description,
                    color
                }, { transaction });

                // Actualizar los permisos asociados
                if (permission && permission.length > 0) {
                    // Obtener todas las rutas que no son obligatorias
                    const nonObligatoryRoutes = await models.Route.findAll({
                        attributes: ['route_id'],
                        where: { obligatory: 0 },
                        transaction
                    });

                    // Eliminar permisos solo de las rutas que no son obligatorias
                    // Primero, obtenemos los permisos existentes para eliminar los accesos
                    const existingPermissions = await models.Permission.findAll({
                        where: {
                            role_id: roleId,
                            route_id: nonObligatoryRoutes.map(route => route.route_id)
                        },
                        transaction
                    });

                    // Eliminar los registros de ResourceAccess asociados a los permisos existentes
                    const permissionIdsToDelete = existingPermissions.map(perm => perm.permission_id);
                    await models.ResourceAccess.destroy({
                        where: {
                            permission_id: permissionIdsToDelete
                        },
                        transaction
                    });

                    // Ahora, eliminamos los permisos
                    await models.Permission.destroy({
                        where: {
                            role_id: roleId,
                            route_id: nonObligatoryRoutes.map(route => route.route_id)
                        },
                        transaction
                    });

                    // Crear los nuevos permisos
                    for (const perm of permission) {
                        const { route_id, actions } = perm;

                        for (const action of actions) {
                            const { action_id, condition } = action;

                            // Crear nuevo permiso por cada acción
                            const permission = await models.Permission.create({
                                role_id: roleId,
                                route_id: route_id,
                                action_id: action_id,
                                condition_id: condition ? condition.condition_id : null
                            }, { transaction });

                            // Si la condición es 'others', se inserta en la tabla ResourceAccess
                            if (condition && condition.name === 'others' || condition && condition.name === 'resource') {
                                const resourceAccess = condition.resourceAccess;
                                for (const other of resourceAccess) {
                                    await models.ResourceAccess.create({
                                        role_id: other.role_id || null,
                                        user_id: other.user_id || null,
                                        route_id: route_id,
                                        action_id: other.action_id,
                                        condition_id: other.condition_id || null,
                                        resource_type: other.resource_type,
                                        resource_id: other.resource_id || null,
                                        permission_id: permission.permission_id
                                    }, { transaction });
                                }
                            }
                            // // Su la condición es 'resource' y se agrega el recurso al acceso
                            // if (condition && condition.name === 'resource') {
                            //     const resources = condition.resources;
                            //     for (const resource of resources) {
                            //         await models.ResourceAccess.create({
                            //             role_id: resource.role_id || null,
                            //             user_id: resource.user_id || null,
                            //             route_id: resource.route_id,
                            //             action_id: resource.action_id,
                            //             condition_id: resource.condition_id || null,
                            //             resource_type: resource.resource_type,
                            //             resource_id: resource.resource_id,
                            //             permission_id: permission.permission_id
                            //         }, { transaction });
                            //     }
                            // }
                        }
                    }
                }

                await transaction.commit();
                const successMessage = getSuccessMessage('ROLE_UPDATED');
                return { role, message: successMessage };
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        },

        // Eliminar un rol
        deleteRole: async (_, { roleId }, { user }) => {
            // Validamos permisos antes de ejecutar la acción
            await validatePermission(user.user_id, 'delete', 'roles', roleId);

            // Buscar el rol
            const role = await models.Role.findByPk(roleId);
            if (!role) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

            // Iniciar transacción
            const transaction = await models.sequelize.transaction();
            try {
                // Obtener todos los permisos relacionados con el rol
                const permissions = await models.Permission.findAll({
                    where: { role_id: roleId },
                    transaction
                });

                // Si hay permisos, eliminamos los registros de ResourceAccess relacionados
                if (permissions.length > 0) {
                    const permissionIds = permissions.map(perm => perm.permission_id);

                    // Eliminar los registros de ResourceAccess que se relacionan con los permisos
                    await models.ResourceAccess.destroy({
                        where: {
                            permission_id: permissionIds
                        },
                        transaction
                    });

                    // Ahora, eliminar los permisos relacionados con el rol
                    await models.Permission.destroy({
                        where: { role_id: roleId },
                        transaction
                    });
                }

                // Eliminar el rol
                await role.destroy({ transaction });

                // Confirmar la transacción
                await transaction.commit();

                // Retornar mensaje de éxito
                const successMessage = getSuccessMessage('ROLE_DELETED');
                return { message: successMessage };
            } catch (error) {
                // Si ocurre un error, hacer rollback de la transacción
                await transaction.rollback();
                throw error;
            }
        },


    },

    Query: {
        // Obtener todos los roles
        getRoles: async () => {
            const roles = await models.Role.findAll();
            return roles;
        },
        getRoleById: async (_, { roleId }) => {
            // Buscar el rol por ID con permisos, rutas, acciones, condiciones y accesos a recursos
            const role = await models.Role.findOne({
                where: { role_id: roleId },
                include: [{
                    model: models.Permission, // Incluye la relación con permisos
                    include: [
                        {
                            model: models.Route, // Incluir rutas asociadas
                            where: { public: 0, obligatory: 0 } // Filtro para las rutas
                        },
                        { model: models.Action },   // Incluir acciones asociadas
                        { model: models.Condition }, // Incluir condiciones asociadas
                        { // Incluir ResourceAccess solo si la condición es 'others' o 'resource'
                            model: models.ResourceAccess,
                            required: false // Para evitar filtrar los permisos sin ResourceAccess
                        }
                    ]
                }]
            });
            // console.log('role', role.Permissions);
            if (!role) {
                throw new Error("Role not found");
            }

            // Usar un objeto para acumular las rutas dentro de cada permiso
            const permissionsMap = {};

            role.Permissions.forEach(permission => {
                const { Route, Action, Condition, ResourceAccesses } = permission;

                // Crear o recuperar el permiso en el mapa
                if (!permissionsMap[permission.permission_id]) {
                    permissionsMap[permission.permission_id] = {
                        permission_id: permission.permission_id,
                        role_id: permission.role_id,
                        route: {}
                    };
                }

                // Verificar si la ruta ya existe en el permiso
                if (!permissionsMap[permission.permission_id].route[Route.route_id]) {
                    permissionsMap[permission.permission_id].route[Route.route_id] = {
                        route_id: Route.route_id,
                        name: Route.name,
                        title: Route.title,
                        description: Route.description,
                        path: Route.path,
                        icon: Route.icon,
                        module_id: Route.module_id,
                        action: []
                    };
                }

                // Buscar si la acción ya existe en la ruta
                const existingAction = permissionsMap[permission.permission_id].route[Route.route_id].action.find(action => action.action_id === Action.action_id);
                if (existingAction) {
                    // Si la acción ya existe, añadir la condición
                    if (Condition) {
                        existingAction.condition = {
                            condition_id: Condition.condition_id,
                            name: Condition.name,
                            title: Condition.title,
                            description: Condition.description
                        };
                        // Incluir ResourceAccess dentro de la condición si está presente
                        if (ResourceAccesses && ResourceAccesses.length > 0) {
                            existingAction.condition.resourceAccess = ResourceAccesses.map(resourceAccess => ({
                                resource_id: resourceAccess.resource_id,
                                resource_type: resourceAccess.resource_type,
                                user_id: resourceAccess.user_id,
                                role_id: resourceAccess.role_id,
                                action_id: resourceAccess.action_id,
                                condition_id: resourceAccess.condition_id
                            }));
                        }
                    }
                } else {
                    // Si la acción no existe, crear una nueva entrada para la acción
                    const newAction = {
                        action_id: Action.action_id,
                        name: Action.name,
                        title: Action.title,
                        description: Action.description,
                        icon: Action.icon,
                        condition: Condition ? {
                            condition_id: Condition.condition_id,
                            name: Condition.name,
                            title: Condition.title,
                            description: Condition.description,
                            // Incluir ResourceAccess dentro de la condición si está presente
                            resourceAccess: ResourceAccesses && ResourceAccesses.length > 0 ? ResourceAccesses.map(resourceAccess => ({
                                resource_id: resourceAccess.resource_id,
                                resource_type: resourceAccess.resource_type,
                                user_id: resourceAccess.user_id,
                                role_id: resourceAccess.role_id,
                                action_id: resourceAccess.action_id,
                                condition_id: resourceAccess.condition_id
                            })) : []
                        } : {}
                    };

                    permissionsMap[permission.permission_id].route[Route.route_id].action.push(newAction);
                }
            });

            // Convertir el mapa de permisos a un array
            const permissionsArray = Object.values(permissionsMap).map(permission => {
                return {
                    ...permission,
                    route: Object.values(permission.route) // Convertir las rutas a un array
                };
            });

            // Estructura de respuesta
            const response = {
                role_id: role.role_id,
                name: role.name,
                title: role.title,
                description: role.description,
                color: role.color,
                permission: permissionsArray
            };

            return response;
        },
        getAllRoles: async (_, { filter, pagination }, { user }) => {
            try {
                console.log('user logueado', user)
                const loggedInUserId = user.user_id; // Obtén el ID del usuario logueado
                const loggedInUserRole = user.role_id; // Obtén el role del usuario logueado

                // Busca el rol del usuario para verificar qué permisos tiene
                const userRole = await models.Role.findOne({
                    where: { role_id: loggedInUserRole },
                    include: [{
                        model: models.Permission,
                        include: [
                            { model: models.Action },
                            { model: models.Condition }
                        ]
                    }]
                });

                if (!userRole) {
                    throw new Error('No se encontró el rol del usuario logueado.');
                }

                // Filtra los permisos para obtener las acciones que puede realizar
                const viewPermission = userRole.Permissions.find(permission => permission.Action.name === 'view');
                const resourceAccessPermission = await models.ResourceAccess.findAll({
                    where: { permission_id: viewPermission.permission_id },
                });
                console.log('resourceAccessPermission', resourceAccessPermission)
                if (!viewPermission) {
                    throw new Error('No tienes permiso para ver roles.');
                }

                // Define el filtro según la condición del permiso
                let whereClause = {};
                if (viewPermission.Condition.name === 'all') {
                    whereClause = {
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    };
                } else if (viewPermission.Condition.name === 'owner_only') {
                    whereClause = {
                        owner_id: loggedInUserId, // Solo roles creados por el usuario logueado
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    };
                } else if (viewPermission.Condition.name === 'others') {
                    const resourceAccessPermission = models.resourceAccess.findAll({
                        where: { permission_id: viewPermission.permission_id },
                    });
                    console.log('resourceAccessPermission', resourceAccessPermission)
                    whereClause = {
                        role_id: {
                            [Op.ne]: loggedInUserRole // Excluir roles del mismo usuario logueado
                        },
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    };
                } else if (viewPermission.Condition.name === 'resource') {
                    const resourceAccessPermission = models.resourceAccess.findAll({
                        where: { permission_id: viewPermission.permission_id },
                    });
                    console.log('resourceAccessPermission', resourceAccessPermission)
                    // Implementa lógica para mostrar solo los roles con acceso a ciertos recursos
                    whereClause = {
                        resource_access: { [Op.eq]: true }, // Cambia esto según tu estructura
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    };
                }

                // Obtiene los roles con paginación
                const roles = await models.Role.findAll({
                    where: whereClause,
                    limit: pagination.rowsPerPage,
                    offset: (pagination.page - 1) * pagination.rowsPerPage,
                    include: [{
                        model: models.User,
                        attributes: ['avatar'],
                    }]
                });

                // Contar cuántos usuarios tienen cada role_id
                const rolesWithUserCount = await Promise.all(roles.map(async (role) => {
                    const userCount = await models.User.count({
                        where: { role_id: role.role_id }
                    });

                    return {
                        ...role.toJSON(),
                        totalUsers: userCount,
                        avatars: role.Users.map(user => user.avatar)
                    };
                }));

                // Obtener el total de roles (para la paginación)
                const totalRoles = await models.Role.count({
                    where: whereClause
                });

                return {
                    roles: rolesWithUserCount,
                    totalRoles
                };
            } catch (error) {
                throw new Error('Error al obtener los roles: ' + error.message);
            }
        },

        // // Obtener roles con paginación, filtro, total de usuarios y sus avatares
        // getAllRoles: async (_, { filter, pagination }) => {
        //     try {
        //         const roles = await models.Role.findAll({
        //             where: {
        //                 name: {
        //                     [Op.like]: `%${filter.search}%`
        //                 }
        //             },
        //             limit: pagination.rowsPerPage,
        //             offset: (pagination.page - 1) * pagination.rowsPerPage,
        //             include: [
        //                 {
        //                     model: models.User, // Asegúrate de que la asociación entre Role y User esté definida
        //                     attributes: ['avatar'], // Solo obtener el avatar de cada usuario
        //                 }
        //             ],
        //         });

        //         // Contar cuántos usuarios tienen cada role_id
        //         const rolesWithUserCount = await Promise.all(roles.map(async (role) => {
        //             const userCount = await models.User.count({
        //                 where: {
        //                     role_id: role.role_id
        //                 }
        //             });

        //             // Incluir el total de usuarios y avatares dentro del objeto role
        //             return {
        //                 ...role.toJSON(), // Convertimos el role a JSON para manipularlo
        //                 totalUsers: userCount,
        //                 avatars: role.Users.map(user => user.avatar) // Lista de avatares
        //             };
        //         }));

        //         // Obtener el total de roles (para la paginación)
        //         const totalRoles = await models.Role.count({
        //             where: {
        //                 name: {
        //                     [Op.like]: `%${filter.search}%`
        //                 }
        //             }
        //         });

        //         return {
        //             roles: rolesWithUserCount, // Ahora los roles incluyen el conteo de usuarios y sus avatares
        //             totalRoles
        //         };
        //     } catch (error) {
        //         throw new Error('Error al obtener los roles: ' + error.message);
        //     }
        // },




        // Obtener todas las rutas de la app
        getAllRoutesActionsConditions: async () => {
            try {
                const routes = await models.Route.findAll({
                    where: { public: 0, obligatory: 0 }
                });
                const actions = await models.Action.findAll();
                const conditions = await models.Condition.findAll();
                // console.log('routes', routes);
                // console.log('actions', actions);
                // console.log('conditions', conditions);
                return {
                    routes,
                    actions,
                    conditions
                };
            } catch (error) {
                throw new Error('Error al obtener los roles: ' + error.message);
            }
        },

        // Obtener roles por propietario (owner)
        getRolesByOwner: async (_, { filter, pagination }, { user }) => {
            try {
                const conditions = {
                    owner_id: user.user_id,
                    name: {
                        [Op.like]: `%${filter.search || ''}%`
                    }
                };

                const roles = await models.Role.findAll({
                    where: conditions,
                    limit: pagination.rowsPerPage,
                    offset: (pagination.page - 1) * pagination.rowsPerPage,
                });

                const totalRoles = await models.Role.count({
                    where: conditions
                });

                return {
                    roles,
                    totalRoles
                };
            } catch (error) {
                throw new Error('Error al obtener los roles: ' + error.message);
            }
        }
    },
};
