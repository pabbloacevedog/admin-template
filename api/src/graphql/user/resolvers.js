// src/graphql/user/resolvers.js
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Op } from 'sequelize';
import models from '../../models/index.js';
import { sendEmail } from '../../utils/emailService.js';
import validatePermission from '../../utils/permissionValidator.js';
import throwCustomError, { ErrorTypes } from '../../helpers/error-handler.helper.js';
import { getSuccessMessage } from '../../helpers/success-handler.helper.js';
import { CLIENT, BASE_URL } from '../../config/config.js';
export const userResolver = {
    Mutation: {
        // Crear un nuevo usuario
        createUser: async (_, args, { user }) => {
            //validamos permisos antes de ejecutar la accion
            await validatePermission(user.user_id, 'create', 'users', null);
            const { email, ...rest } = args;
            const existingUser = await models.User.findOne({ where: { email } });
            console.log('rest', rest);
            if (existingUser) throwCustomError(ErrorTypes.USER_CREATE_ALREADY_EXISTS);
            const defaultAvatar = `${BASE_URL}generic/generic_avatar.png`;
            // Iniciar una transacción
            const transaction = await models.sequelize.transaction();
            try {
                // Generar un token de verificación
                const verificationToken = crypto.randomBytes(32).toString('hex');
                const newUser = await models.User.create({
                    email,
                    ...rest,
                    verification_email: verificationToken,  // Guardamos el token
                    verification_email_expires: Date.now() + 3600000, // Expira en 1 hora
                    verified: false, // Por defecto, el usuario no está verificado
                    state: true,
                    avatar: defaultAvatar,
                    owner_id: user.user_id
                }, { transaction });

                // Enviar el correo con el token de verificación
                const verificationUrl = `${CLIENT}/#/verify_email?token=${verificationToken}`;
                const subject = getSuccessMessage('SUBJECT_VERIFY_EMAIL');
                const message = `Hi ${rest.name}, ${getSuccessMessage('MESSAGE_VERIFY_EMAIL')} ${verificationUrl}`;

                await sendEmail({
                    to: email,
                    subject: subject,
                    text: message,
                });
                // Confirmar la transacción
                await transaction.commit();
                const successMessage = getSuccessMessage('USER_CREATED_VERIFY_EMAIL');
                return { user_id: newUser.user_id, message: successMessage };
            } catch (error) {
                // Revertir la transacción en caso de error
                await transaction.rollback();
                throw error;
            }

        },

        // Actualizar un usuario existente
        async updateUser(_, { userId, input }, { user }) {

            // Verificar que el usuario tenga la acción de editar usuarios
            await validatePermission(user.user_id, 'update', 'users', userId); // Agrega la ruta correspondiente
            console.log('input', input);
            const usertoedit = await models.User.findByPk(userId);
            if (!usertoedit) throwCustomError(ErrorTypes.USER_NOT_FOUND);
            const transaction = await models.sequelize.transaction();
            try {
                // Verificar si el nuevo correo ya pertenece a otro usuario
                if (input.email) {
                    const existingUser = await models.User.findOne({
                        where: { email: input.email, user_id: { [Op.ne]: userId } } // Excluir el usuario actual
                    });
                    if (existingUser) {
                        throwCustomError(ErrorTypes.EMAIL_ALREADY_IN_USE);
                    }
                }
                // Si el input.password está presente, usa set() para que se active el middleware
                if (input.password) {
                    await usertoedit.update({ password: input.password });
                    console.log('password updated', input.password);
                }
                // Actualizamos los campos proporcionados
                await usertoedit.update({
                    name: input.name || usertoedit.name,
                    username: input.username || usertoedit.username,
                    email: input.email || usertoedit.email,
                    personal_phone: input.personal_phone || usertoedit.personal_phone,
                    state: input.state !== undefined ? input.state : usertoedit.state,
                    // avatar: input.avatar || user.avatar,
                    role_id: input.role_id !== undefined ? input.role_id : usertoedit.role_id
                }, { transaction });
                await transaction.commit();
                const successMessage = getSuccessMessage('USER_DATA_UPDATE_SUCCESS');
                return { user: usertoedit.get(), message: successMessage };

            } catch (error) {
                await transaction.rollback();
                throw new Error("Error updating user: " + error.message);
            }
        },


        // Eliminar un usuario
        deleteUser: async (_, { userId }, { user }) => {
            //validamos permisos antes de ejecutar la accion
            await validatePermission(user.user_id, 'delete', 'users', userId);
            const dataUser = await models.User.findByPk(userId);
            if (!dataUser) throwCustomError(ErrorTypes.USER_NOT_FOUND);
            // Iniciar transacción
            const transaction = await models.sequelize.transaction();
            try {
                await dataUser.destroy({ transaction });
                // Confirmar la transacción
                await transaction.commit();

                // Retornar mensaje de éxito
                const successMessage = getSuccessMessage('USER_DELETED');
                return { message: successMessage };
            } catch (error) {
                // Si ocurre un error, hacer rollback de la transacción
                await transaction.rollback();
                throw error;
            }
        },
    },

    Query: {
        // Obtener todos los usuarios
        getUsers: async () => {
            const users = await models.User.findAll({
                include: [models.Role],
            });
            // console.log(users[0], 'users');
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
        getUsersByOwner: async (_, { filter, pagination }, { user }) => {
            try {
                // Definir condiciones de búsqueda
                const conditions = {
                    [Op.or]: [
                        { owner_id: user.user_id }, // Traer usuarios cuyo owner_id sea igual al user_id autenticado
                        { user_id: user.user_id }  // Traer el usuario autenticado
                    ],
                    name: {
                        [Op.like]: `%${filter.search || ''}%` // Asegura que el filtro de búsqueda sea seguro
                    }
                };

                // Obtener usuarios de la base de datos con Sequelize
                const users = await models.User.findAll({
                    where: conditions,
                    limit: pagination.rowsPerPage,
                    offset: (pagination.page - 1) * pagination.rowsPerPage,
                    include: [models.Role] // Incluir el rol si es necesario
                });

                // Contar total de usuarios que cumplen las condiciones
                const totalUsers = await models.User.count({
                    where: conditions
                });

                return {
                    users,
                    totalUsers
                };
            } catch (error) {
                console.error('Error al obtener los usuarios:', error); // Log para diagnóstico
                throw new Error('Error al obtener los usuarios: ' + error.message);
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
