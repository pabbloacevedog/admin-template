// src/resolvers/authResolver.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import models from '../../models/index.js';
import { sendEmail } from '../../utils/emailService.js';
import { JWT_EXPIRES, JWT_SECRET, RESET_PASSWORD_URL } from '../../config/config.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { Op } from 'sequelize';

export const authResolver = {
    Mutation: {
        // Registrar nuevo usuario
        signup: async (_, { email, password }) => {
            const user = await models.User.findOne({ where: { email } });
            if (user) throwCustomError(ErrorTypes.ALREADY_EXISTS);

            const newUser = await models.User.create({
                email,
                password,
                role_id: 1, // rol por defecto
            });

            return { email: newUser.email, message: 'Usuario creado con éxito.' };
        },

        // Recuperar contraseña
        forgotPassword: async (_, { email }) => {
            const user = await models.User.findOne({ where: { email } });
            if (!user) throwCustomError(ErrorTypes.BAD_USER_INPUT);

            const verification_code = crypto.randomBytes(32).toString('hex');
            const verification_expires = new Date(Date.now() + 3600000); // 1 hora

            user.verification_code = verification_code;
            user.verification_expires = verification_expires;
            await user.save();

            const resetLink = `${RESET_PASSWORD_URL}${verification_code}`;
            await sendEmail(email, 'Restablecimiento de Contraseña', `Usa este enlace para restablecer tu contraseña: ${resetLink}`);

            return { message: 'Enlace de restablecimiento de contraseña enviado a tu email.' };
        },

        // Restablecer contraseña
        resetPassword: async (_, { verification_code, newPassword }) => {
            const user = await models.User.findOne({
                where: {
                verification_code,
                verification_expires: { [Op.gt]: new Date() },
                },
            });
            if (!user) throwCustomError(ErrorTypes.INVALID_RESET_TOKEN);

            user.password = newPassword;
            user.verification_code = null;
            user.verification_expires = null;
            await user.save();

            return { message: 'Contraseña restablecida con éxito' };
        },

        // Actualizar usuario
        // updateUser: async (_, { user_id, name, email, password, personal_phone, avatar, state }, { user }) => {
        //     if (!user || user.user_id !== user_id) throw new Error('Unauthorized');

        //     const updateData = { name, email, personal_phone, avatar, state };
        //     if (password) updateData.password = await bcrypt.hash(password, 10);

        //     const existingUser = await models.User.findByPk(user_id);
        //     if (!existingUser) throw new Error('User not found');
        //     await existingUser.update(updateData);

        //     return existingUser;
        // },
    },

    Query: {
        // Login
        login: async (_, { email, password }, { res }) => {
            const user = await models.User.findOne({ where: { email } });
            if (!user) throwCustomError(ErrorTypes.BAD_USER_INPUT);

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) throwCustomError(ErrorTypes.BAD_USER_PASSWORD);

            const role = await models.Role.findByPk(user.role_id, {
                include: { model: models.Action, through: { attributes: [] } },
            });
            if (!role || !role.Actions) throwCustomError(ErrorTypes.NO_ACTIONS_FOR_ROLE);

            const actions = role.Actions.map(action => action.name);
            const result = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role_id: user.role_id,
                avatar: user.avatar
            };
            const token = jwt.sign(result, JWT_SECRET, { expiresIn: JWT_EXPIRES });

            if (res && res.cookie) {
                res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                });
            }
            return {
                user : result,
                actions
            };
        },

        // Obtener configuración de usuario
        userSettings: async (_, { userId }, { user }) => {
            if (!user || user.user_id !== userId) throwCustomError(ErrorTypes.UNAUTHORIZED);
            const userSettings = await models.User.findByPk(userId);
            if (!userSettings) throw new Error('User not found');
            const result = {
                user_id: userSettings.user_id,
                rut_user: userSettings.rut_user,
                name: userSettings.name,
                username: userSettings.username,
                email: userSettings.email,
                personal_phone: userSettings.personal_phone,
                verification_code: userSettings.verification_code,
                verified: userSettings.verified,
                state: userSettings.state,
                avatar: userSettings.avatar,
                role_id: userSettings.role_id
            };
            return {
                user : result,
            };
        },

            // Verificar autenticación
        isAuth: async (_, __, { user }) => {
            console.log('user is authenticated', user);
            if (!user) if (!user) throwCustomError(ErrorTypes.UNAUTHENTICATED);
            const result = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role_id: user.role_id,
                avatar: user.avatar
            };
            return {
                user : result,
            };
        },

        // Cerrar sesión
        logout: async (_, __, { res }) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
            return { message: 'Logged out successfully' };
        },
    },
};
