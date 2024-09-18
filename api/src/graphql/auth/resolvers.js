// src/resolvers/authResolver.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import models from '../../models/index.js';
import { sendEmail } from '../../utils/emailService.js';
import { JWT_EXPIRES, JWT_SECRET } from '../../config/config.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';

export const authResolver = {
    Mutation: {
        // Registrar nuevo usuario
        signup: async (_, { email, password }) => {
            const user = await models.User.findOne({ where: { email } });
            if (user) throwCustomError(ErrorTypes.USER_ALREADY_EXISTS);

            const newUser = await models.User.create({
                email,
                password,
                role_id: 1, // rol por defecto
            });
            const successMessage = getSuccessMessage('USER_CREATED');
            return { email: newUser.email, message: successMessage };
        },

        // Recuperar contraseña
        async forgotPassword(_, { email }) {
            // Verificar si el usuario existe
            console.log('Recuperar contraseña', email);
            const user = await models.User.findOne({ where: { email } });
            if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);

            // Generar un código de verificación aleatorio
            const verificationCode = crypto.randomBytes(3).toString('hex'); // 6 caracteres

            // Guardar el código en la base de datos (puedes agregar un campo verification_code al modelo User)
            await user.update({
                verification_code: verificationCode,
                verification_code_expiry: Date.now() + 3600000, // El código expira en 1 hora
            });

            // Enviar el correo con el código
            const message = getSuccessMessage('MESSAGE_VERIFY_CODE_EMAIL') + verificationCode ;
            const subject = getSuccessMessage('SUBJECT_VERIFY_CODE_EMAIL');
            await sendEmail({
                to: email,
                subject: subject,
                text: message,
            });
            const successMessage = getSuccessMessage('VERIFY_CODE_SENT');
            return { message: successMessage} ;
        },
        async verifyCode(_, { verification_code }) {
            // Buscar al usuario por el código de verificación
            console.log('verification_code', verification_code);
            const user = await models.User.findOne({ where: { verification_code } });

            if (!user) throwCustomError(ErrorTypes.INVALID_VERIFY_CODE);

            // Verificar si el código ha expirado
            if (user.verification_code_expiry < Date.now()) throwCustomError(ErrorTypes.EXPIRED_VERIFY_CODE);

            // Eliminar el código de verificación y permitir que el usuario pase al siguiente paso
            await user.update({ verification_code: null, verification_code_expiry: null });
            const successMessage = getSuccessMessage('SUCCESS_VERIFY_CODE');
            return { user_id: user.user_id, message: successMessage };
        },
        // Restablecer contraseña
        async resetPassword(_, { userId, newPassword }) {
            // Buscar al usuario por su ID
            console.log("new password", newPassword);
            const user = await models.User.findByPk(userId);

            if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);

            // Verificar si la nueva contraseña es la misma que la actual
            const isSamePassword = await bcrypt.compare(newPassword, user.password); // user.password está cifrada

            if (isSamePassword) throwCustomError(ErrorTypes.PASSWORD_SAME_AS_OLD);

            // Actualizar la contraseña del usuario
            await user.update({
                password: newPassword,
            });
            const successMessage = getSuccessMessage('PASSWORD_UPDATED');
            return { message: successMessage };
        },
        async changePassword(_, args, { user }) {
            try {
                const userId = user.user_id;
                console.log('Change Password', user)
                console.log('Change Password args', args)
                const us = await models.User.findByPk(userId);
                if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);

                // Verificamos si la contraseña actual es correcta
                const validPassword = await bcrypt.compare(args.currentPassword, us.password);
                if (!validPassword) throwCustomError(ErrorTypes.WRONG_CURRENT_PASSWORD);

                // Encriptamos la nueva contraseña
                const hashedPassword = args.newPassword

                // Actualizamos la contraseña
                await us.update({
                    password: hashedPassword
                });

                return true;  // Indicar que la contraseña se actualizó con éxito
            } catch (error) {
                console.error(error);
                throw new Error("Error changing password: " + error.message);
            }
        },
        async updateUser(_, { userId, input }) {
            try {
                const user = await models.User.findByPk(userId);
                if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);

                // Actualizamos los campos proporcionados
                await user.update({
                    rut_user: input.rut_user || user.rut_user,
                    name: input.name || user.name,
                    username: input.username || user.username,
                    email: input.email || user.email,
                    personal_phone: input.personal_phone || user.personal_phone,
                    verification_code: input.verification_code || user.verification_code,
                    verified: input.verified !== undefined ? input.verified : user.verified,
                    state: input.state || user.state,
                    avatar: input.avatar || user.avatar,
                    role_id: input.role_id !== undefined ? input.role_id : user.role_id
                });

                return user;
            } catch (error) {
                throw new Error("Error updating user: " + error.message);
            }
        },

    },

    Query: {
        // Login
        login: async (_, { email, password }, { res }) => {
            console.log('password', password)
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
                user: result,
                actions
            };
        },

        // Obtener configuración de usuario
        userSettings: async (_, { userId }, { user }) => {
            if (!user || user.user_id !== userId) throwCustomError(ErrorTypes.UNAUTHORIZED);
            const userSettings = await models.User.findByPk(userId);
            if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);
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
                user: result,
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
                user: result,
            };
        },

        // Cerrar sesión
        logout: async (_, __, { res }) => {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
            const successMessage = getSuccessMessage('SUCCESS_LOGOUT');
            return { message: successMessage };
        },
    },
};
