import { defineStore } from "pinia";
import { apolloClient, gql } from "../plugins/apollo";
import { navigateTo } from "../services/navigationService";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
        error: null,
        message: null,
        isUserFetched: false,
    }),
    actions: {
        async fetchUserById(userId) {
            const USER_QUERY = gql`
                query getUserById($userId: String!) {
                    getUserById(userId: $userId) {
                        user {
                            user_id
                            rut_user
                            name
                            username
                            email
                            personal_phone
                            verification_code
                            verified
                            state
                            avatar
                            role_id
                            role {
                                name
                            }
                        }
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: USER_QUERY,
                    variables: { userId },
                    fetchPolicy: "network-only",
                });
                this.user = response.data.getUserById.user;
                this.isUserFetched = true; // Marca que el usuario ha sido fetchado
                return this.user;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async getAllUsers() {
            const ALL_USERS_QUERY = gql`
                query {
                    getUsers {
                        user_id
                        rut_user
                        name
                        username
                        email
                        personal_phone
                        avatar
                        role_id
                        role {
                            role_id
                            name
                            title
                            description
                        }
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: ALL_USERS_QUERY,
                    fetchPolicy: "network-only",
                });
                this.users = response.data.getUsers;  // Almacena todos los usuarios en el estado
                return this.users;
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
                            rut_user
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
                        input: {
                            name: updatedUser.name,
                            username: updatedUser.username,
                            email: updatedUser.email,
                            personal_phone: updatedUser.personal_phone,
                            rut_user: updatedUser.rut_user,
                            verified: updatedUser.verified,
                            avatar: updatedUser.avatar,
                            role_id: updatedUser.role_id,
                        },
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
        clearError() {
            this.error = null;
        },
    },
});
