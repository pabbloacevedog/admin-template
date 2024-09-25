// src/resolvers/authResolver.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import models from '../../models/index.js';
import { sendEmail } from '../../utils/emailService.js';
import { JWT_EXPIRES, JWT_SECRET, CLIENT, BASE_URL } from '../../config/config.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path'; // Importa path para manejar rutas de manera segura

export const authResolver = {
    Mutation: {
        // Registrar nuevo usuario
        signup: async (_, { name, email, password }) => {
            const user = await models.User.findOne({ where: { email } });
            if (user) throwCustomError(ErrorTypes.USER_ALREADY_EXISTS);

            // Generar un token de verificación
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const defaultAvatar = `https://cdn.quasar.dev/img/avatar${Math.floor(Math.random() * 5) + 1}.jpg`;
            const newUser = await models.User.create({
                name,
                email,
                password,
                avatar: defaultAvatar,
                role_id: 1, // rol por defecto
                verification_email: verificationToken,  // Guardamos el token
                verification_email_expires: Date.now() + 3600000, // Expira en 1 hora
                verified: false, // Por defecto, el usuario no está verificado
            });

            // Enviar el correo con el token de verificación
            const verificationUrl = `${CLIENT}/#/verify_email?token=${verificationToken}`;
            const subject = getSuccessMessage('SUBJECT_VERIFY_EMAIL');
            const message = `Hi ${name}, ${getSuccessMessage('MESSAGE_VERIFY_EMAIL')} ${verificationUrl}`;

            await sendEmail({
                to: email,
                subject: subject,
                text: message,
            });

            const successMessage = getSuccessMessage('USER_CREATED_VERIFY_EMAIL');
            return { email: newUser.email, message: successMessage };
        },

        // Verificar el token de correo electrónico
        verifyEmailToken: async (_, { token }) => {
            // Buscar el usuario con el token de verificación
            console.log('Verificar el token de verificación', token);
            const user = await models.User.findOne({ where: { verification_email: token } });
            console.log('Verificar el user', user);
            if (!user) throwCustomError(ErrorTypes.INVALID_VERIFY_CODE);

            // Verificar si el token ha expirado
            if (user.verification_email_expires < Date.now()) throwCustomError(ErrorTypes.EXPIRED_VERIFY_CODE);

            // Actualizar el estado del usuario como verificado
            await user.update({
                verified: true,
                verification_email: null, // Limpiamos el código
                verification_email_expires: null,
            });

            const successMessage = getSuccessMessage('SUCCESS_VERIFY_EMAIL');
            console.log('successMessage', successMessage);
            return { email: user.email, message: successMessage };
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
            const message = getSuccessMessage('MESSAGE_VERIFY_CODE_EMAIL') + verificationCode;
            const subject = getSuccessMessage('SUBJECT_VERIFY_CODE_EMAIL');
            await sendEmail({
                to: email,
                subject: subject,
                text: message,
            });
            const successMessage = getSuccessMessage('VERIFY_CODE_SENT');
            return { message: successMessage };
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

                const successMessage = getSuccessMessage('PASSWORD_UPDATED');
                return { message: successMessage };
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
                const successMessage = getSuccessMessage('USER_DATA_UPDATE_SUCCESS');
                return { user: user.get(), message: successMessage };

            } catch (error) {
                throw new Error("Error updating user: " + error.message);
            }
        },
        async uploadAvatar(_, { userId, avatar }) {
            console.log("Uploading avatar", avatar);
            const { createReadStream, filename, mimetype } = await avatar;
            const stream = createReadStream();

            // Define la ruta donde se guardará el archivo
            const uploadDir = path.join(process.cwd(), 'public','uploads', 'users', userId, 'avatar');

            // Verifica si la carpeta existe, si no, la crea
            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir, { recursive: true }); // Crea la carpeta de manera recursiva si no existe
            }

            // Define la ruta completa del archivo
            const filePath = path.join(uploadDir, filename);
            console.log(filePath);
            console.log(uploadDir + '/' + filename);
            // Crea el stream para escribir el archivo en el sistema
            const out = createWriteStream(filePath);
            stream.pipe(out);
            const url_avatar = BASE_URL + 'uploads/users/' + userId + '/avatar/' + filename
            // Espera a que el archivo se haya guardado completamente
            await new Promise((resolve, reject) => {
                out.on('finish', resolve);
                out.on('error', reject);
            });

            // Actualiza la URL del avatar en la base de datos
            const user = await models.User.findByPk(userId);
            user.avatar = url_avatar; // Guarda la ruta del archivo en la base de datos
            await user.save();

            return { avatar: url_avatar }; // Devuelve la nueva URL del avatar
        }
    },

    Query: {
        // Login
        login: async (_, { email, password }, { res }) => {
            console.log('password', password);

            // Buscar el usuario por email
            const user = await models.User.findOne({ where: { email } });
            if (!user) throwCustomError(ErrorTypes.BAD_USER_INPUT);

            // Verificar si el correo electrónico está verificado
            if (!user.verified) throwCustomError(ErrorTypes.EMAIL_NOT_VERIFIED);

            // Verificar si la contraseña es correcta
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) throwCustomError(ErrorTypes.BAD_USER_PASSWORD);

            // Buscar el rol y las acciones asociadas
            const role = await models.Role.findByPk(user.role_id, {
                include: { model: models.Action, through: { attributes: [] } },
            });
            if (!role || !role.Actions) throwCustomError(ErrorTypes.NO_ACTIONS_FOR_ROLE);

            // Mapear las acciones
            const actions = role.Actions.map(action => action.name);

            // Crear el token JWT
            const result = {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role_id: user.role_id,
                avatar: user.avatar,
                name: user.name,
            };
            const token = jwt.sign(result, JWT_SECRET, { expiresIn: JWT_EXPIRES });

            // Si hay respuesta y cookies, establecer la cookie
            if (res && res.cookie) {
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                });
            }

            return {
                user: result,
                actions,
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
            if (!user) throwCustomError(ErrorTypes.UNAUTHENTICATED);
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
        // Verificar autenticación true o false
        isAuthBool: async (_, __, { user }) => {
            console.log('user is authenticated', user);
            var result = false;
            if (user){
                result = true;
            }

            return {
                isAuth: result,
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
