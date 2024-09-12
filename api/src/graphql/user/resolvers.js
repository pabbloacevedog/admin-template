import models from '../../models/index.js';
import { hashPassword } from '../../utils/index.js'; // Asegúrate de que la función hashPassword esté disponible
import bcrypt from 'bcryptjs';
export const userResolver = {
    Query: {
        users: async () => {
            try {
                return await models.User.findAll();
            } catch (error) {
                console.error('Error fetching users:', error);
                throw new Error('Error fetching users');
            }
        },
        user: async (parent, { user_id }) => {
            try {
                const user = await models.User.findByPk(user_id);
                if (!user) {
                    throw new Error('Usuario no encontrado');
                }
                return user;
            } catch (error) {
                console.error('Error fetching user by ID:', error);
                throw new Error('Error fetching user');
            }
        },
    },
    Mutation: {
        async addUser(_, args) {
            try {
                const newUser = await models.User.create({
                    rut_user: args.rut_user,
                    name: args.name,
                    username: args.username,
                    email: args.email,
                    personal_phone: args.personal_phone,
                    verification_code: args.verification_code,
                    verified: args.verified || false,
                    state: args.state,
                    avatar: args.avatar,
                    role_id: args.role_id
                });
                return newUser;
            } catch (error) {
                throw new Error("Error adding new user: " + error.message);
            }
        },
        async editUser(_, args) {
            try {
                const user = await models.User.findByPk(args.user_id);
                if (!user) {
                    throw new Error("User not found");
                }

                // Actualizamos los campos proporcionados
                await user.update({
                    rut_user: args.rut_user || user.rut_user,
                    name: args.name || user.name,
                    username: args.username || user.username,
                    email: args.email || user.email,
                    personal_phone: args.personal_phone || user.personal_phone,
                    verification_code: args.verification_code || user.verification_code,
                    verified: args.verified !== undefined ? args.verified : user.verified,
                    state: args.state || user.state,
                    avatar: args.avatar || user.avatar,
                    role_id: args.role_id || user.role_id
                });

                return user;
            } catch (error) {
                throw new Error("Error editing user: " + error.message);
            }
        },
        async removeUser(_, args) {
            try {
                const user = await models.User.findByPk(args.user_id);
                if (!user) {
                    throw new Error("User not found");
                }

                await user.destroy();
                return `User with ID ${args.user_id} removed successfully`;
            } catch (error) {
                throw new Error("Error removing user: " + error.message);
            }
        },
        async updateUser(_, { userId, input }) {
            try {
                const user = await models.User.findByPk(userId);
                if (!user) {
                    throw new Error("User not found");
                }

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
        async editUserProfile(_, args, context) {
            try {
                const userId = context.user.id;  // Suponemos que el ID del usuario está en el contexto (después de autenticar al usuario)

                const user = await models.User.findByPk(userId);
                if (!user) {
                    throw new Error("User not found");
                }

                // Actualizamos solo los campos que se proporcionaron
                await user.update({
                    name: args.name || user.name,
                    email: args.email || user.email,
                    personal_phone: args.personal_phone || user.personal_phone,
                    avatar: args.avatar || user.avatar
                });

                return user;
            } catch (error) {
                throw new Error("Error updating user profile: " + error.message);
            }
        },

        async changePassword(_, args, context) {
            try {
                const userId = context.user.id;

                const user = await models.User.findByPk(userId);
                if (!user) {
                    throw new Error("User not found");
                }

                // Verificamos si la contraseña actual es correcta
                const validPassword = await bcrypt.compare(args.currentPassword, user.password);
                if (!validPassword) {
                    throw new Error("Current password is incorrect");
                }

                // Encriptamos la nueva contraseña
                const hashedPassword = args.newPassword

                // Actualizamos la contraseña
                await user.update({
                    password: hashedPassword
                });

                return true;  // Indicar que la contraseña se actualizó con éxito
            } catch (error) {
                throw new Error("Error changing password: " + error.message);
            }
        }
    },
};
