// src/graphql/role/resolvers.js
import models from '../../models/index.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';

export const roleResolver = {
    Mutation: {
        // Crear un nuevo rol
        createRole: async (_, { input }) => {
            const newRole = await models.Role.create(input);
            return newRole;
        },

        // Actualizar un rol existente
        updateRole: async (_, { roleId, input }) => {
            const role = await models.Role.findByPk(roleId);
            if (!role) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

            await role.update(input);
            return role;
        },

        // Eliminar un rol
        deleteRole: async (_, { roleId }) => {
            const role = await models.Role.findByPk(roleId);
            if (!role) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

            await role.destroy();
            return getSuccessMessage('ROLE_DELETED');
        },
    },

    Query: {
        // Obtener todos los roles
        getRoles: async () => {
            const roles = await models.Role.findAll();
            return roles;
        },

        // Obtener un rol por ID
        getRoleById: async (_, { roleId }) => {
            const role = await models.Role.findByPk(roleId);
            if (!role) throwCustomError(ErrorTypes.ROLE_NOT_FOUND);

            return role;
        },
    },
};
