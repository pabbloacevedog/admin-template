// src/graphql/user/resolvers.js
import bcrypt from 'bcryptjs';
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

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await models.User.create({
                ...rest,
                email,
                password: hashedPassword,
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
            const users = await models.User.findAll();
            return users;
        },

        // Obtener un usuario por ID
        getUserById: async (_, { userId }) => {
            const user = await models.User.findByPk(userId);
            if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);

            return user;
        },
    },
};
