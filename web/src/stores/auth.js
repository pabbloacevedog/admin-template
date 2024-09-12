import { defineStore } from "pinia";
import { apolloClient, gql } from "../plugins/apollo";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        email: null,
        actions: null,
        error: null,
        user: null,
    }),
    actions: {
        async login(credentials) {
            const LOGIN_QUERY = gql`
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        user {
                            user_id,
                            username,
                            email,
                            role_id,
                            avatar
                        },
                        actions
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: LOGIN_QUERY,
                    variables: credentials,
                });
                const { actions, user } = response.data.login;
                this.actions = actions;
                this.user = user;
                this.error = null;
                return user;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async register(details) {
            const REGISTER_MUTATION = gql`
                mutation Register($email: String!, $password: String!) {
                    register(email: $email, password: $password) {
                        email,
                        message,
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: REGISTER_MUTATION,
                    variables: details,
                });
                const { email, message } = response.data.register;
                this.email = email;
                this.error = null;
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async userSettings(userId) {
            const USERSETTINGS_QUERY = gql`
                query userSettings($userId: String!) {
                    userSettings(userId: $userId) {
                        user {
                            user_id,
                            rut_user,
                            name,
                            username,
                            email,
                            personal_phone,
                            verification_code,
                            verified,
                            state,
                            avatar,
                            role_id
                        },
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: USERSETTINGS_QUERY,
                    variables: { userId: userId },
                });
                console.log(response.data.userSettings.user);
                const user = response.data.userSettings.user;
                this.user = user;
                console.log(user, "userSettings ");
                return user;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async updateUserSettings(updatedUser) {
            const UPDATE_USER_MUTATION = gql`
                mutation UpdateUser($userId: String!, $input: UserUpdateInput!) {
                    updateUser(userId: $userId, input: $input) {
                        user_id,
                        rut_user,
                        name,
                        username,
                        email,
                        personal_phone,
                        verification_code,
                        verified,
                        state,
                        avatar,
                        role_id
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
                        }
                    }
                });
                const updatedData = response.data.updateUser;
                this.user = updatedData;  // Actualiza el estado con la respuesta
                return updatedData;
            } catch (error) {
                console.log(error);
                this.error = error.message;
                throw error;
            }
        },
        async fetchUser() {
            const ISAUTH_QUERY = gql`
                query isAuth {
                    isAuth {
                        user {
                            user_id,
                            username,
                            email,
                            role_id,
                            avatar
                        }
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: ISAUTH_QUERY,
                    operationName: "isAuth"
                });
                const { user } = response.data.isAuth;
                this.user = user;
            } catch (error) {
                console.error(error);
                this.user = null;
                // Puedes redirigir al login si falla la autenticación
            }
        },
        logout() {
            // Eliminar la cookie y limpiar el estado
            this.user = null;
            this.actions = null;
        },
        clearError() {
            this.error = null;
        },
    },
});
