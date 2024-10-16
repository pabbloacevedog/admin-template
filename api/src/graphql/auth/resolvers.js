// src/resolvers/authResolver.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto, { verify } from 'crypto';
import models from '../../models/index.js';
import { sendEmail } from '../../utils/emailService.js';
import { JWT_EXPIRES, JWT_SECRET, CLIENT, BASE_URL } from '../../config/config.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { verifyAttempts, recordFailedAttempt, resetFailedAttempts } from '../../utils/verifyAttempts.js'
import { logActivity } from '../../utils/logActivity.js'; // Importar la función de logging
import path from 'path'; // Importa path para manejar rutas de manera segura

export const authResolver = {
    Mutation: {
        // Registrar nuevo usuario
        signup: async (_, { name, email, password }) => {
            const user = await models.User.findOne({ where: { email } });
            if (user) throwCustomError(ErrorTypes.USER_ALREADY_EXISTS);
            // Iniciar una transacción
            const transaction = await models.sequelize.transaction();
            try {
                // Generar un token de verificación
                const verificationToken = crypto.randomBytes(32).toString('hex');
                const defaultAvatar = `${BASE_URL}generic/generic_avatar.png`;
                const newUser = await models.User.create({
                    name,
                    email,
                    password,
                    avatar: defaultAvatar,
                    role_id: 2, // rol por defecto
                    state: true, // por defecto es una cuenta activa
                    verification_email: verificationToken,  // Guardamos el token
                    verification_email_expires: Date.now() + 3600000, // Expira en 1 hora
                    verified: false, // Por defecto, el usuario no está verificado
                    owner_id: '1'
                }, { transaction });

                // Enviar el correo con el token de verificación
                const verificationUrl = `${CLIENT}/#/verify_email?token=${verificationToken}`;
                const subject = getSuccessMessage('SUBJECT_VERIFY_EMAIL');
                const message = `Hi ${name}, ${getSuccessMessage('MESSAGE_VERIFY_EMAIL')} ${verificationUrl}`;

                await sendEmail({
                    to: email,
                    subject: subject,
                    text: message,
                });
                // Confirmar la transacción
                await transaction.commit();
                // Log the activity
                await logActivity(newUser.user_id, 'signup', name, null, newUser);
                const successMessage = getSuccessMessage('USER_CREATED_VERIFY_EMAIL');
                return { email: newUser.email, message: successMessage };
            } catch (error) {
                // Revertir la transacción en caso de error
                await transaction.rollback();
                throw error;
            }
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
            const transaction = await models.sequelize.transaction();
            try {
                // Actualizar el estado del usuario como verificado
                await user.update({
                    verified: true,
                    verification_email: null, // Limpiamos el código
                    verification_email_expires: null,
                }, { transaction });
                await transaction.commit();
                const successMessage = getSuccessMessage('SUCCESS_VERIFY_EMAIL');
                console.log('successMessage', successMessage);
                return { email: user.email, message: successMessage };
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        },
        // Verificar el token de correo electrónico
        verifyEmailAdmin: async (_, { userId }, { user }) => {
            // Buscar el usuario con el userId de verificación
            console.log('Verificar el userId', userId);
            const userVerify = await models.User.findOne({ where: { user_id: userId } });
            console.log('Verificar el user', user);
            if (!userVerify) throwCustomError(ErrorTypes.INVALID_VERIFY_CODE);

            const transaction = await models.sequelize.transaction();
            try {
                // Actualizar el estado del usuario como verificado
                await userVerify.update({
                    verified: true,
                    verification_email: null, // Limpiamos el código
                    verification_email_expires: null,
                }, { transaction });
                await transaction.commit();
                const successMessage = getSuccessMessage('SUCCESS_VERIFY_EMAIL');
                console.log('successMessage', successMessage);
                // Log the activity
                await logActivity(user.user_id, 'Verify Email', userVerify.name, userVerify, userVerify);
                return { email: user.email, message: successMessage };
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        },
        // Recuperar contraseña
        async forgotPassword(_, { email }) {
            // Verificar si el usuario existe
            console.log('Recuperar contraseña', email);
            const user = await models.User.findOne({ where: { email } });
            if (!user) throwCustomError(ErrorTypes.USER_NOT_FOUND);
            const transaction = await models.sequelize.transaction();
            try {
                // Generar un código de verificación aleatorio
                const verificationCode = crypto.randomBytes(3).toString('hex'); // 6 caracteres

                // Guardar el código en la base de datos (puedes agregar un campo verification_code al modelo User)
                await user.update({
                    verification_code: verificationCode,
                    verification_code_expiry: Date.now() + 3600000, // El código expira en 1 hora
                }, { transaction });

                // Enviar el correo con el código
                const message = getSuccessMessage('MESSAGE_VERIFY_CODE_EMAIL') + verificationCode;
                const subject = getSuccessMessage('SUBJECT_VERIFY_CODE_EMAIL');
                await sendEmail({
                    to: email,
                    subject: subject,
                    text: message,
                });
                await transaction.commit();
                await logActivity(user.user_id, 'Forgot Password', user.name, null, user);
                const successMessage = getSuccessMessage('VERIFY_CODE_SENT');
                return { message: successMessage };
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        },
        async verifyCode(_, { verification_code }) {
            // Buscar al usuario por el código de verificación
            console.log('verification_code', verification_code);
            const user = await models.User.findOne({ where: { verification_code } });

            if (!user) throwCustomError(ErrorTypes.INVALID_VERIFY_CODE);

            // Verificar si el código ha expirado
            if (user.verification_code_expiry < Date.now()) throwCustomError(ErrorTypes.EXPIRED_VERIFY_CODE);
            const transaction = await models.sequelize.transaction();
            try {
                // Eliminar el código de verificación y permitir que el usuario pase al siguiente paso
                await user.update({ verification_code: null, verification_code_expiry: null }, { transaction });
                await transaction.commit();
                const successMessage = getSuccessMessage('SUCCESS_VERIFY_CODE');
                return { user_id: user.user_id, message: successMessage };
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
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
            const transaction = await models.sequelize.transaction();
            try {
                // Actualizar la contraseña del usuario
                await user.update({
                    password: newPassword,
                }, { transaction });
                await transaction.commit();
                const successMessage = getSuccessMessage('PASSWORD_UPDATED');
                await logActivity(user.user_id, 'Reset Password', user.name, null, user);
                return { message: successMessage };
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        },
        async changePassword(_, args, { user }) {

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
            const transaction = await models.sequelize.transaction();
            try {
                // Actualizamos la contraseña
                await us.update({
                    password: hashedPassword
                }, { transaction });
                await transaction.commit();
                const successMessage = getSuccessMessage('PASSWORD_UPDATED');
                await logActivity(user.user_id, 'Change Password', user.name, null, user);
                return { message: successMessage };
            } catch (error) {
                await transaction.rollback();
                console.error(error);
                throw new Error("Error changing password: " + error.message);
            }
        },
        async updateAccount(_, { userId, input }, { user }) {
            // verificamos si el usuario quw esta editando es el mismo que esta logueado
            if (userId !== user.user_id) throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);
            const dataUser = await models.User.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: models.Role,
                    },
                ],
                // attributes: { exclude: ['role_id'] } // Opcional: Excluye el role_id
            });
            if (!dataUser) throwCustomError(ErrorTypes.USER_NOT_FOUND);
            const transaction = await models.sequelize.transaction();
            try {
                // Actualizamos los campos proporcionados
                const us = await models.User.findByPk(userId);
                await dataUser.update({
                    name: input.name || dataUser.name,
                    username: input.username || dataUser.username,
                    email: input.email || dataUser.email,
                    personal_phone: input.personal_phone || dataUser.personal_phone,
                    state: input.state !== undefined ? input.state : dataUser.state,
                    role_id: input.role_id !== undefined ? input.role_id : dataUser.role_id
                }, { transaction });
                await transaction.commit();
                const successMessage = getSuccessMessage('USER_DATA_UPDATE_SUCCESS');
                await logActivity(userId, 'Update Account', dataUser.name, us, dataUser);
                return { user: dataUser.get(), message: successMessage };

            } catch (error) {
                throw new Error("Error updating user: " + error.message);
            }
        },
        async uploadAvatar(_, { userId, avatar }, { user }) {
            // verificamos si el usuario quw esta editando es el mismo que esta logueado
            if (userId !== user.user_id) throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);
            const { createReadStream, filename, mimetype } = await avatar;
            const transaction = await models.sequelize.transaction();
            try {
                const stream = createReadStream();

                // Define la ruta donde se guardará el archivo
                const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'users', userId, 'avatar');

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
                await user.save({ transaction });
                await transaction.commit();
                await logActivity(userId, 'Upload Avatar', user.name, user, user);
                return { avatar: url_avatar }; // Devuelve la nueva URL del avatar
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        },

    },

    Query: {
        // Login
        // login: async (_, { email, password: userPassword }, { res }) => {
        //     // console.log('password', password);

        //     // Buscar el usuario por email y obtener el role.name
        //     const user = await models.User.findOne({
        //         where: { email },
        //         include: [
        //             {
        //                 model: models.Role,
        //             },
        //         ],
        //         // attributes: { exclude: ['role_id'] } // Opcional: Excluye el role_id si no lo necesitas
        //     });
        //     // Verificar si el correo electrónico está registrado en la base de datos
        //     if (!user) throwCustomError(ErrorTypes.BAD_USER_INPUT);

        //     // Verificar si el correo electrónico está verificado
        //     if (!user.verified) throwCustomError(ErrorTypes.EMAIL_NOT_VERIFIED);
        //     // Verificar si el estado de la cuenta
        //     if (!user.state) throwCustomError(ErrorTypes.USER_INACTIVE);
        //     // Verificar si la contraseña es correcta
        //     const passwordMatch = await bcrypt.compare(userPassword, user.password);
        //     if (!passwordMatch) throwCustomError(ErrorTypes.BAD_USER_PASSWORD);

        //     // Excluir la contraseña del objeto user antes de devolverlo
        //     const { password, ...userWithoutPassword } = user.toJSON(); // Convertir a JSON y excluir la password
        //     // console.log('userWithoutPassword', userWithoutPassword);
        //     // Generar y firmar el token JWT_SECRET unica
        //     const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        //     // Si hay respuesta y cookies, establecer la cookie
        //     if (res && res.cookie) {
        //         res.cookie('token', token, {
        //             httpOnly: true,
        //             secure: process.env.NODE_ENV === 'production',
        //             sameSite: 'Strict',
        //         });
        //     }

        //     return {
        //         user: userWithoutPassword,
        //         // actions,
        //         // routes
        //     };
        // },
        login: async (_, { email, password: userPassword }, { res, req }) => {
            const ipAddr = req.ip;

            await verifyAttempts(email, ipAddr, res);

            const user = await models.User.findOne({
                where: { email },
                include: [{ model: models.Role }],
            });

            if (!user || !user.verified || !user.state || !(await bcrypt.compare(userPassword, user.password))) {
                await recordFailedAttempt(user ? email : null, ipAddr);
                throwCustomError(user ? ErrorTypes.BAD_USER_PASSWORD : ErrorTypes.BAD_USER_INPUT);
            }

            const { password, ...userWithoutPassword } = user.toJSON();
            const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: JWT_EXPIRES });

            if (res && res.cookie) {
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                });
            }

            await resetFailedAttempts(email, ipAddr);

            return {
                user: userWithoutPassword,
            };
        },
        // Obtener configuración de usuario
        userSettings: async (_, { userId }, { user, res }) => {
            if (!user || user.user_id !== userId) throwCustomError(ErrorTypes.UNAUTHORIZED);

            // Buscar el usuario por email y obtener el role.name
            const userSettings = await models.User.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: models.Role,
                    },
                ],
                // attributes: { exclude: ['role_id'] } // Opcional: Excluye el role_id
            });
            // Si no se encuentra el usuario, llamar a logout
            if (!userSettings) {
                // console.log('No se encuentra el usuario', res)
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                });
                throwCustomError(ErrorTypes.USER_NOT_FOUND); // Lanza el error después de cerrar sesión
            }
            const { password, ...userWithoutPassword } = userSettings.toJSON(); // Convertir a JSON y excluir la password

            return {
                user: userWithoutPassword,
            };
        },
        // Obtener Routes, acciones, condiciones y ResourceAccess asociados al rol del usuario en la tabla de permisos
        userRoutes: async (_, __, { user }) => {
            if (!user) throwCustomError(ErrorTypes.UNAUTHORIZED);

            // Buscar las rutas, acciones, condiciones y ResourceAccess asociados al rol del usuario en la tabla de permisos
            const permissions = await models.Permission.findAll({
                where: { role_id: user.role_id },
                include: [
                    {
                        model: models.Route,
                    },
                    {
                        model: models.Action,
                    },
                    {
                        model: models.Condition,
                        // include: [
                        //     {
                        //         model: models.ResourceAccess, // Incluir ResourceAccess si la condición está presente
                        //         required: false, // Para incluir permisos sin ResourceAccess
                        //     }
                        // ]
                    },
                    { // Incluir ResourceAccess solo si la condición es 'others' o 'resource'
                        model: models.ResourceAccess,
                        required: false // Para evitar filtrar los permisos sin ResourceAccess
                    }
                ],
            });

            if (!permissions || permissions.length === 0) {
                throwCustomError(ErrorTypes.NO_ACTIONS_FOR_ROLE);
            }

            // Agrupar rutas y sus acciones, incluyendo las condiciones y ResourceAccess
            const routesWithActions = permissions.reduce((result, permission) => {
                const { Route, Action, Condition, ResourceAccesses } = permission;

                // Si la ruta ya está en el resultado, añadimos la acción y condición
                const existingRoute = result.find(route => route.route_id === Route.route_id);
                const conditionData = Condition ? {
                    condition_id: Condition.condition_id,
                    name: Condition.name,
                    title: Condition.title,
                    description: Condition.description,
                    // Incluir ResourceAccess si está presente en la condición
                    resourceAccess: ResourceAccesses && ResourceAccesses.length > 0
                        ? ResourceAccesses.map(resourceAccess => ({
                            resource_id: resourceAccess.resource_id,
                            resource_type: resourceAccess.resource_type,
                            user_id: resourceAccess.user_id,
                            role_id: resourceAccess.role_id,
                            action_id: resourceAccess.action_id,
                            condition_id: resourceAccess.condition_id
                        }))
                        : []
                } : null;
                // console.log('conditionData', conditionData)
                if (existingRoute) {
                    existingRoute.action.push({
                        action_id: Action.action_id,
                        name: Action.name,
                        title: Action.title,
                        description: Action.description,
                        condition: conditionData,
                    });
                } else {
                    // Si no existe, creamos una nueva entrada para la ruta con sus acciones y condiciones
                    result.push({
                        route_id: Route.route_id,
                        name: Route.name,
                        title: Route.title,
                        description: Route.description,
                        path: Route.path,
                        icon: Route.icon,
                        module_id: Route.module_id,
                        resource: Route.resource,
                        action: [
                            {
                                action_id: Action.action_id,
                                name: Action.name,
                                title: Action.title,
                                description: Action.description,
                                condition: conditionData,
                            }
                        ]
                    });
                }

                return result;
            }, []);

            return routesWithActions;
        },

        // Verificar autenticación
        isAuth: async (_, __, { user }) => {
            // console.log('user is authenticated', user);
            if (!user) throwCustomError(ErrorTypes.UNAUTHENTICATED);
            return {
                user: user,
            };
        },
        // Verificar autenticación true o false
        isAuthBool: async (_, __, { user }) => {
            var result = false;
            if (user) {
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
