import { defineStore } from "pinia";
import { apolloClient, gql } from "../plugins/apollo";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
        error: null,
        message: null,
        isUserFetched: false,
        users: [],
        totalUsers: 0,
        error: null,
        show_modal_user: false,
        show_modal_delete: false,
        show_modal_view: false,
        new_avatar: null,
        pagination: {
            page: 1,
            rowsPerPage: 10,
        },
    }),
    actions: {
        async createUser(details) {
            const CREATE_USER_MUTATION = gql`
                mutation createUser(
                    $name: String!
                    $username: String
                    $email: String!
                    $password: String!
                    $personal_phone: String
                    $role_id: Int!
                ) {
                    createUser(
                        name: $name,
                        username: $username,
                        email: $email,
                        password: $password,
                        personal_phone: $personal_phone,
                        role_id: $role_id,
                    ) {
                        user_id
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: CREATE_USER_MUTATION,
                    variables: details,
                    fetchPolicy: "network-only",
                });
                const { user_id, error, message } = response.data.createUser;
                this.error = error;
                return { user_id, message };
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async getAllUsers(search, page, rowsPerPage) {
            // Modificamos el query para aceptar los parámetros de búsqueda y paginación
            const ALL_USERS_QUERY = gql`
                query getAllUsers ($filter: FilterInput, $pagination: PaginationInput!) {
                    getAllUsers(pagination: $pagination, filter: $filter) {
                        users {
                            user_id
                            # rut_user
                            name
                            username
                            email
                            personal_phone
                            avatar
                            role_id
                            verified
                            state
                            role {
                                role_id
                                name
                                title
                                description
                                color
                            }
                            owner_id
                        }
                        totalUsers
                    }
                }
                `;
            const variables = {
                pagination: {
                    page,
                    rowsPerPage
                },
                filter: {
                    search
                }
            };
            try {
                // Ejecutamos la consulta con el filtro de búsqueda y paginación
                const response = await apolloClient.query({
                    query: ALL_USERS_QUERY,
                    variables,
                    fetchPolicy: 'network-only',
                });
                const { users, totalUsers } = response.data.getAllUsers
                // Almacenamos los usuarios en el estado
                this.users = users

                // Almacenamos el número total de usuarios
                this.totalUsers = totalUsers

                return { users: this.users, totalUsers: this.totalUsers };
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async getUsersByOwner(search, page, rowsPerPage) {
            // Modificamos el query para aceptar los parámetros de búsqueda y paginación
            const ALL_USERS_QUERY = gql`
                query getUsersByOwner ($filter: FilterInput, $pagination: PaginationInput!) {
                    getUsersByOwner(pagination: $pagination, filter: $filter) {
                        users {
                            user_id
                            # rut_user
                            name
                            username
                            email
                            personal_phone
                            avatar
                            role_id
                            verified
                            state
                            role {
                                role_id
                                name
                                title
                                description
                                color
                            }
                            owner_id
                        }
                        totalUsers
                    }
                }
                `;
            const variables = {
                pagination: {
                    page,
                    rowsPerPage
                },
                filter: {
                    search
                },
            };
            try {
                // Ejecutamos la consulta con el filtro de búsqueda y paginación
                const response = await apolloClient.query({
                    query: ALL_USERS_QUERY,
                    variables,
                    fetchPolicy: 'network-only',
                });
                const { users, totalUsers } = response.data.getUsersByOwner
                // Almacenamos los usuarios en el estado
                this.users = users

                // Almacenamos el número total de usuarios
                this.totalUsers = totalUsers

                return { users: this.users, totalUsers: this.totalUsers };
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async updateUser(updatedUser) {
            const UPDATE_USER_MUTATION = gql`
                mutation UpdateUser($userId: String!, $input: UserUpdateInput!) {
                    updateUser(userId: $userId, input: $input) {
                        user {
                            user_id
                            # rut_user
                            name
                            username
                            email
                            personal_phone
                            verification_code
                            verified
                            state
                            avatar
                            role_id
                        }
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: UPDATE_USER_MUTATION,
                    variables: {
                        userId: updatedUser.user_id,
                        input: updatedUser,
                    },
                });
                const { user, message } = response.data.updateUser;
                this.user = user; // Actualiza el estado con la respuesta
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async deleteUser(userId) {
            const DELETE_USER_MUTATION = gql`
                mutation DeleteUser($userId: String!) {
                    deleteUser(userId: $userId) {
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: DELETE_USER_MUTATION,
                    variables: { userId },
                });
                const { message } = response.data.deleteUser;
                // Opcional: limpiar el usuario del estado o realizar alguna acción adicional
                this.user = null; // Limpia el estado del usuario después de eliminar
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async uploadAvatarUser(avatarFile, user_id) {
            try {
                const response = await apolloClient.mutate({
                    mutation: gql`
                        mutation UploadAvatar(
                            $userId: String!
                            $avatar: Upload!
                        ) {
                            UploadAvatar(userId: $userId, avatar: $avatar) {
                                avatar
                            }
                        }
                    `,
                    variables: {
                        userId: user_id,
                        avatar: await avatarFile,
                    },
                });
                console.log(response);
                const { avatar } = response.data.UploadAvatar;
                // this.user.avatar = avatar; // Actualiza el avatar del usuario en el store
                return avatar;
            } catch (error) {
                console.error("Error uploading avatar:", error);
                throw error;
            }
        },
        clearError() {
            this.error = null;
        },
    },
});
