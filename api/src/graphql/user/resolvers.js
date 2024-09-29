// src/graphql/user/resolvers.js
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import models from '../../models/index.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';

export const userResolver = {
    Mutation: {
        // Crear un nuevo usuario
        createUser: async (_, { input }) => {
            const { email, password, ...rest } = input;
            const existingUser = await models.User.findOne({ where: { email } });

            if (existingUser) throwCustomError(ErrorTypes.USER_ALREADY_EXISTS);

            const newUser = await models.User.create({
                ...rest,
                email,
                password: password,
            });

            return newUser;
        },

        // Actualizar un usuario existente
        updateUser: async (_, { userId, input }) => {
            const user = await models.User.findByPk(userId);
            if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);

            const updatedFields = {
                ...input,
            };

            if (input.password) {
                updatedFields.password = await bcrypt.hash(input.password, 10);
            }

            await user.update(updatedFields);
            return user;
        },

        // Eliminar un usuario
        deleteUser: async (_, { userId }) => {
            const user = await models.User.findByPk(userId);
            if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);

            await user.destroy();
            return getSuccessMessage('USER_DELETED');
        },
    },

    Query: {
        // Obtener todos los usuarios
        getUsers: async () => {
            const users = await models.User.findAll({
                include: [models.Role],
            });
            console.log(users[0], 'users');
            return users;
        },
        // Obtener todos los usuarios
        getAllUsers: async (_, { filter, pagination }) => {
            try {
                // Lógica para obtener usuarios de la base de datos, por ejemplo con Sequelize
                const users = await models.User.findAll({
                    // Aplica la paginación y filtros aquí
                    where: {
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    },
                    limit: pagination.rowsPerPage,
                    offset: (pagination.page - 1) * pagination.rowsPerPage,
                    include: [models.Role] // Si también necesitas incluir el rol
                });

                const totalUsers = await models.User.count({
                    where: {
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    }
                });

                return {
                    users,
                    totalUsers
                };
            } catch (error) {
                throw new Error('Error al obtener los usuarios' + error);
            }
        },
        // Obtener un usuario por ID
        getUserById: async (_, { userId }) => {
            const user = await models.User.findByPk(userId, {
                include: [
                    {
                        model: models.Role,
                        attributes: ['name'], // Solo trae el 'name' del Role
                    },
                ],
            });

            if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);

            return user;
        },
    },
};
