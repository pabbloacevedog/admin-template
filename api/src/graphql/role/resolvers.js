import models from '../../models/index.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';
import validatePermission from '../../utils/permissionValidator.js';
import { Op } from 'sequelize';

export const roleResolver = {
    Mutation: {
        // Crear un nuevo rol
        createRole: async (_, args, { user }) => {
            const { name, ...rest } = args;
            const existingRole = await models.Role.findOne({ where: { name } });
            if (existingRole) throwCustomError(ErrorTypes.ROLE_ALREADY_EXISTS);

            const newRole = await models.Role.create({
                name,
                ...rest,
                owner_id: user.user_id
            });

            const successMessage = getSuccessMessage('ROLE_CREATED');
            return { role_id: newRole.role_id, message: successMessage };
        },

        // Actualizar un rol existente
        async updateRole(_, { roleId, input }, { user }) {
            try {
                // Verificar que el usuario tenga la acción de editar roles
                const userIdEditor = user.user_id;
                await validatePermission(userIdEditor, 'update', 'roles', roleId);

                const roleToEdit = await models.Role.findByPk(roleId);
                if (!roleToEdit) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

                // Verificar si el nuevo nombre ya pertenece a otro rol
                if (input.name) {
                    const existingRole = await models.Role.findOne({
                        where: { name: input.name, role_id: { [Op.ne]: roleId } }
                    });
                    if (existingRole) {
                        throwCustomError(ErrorTypes.ROLE_NAME_ALREADY_IN_USE);
                    }
                }

                // Actualizar los campos proporcionados
                await roleToEdit.update({
                    name: input.name || roleToEdit.name,
                    title: input.title || roleToEdit.title,
                    description: input.description || roleToEdit.description,
                    color: input.color || roleToEdit.color,
                });

                const successMessage = getSuccessMessage('ROLE_UPDATED');
                return { role: roleToEdit.get(), message: successMessage };
            } catch (error) {
                throw new Error("Error updating role: " + error.message);
            }
        },

        // Eliminar un rol
        deleteRole: async (_, { roleId }) => {
            const role = await models.Role.findByPk(roleId);
            if (!role) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

            await role.destroy();
            const successMessage = getSuccessMessage('ROLE_DELETED');
            return { message: successMessage };
        },
    },

    Query: {
        // Obtener todos los roles
        getRoles: async () => {
            const roles = await models.Role.findAll();
            return roles;
        },

        // Obtener un rol por ID
        // getRoleById: async (_, { roleId }) => {
        //     const role = await models.Role.findOne({
        //         where: { role_id: roleId },
        //         include: [{
        //             model: models.Permission, // Incluye la relación con permisos
        //             include: [
        //                 { model: models.Route },    // Incluir rutas asociadas
        //                 { model: models.Action },   // Incluir acciones asociadas
        //                 { model: models.Condition } // Incluir condiciones asociadas
        //             ]
        //         }]
        //     });
        //     console.log('role: ', role.get())
        //     if (!role) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

        //     return role;
        // },
        getRoleById: async (_, { roleId }) => {
            // Buscar el rol por ID con permisos, rutas, acciones y condiciones
            const role = await models.Role.findOne({
                where: { role_id: roleId },
                include: [{
                    model: models.Permission, // Incluye la relación con permisos
                    include: [
                        { model: models.Route },    // Incluir rutas asociadas
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
                        console.log('Condition: ', Condition);
                        existingAction.condition = {
                            condition_id: Condition.condition_id,
                            name: Condition.name,
                            title: Condition.title,
                            description: Condition.description
                        };
                    }
                } else {
                    console.log('Condition: ', Condition);
                    // Si la acción no existe, crear una nueva entrada para la acción
                    const newAction = {
                        action_id: Action.action_id,
                        name: Action.name,
                        title: Action.title,
                        description: Action.description,
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

            console.log('permissionsArray: ', permissionsArray);

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




        // Obtener roles con paginación y filtro
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
                });

                const totalRoles = await models.Role.count({
                    where: {
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    }
                });

                return {
                    roles,
                    totalRoles
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
