// src/resolvers/authResolver.js

import { login, signup, getUserById, updateUser  } from '../../services/authService.js';

export const authResolver = {
    Mutation: {
        signup: async (_, { email, password }) => {
            return await signup(email, password);
        },
        forgotPassword: async (_, { email }) => {
            return await forgotPassword(email);
        },
        resetPassword: async (_, { verification_code, newPassword }) => {
            return await resetPassword(verification_code, newPassword);
        },
        updateUser: async (_, { user_id, name, email, password, personal_phone, avatar, state }, { user }) => {
            // Validación de autorización
            if (!user || user.user_id !== user_id) {
                throw new Error('Unauthorized');
            }

            const updateData = {
                name,
                email,
                password,
                personal_phone,
                avatar,
                state
            };

            // Actualizar el usuario utilizando el servicio
            return await updateUser(user_id, updateData);
        },
    },
    Query: {
        login: async (_, { email, password }, { res }) => {
            // console.log('res-login-resolver: ', res)
            return await login(email, password, res);
        },
        userSettings: async (_, { userId }, { user }) => {
            // Validación de autorización
            console.log('user.user_id', user);
            console.log('userId', userId);
            if (!user || user.user_id !== userId) {
                throw new Error('Unauthorized');
            }

            // Obtener los datos del usuario desde el servicio
            return await getUserById(userId);
        },
    },
};
