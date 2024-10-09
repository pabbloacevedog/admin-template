import models from '../../models/index.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';
import validatePermission from '../../utils/permissionValidator.js';
import { Op } from 'sequelize';

export const roleResolver = {
    Mutation: {
        // Crear un nuevo rol
        // createRole: async (_, args, { user }) => {
        //     const { name, ...rest } = args;
        //     // Verificar si el rol ya existe
        //     const existingRole = await models.Role.findOne({ where: { name } });
        //     if (existingRole) throwCustomError(ErrorTypes.ROLE_ALREADY_EXISTS);
        //     // Crear el rol
        //     const transaction = await models.sequelize.transaction();
        //     try {
        //         const newRole = await models.Role.create({
        //             name,
        //             ...rest,
        //             owner_id: user.user_id
        //         }, { transaction });
        //         // Buscar las rutas obligatorias que no son públicas
        //         const obligatoryRoutes = await models.Route.findAll({
        //             where: { public: 0, obligatory: 1 }
        //         }, { transaction });

        //         // Asignar permisos por cada ruta obligatoria con la acción 'view' y la condición 'all'
        //         for (const route of obligatoryRoutes) {
        //             await models.Permission.create({
        //                 role_id: newRole.role_id,
        //                 route_id: route.route_id,
        //                 action_id: 1, // Asumiendo que la acción 'view' tiene action_id = 1
        //                 condition_id: 2 // Asumiendo que la condición 'all' tiene condition_id = 2
        //             }, { transaction });
        //         }
        //         await transaction.commit();
        //         const successMessage = getSuccessMessage('ROLE_CREATED');
        //         return { role_id: newRole.role_id, message: successMessage };
        //     } catch (error) {
        //         await transaction.rollback();
        //         throw error;
        //     }

        // },
        createRole: async (_, { input }, { user }) => {
            // Verificar que el usuario tenga la acción de editar roles
            console.log('input', input);
            const userIdEditor = user.user_id;
            await validatePermission(userIdEditor, 'create', 'roles', null);
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
                            await models.Permission.create({
                                role_id: newRole.role_id,
                                route_id: route_id,
                                action_id: action_id,
                                condition_id: condition ? condition.condition_id : null // Verifica si hay una condición
                            }, { transaction });
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
        // async updateRole(_, { roleId, input }, { user }) {
        //     try {
        //         // Verificar que el usuario tenga la acción de editar roles
        //         const userIdEditor = user.user_id;
        //         await validatePermission(userIdEditor, 'update', 'roles', roleId);

        //         const roleToEdit = await models.Role.findByPk(roleId);
        //         if (!roleToEdit) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

        //         // Verificar si el nuevo nombre ya pertenece a otro rol
        //         if (input.name) {
        //             const existingRole = await models.Role.findOne({
        //                 where: { name: input.name, role_id: { [Op.ne]: roleId } }
        //             });
        //             if (existingRole) {
        //                 throwCustomError(ErrorTypes.ROLE_NAME_ALREADY_IN_USE);
        //             }
        //         }

        //         // Actualizar los campos proporcionados
        //         await roleToEdit.update({
        //             name: input.name || roleToEdit.name,
        //             title: input.title || roleToEdit.title,
        //             description: input.description || roleToEdit.description,
        //             color: input.color || roleToEdit.color,
        //         });

        //         const successMessage = getSuccessMessage('ROLE_UPDATED');
        //         return { role: roleToEdit.get(), message: successMessage };
        //     } catch (error) {
        //         throw new Error("Error updating role: " + error.message);
        //     }
        // },
        updateRole: async (_, { roleId, input }, { user }) => {
            // Verificar que el usuario tenga la acción de editar roles
            console.log('input', input);
            const userIdEditor = user.user_id;
            await validatePermission(userIdEditor, 'update', 'roles', roleId);

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
                    // Eliminar los permisos actuales
                    await models.Permission.destroy({ where: { role_id: roleId }, transaction });

                    // Crear los nuevos permisos
                    for (const perm of permission) {
                        const { route_id, actions } = perm;  // Aquí asumimos que cada permiso tiene una ruta y un array de acciones

                        // Para cada acción dentro de la ruta
                        for (const action of actions) {
                            const { action_id, condition } = action;

                            // Crear nuevo permiso por cada acción
                            await models.Permission.create({
                                role_id: roleId,
                                route_id: route_id,
                                action_id: action_id,  // Acción específica
                                condition_id: condition ? condition.condition_id : null // Verifica si hay una condición
                            }, { transaction });
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
        deleteRole: async (_, { roleId }) => {
            // Buscar el rol
            const role = await models.Role.findByPk(roleId);
            if (!role) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

            // Iniciar transacción
            const transaction = await models.sequelize.transaction();
            try {
                // Eliminar los permisos relacionados con el rol
                await models.Permission.destroy({
                    where: { role_id: roleId },
                    transaction
                });

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
            // Buscar el rol por ID con permisos, rutas, acciones y condiciones
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
                        { model: models.Condition } // Incluir condiciones asociadas
                    ]
                }]
            });


            if (!role) {
                throw new Error("Role not found");
            }

            // Usar un objeto para acumular las rutas dentro de cada permiso
            const permissionsMap = {};

            role.Permissions.forEach(permission => {
                const { Route, Action, Condition } = permission;

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
                        // console.log('Condition: ', Condition);
                        existingAction.condition = {
                            condition_id: Condition.condition_id,
                            name: Condition.name,
                            title: Condition.title,
                            description: Condition.description,
                        };
                    }
                } else {
                    // console.log('Condition: ', Condition);
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
                            description: Condition.description
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

            // console.log('permissionsArray: ', permissionsArray);

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
        // Obtener roles con paginación, filtro, total de usuarios y sus avatares
        getAllRoles: async (_, { filter, pagination }) => {
            try {
                const roles = await models.Role.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    },
                    limit: pagination.rowsPerPage,
                    offset: (pagination.page - 1) * pagination.rowsPerPage,
                    include: [
                        {
                            model: models.User, // Asegúrate de que la asociación entre Role y User esté definida
                            attributes: ['avatar'], // Solo obtener el avatar de cada usuario
                        }
                    ],
                });

                // Contar cuántos usuarios tienen cada role_id
                const rolesWithUserCount = await Promise.all(roles.map(async (role) => {
                    const userCount = await models.User.count({
                        where: {
                            role_id: role.role_id
                        }
                    });

                    // Incluir el total de usuarios y avatares dentro del objeto role
                    return {
                        ...role.toJSON(), // Convertimos el role a JSON para manipularlo
                        totalUsers: userCount,
                        avatars: role.Users.map(user => user.avatar) // Lista de avatares
                    };
                }));

                // Obtener el total de roles (para la paginación)
                const totalRoles = await models.Role.count({
                    where: {
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    }
                });

                return {
                    roles: rolesWithUserCount, // Ahora los roles incluyen el conteo de usuarios y sus avatares
                    totalRoles
                };
            } catch (error) {
                throw new Error('Error al obtener los roles: ' + error.message);
            }
        },




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
