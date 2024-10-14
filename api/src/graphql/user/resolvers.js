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
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path'; // Importa path para manejar rutas de manera segura
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
            await validatePermission(user.user_id, 'update', 'users', userId);
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
        async updateAvatar(_, { userId, avatar }, { user }) {
            // Verificar que el usuario tenga la acción de editar usuarios
            await validatePermission(user.user_id, 'update', 'users', userId);
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
                return { avatar: url_avatar }; // Devuelve la nueva URL del avatar
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
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
        getAllUsers: async (_, { filter, pagination }, { user }) => {
            try {
                console.log('user logueado', user);
                const loggedInUserId = user.user_id; // ID del usuario logueado
                const loggedInUserRole = user.role_id; // Rol del usuario logueado

                // Obtener el rol del usuario para verificar permisos
                // Obtener el rol del usuario para verificar permisos
                const userRole = await models.Role.findOne({
                    where: { role_id: loggedInUserRole },
                    include: [{
                        model: models.Permission,
                        required: true, // Esto hace un INNER JOIN
                        include: [
                            {
                                model: models.Action,
                                required: true // Esto también es un INNER JOIN
                            },
                            {
                                model: models.Condition,
                                required: true // INNER JOIN aquí también
                            },
                            {
                                model: models.Route,
                                where: { resource: 'user' }, // Filtro para la ruta específica
                                required: true // INNER JOIN
                            }
                        ]
                    }]
                });



                if (!userRole) {
                    throw new Error('No se encontró el rol del usuario logueado.');
                }
                console.log('userRole', userRole.Permissions)
                // Filtrar los permisos para la acción "view"
                const viewPermission = userRole.Permissions.find(permission => permission.Action.name === 'view');
                if (!viewPermission) throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);

                // Obtener los permisos de acceso
                const resourceAccessPermission = await models.ResourceAccess.findAll({
                    where: { permission_id: viewPermission.permission_id },
                });
                console.log('viewPermission.Condition', viewPermission)
                // Construir el whereClause según las condiciones del permiso
                let whereClause = {};
                if (viewPermission.Condition.name === 'all') {
                    // El usuario puede ver todos los usuarios
                    whereClause = {
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    };
                } else if (viewPermission.Condition.name === 'owner_only') {
                    // Solo puede ver usuarios creados por él mismo
                    whereClause = {
                        owner_id: loggedInUserId, // Solo usuarios creados por el usuario logueado
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    };
                } else if (viewPermission.Condition.name === 'others') {
                    // Ver usuarios de otros roles o usuarios según los permisos de acceso
                    const roleIds = resourceAccessPermission.map(access => access.role_id);
                    console.log('roleIds', roleIds);
                    const userIds = resourceAccessPermission.map(access => access.user_id);
                    console.log('userIds', userIds);
                    // whereClause = {
                    //     [Op.or]: [
                    //         { role_id: { [Op.in]: roleIds } }, // Coincidencia con roles
                    //         { user_id: { [Op.in]: userIds } }  // Coincidencia con usuarios
                    //     ],
                    //     user_id: { [Op.ne]: loggedInUserId }, // Excluir el propio usuario
                    //     name: {
                    //         [Op.like]: `%${filter.search}%`
                    //     }
                    // };
                    whereClause = {
                        [Op.or]: [
                            { owner_id: { [Op.in]: ownerIds } }, // Condición para owner_id
                            { '$owner.role.role_id$': { [Op.in]: roleIds } } // Condición para role_id del owner (usando alias)
                        ],
                        // user_id: { [Op.ne]: loggedInUserId }, // Excluir el propio usuario
                        name: {
                            [Op.like]: `%${filter.search}%` // Filtro de búsqueda en nombre
                        }
                    };

                } else if (viewPermission.Condition.name === 'resource') {
                    // Acceso basado en recursos específicos
                    const resourceIds = resourceAccessPermission.map(access => access.resource_id);

                    whereClause = {
                        user_id: { [Op.in]: resourceIds }, // Filtrar por resource_id
                        name: {
                            [Op.like]: `%${filter.search}%`
                        }
                    };
                }

                // Obtener los usuarios según el whereClause con paginación
                const users = await models.User.findAll({
                    where: whereClause,
                    limit: pagination.rowsPerPage,
                    offset: (pagination.page - 1) * pagination.rowsPerPage,
                    include: [models.Role] // Incluye el rol si es necesario
                });

                // Contar el total de usuarios (para paginación)
                const totalUsers = await models.User.count({
                    where: whereClause
                });

                return {
                    users,
                    totalUsers
                };
            } catch (error) {
                console.error('Error al obtener los roles:', error.stack); // Imprime el stack trace completo
                throw new Error('Error al obtener los roles: ' + error.message);
            }
        },

        // getAllUsers: async (_, { filter, pagination }) => {
        //     try {
        //         // Lógica para obtener usuarios de la base de datos, por ejemplo con Sequelize
        //         const users = await models.User.findAll({
        //             // Aplica la paginación y filtros aquí
        //             where: {
        //                 name: {
        //                     [Op.like]: `%${filter.search}%`
        //                 }
        //             },
        //             limit: pagination.rowsPerPage,
        //             offset: (pagination.page - 1) * pagination.rowsPerPage,
        //             include: [models.Role] // Si también necesitas incluir el rol
        //         });

        //         const totalUsers = await models.User.count({
        //             where: {
        //                 name: {
        //                     [Op.like]: `%${filter.search}%`
        //                 }
        //             }
        //         });

        //         return {
        //             users,
        //             totalUsers
        //         };
        //     } catch (error) {
        //         throw new Error('Error al obtener los usuarios' + error);
        //     }
        // },
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
