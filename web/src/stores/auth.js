import { defineStore } from "pinia";
import { apolloClient, gql } from "../plugins/apollo";
import { navigateTo } from "../services/navigationService";
import { useGlobalStore } from 'stores/global';
export const useAuthStore = defineStore("auth", {
    state: () => ({
        email: null,
        actions: null,
        routes: null,
        error: null,
        user: null,
        verification_code: null,
        isUserFetched: false,
        userId: null,
        message: null,
        isAuthenticated: false,
        globalStore: useGlobalStore()
    }),
    actions: {
        async login(credentials) {
            const LOGIN_QUERY = gql`
                query Login($email: String!, $password: String!) {
                    login(email: $email, password: $password) {
                        user {
                            user_id
                            username
                            email
                            role_id
                            avatar
                            name
                            role {
                                role_id
                                name
                                title
                                description
                                color
                            }
                        }
                        actions
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: LOGIN_QUERY,
                    variables: credentials,
                    fetchPolicy: "network-only", // Fuerza la consulta a la API, sin usar caché
                });
                const { actions, user, error } = response.data.login;
                this.actions = actions;
                this.user = user;
                this.error = null;
                console.log("login", error);
                return user;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async register(details) {
            const REGISTER_MUTATION = gql`
                mutation Register(
                    $name: String!
                    $email: String!
                    $password: String!
                ) {
                    register(name: $name, email: $email, password: $password) {
                        email
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: REGISTER_MUTATION,
                    variables: details,
                    fetchPolicy: "network-only",
                });
                const { email, error, message } = response.data.register;
                this.email = email;
                this.error = error;
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        //verificar el email usando GraphQL
        async verifyEmailToken(token) {
            const VERIFY_EMAIL_MUTATION = gql`
                mutation VerifyEmail($token: String!) {
                    VerifyEmail(token: $token) {
                        email
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: VERIFY_EMAIL_MUTATION,
                    variables: { token },
                    fetchPolicy: "network-only",
                });
                const { email, message } = response.data.VerifyEmail;
                this.email = email;
                this.message = message;
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
                            user_id
                            # rut_user
                            name
                            username
                            email
                            personal_phone
                            verified
                            state
                            avatar
                            role_id
                            role {
                                role_id
                                name
                                title
                                description
                                color
                            }
                        }
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: USERSETTINGS_QUERY,
                    variables: { userId: userId },
                    fetchPolicy: "network-only",
                });
                // console.log(response.data.userSettings.user);
                const user = response.data.userSettings.user;
                this.user = user;
                // console.log(user, "userSettings ");
                return user;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async userRoutes() {
            const USER_ROUTER_QUERY = gql`
                query userRoutes {
                    userRoutes {
                        route_id
                        name
                        title
                        description
                        path
                        icon
                        resource
                        module_id
                        action {
                            action_id
                            name
                            title
                            description
                            condition {
                                condition_id
                                name
                                title
                                description
                                resourceAccess{
                                    resource_id
                                    resource_type
                                    user_id
                                    role_id
                                    action_id
                                    condition_id
                                }
                            }
                        }
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: USER_ROUTER_QUERY,
                    fetchPolicy: "network-only",
                });
                // console.log(response.data);
                const { userRoutes } = response.data;
                this.routes = userRoutes;
                return userRoutes;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async updateUserSettings(updatedUser) {
            console.log("updateUserSettings", updatedUser);
            const UPDATE_ACCOUNT_MUTATION = gql`
                mutation updateAccount(
                    $userId: String!
                    $input: UserUpdateInput!
                ) {
                    updateAccount(userId: $userId, input: $input) {
                        user{
                            user_id
                            # rut_user
                            name
                            username
                            email
                            personal_phone
                            verified
                            state
                            avatar
                            role_id
                            role {
                                role_id
                                name
                                title
                                description
                                color
                            }
                        }
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: UPDATE_ACCOUNT_MUTATION,
                    variables: {
                        userId: updatedUser.user_id,
                        input: updatedUser,
                    },
                });
                const { user, message } = response.data.updateAccount;
                this.user = user; // Actualiza el estado con la respuesta
                return message;
            } catch (error) {
                console.log(error);
                this.error = error.message;
                throw error;
            }
        },
        async changePassword({ currentPassword, newPassword }) {
            const CHANGE_PASSWORD_MUTATION = gql`
                mutation changePassword(
                    $currentPassword: String!
                    $newPassword: String!
                ) {
                    changePassword(
                        currentPassword: $currentPassword
                        newPassword: $newPassword
                    ){
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: CHANGE_PASSWORD_MUTATION,
                    variables: {
                        currentPassword,
                        newPassword,
                    },
                    fetchPolicy: "network-only",
                });
                const { message } = response.data.changePassword;
                // console.log(response);
                // this.user.avatar = avatar; // Actualiza el avatar del usuario en el store
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async uploadAvatar(avatarFile) {
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
                        userId: this.user.user_id,
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
        async forgotPassword(email) {
            const FORGOT_PASSWORD_MUTATION = gql`
                mutation ForgotPassword($email: String!) {
                    forgotPassword(email: $email) {
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: FORGOT_PASSWORD_MUTATION,
                    variables: { email },
                    fetchPolicy: "network-only",
                });
                localStorage.setItem("forgot", true);
                // console.log(response, "forgot password");
                const { message, error } = response.data.forgotPassword;
                this.error = error;
                return message;
            } catch (error) {
                console.log("error", error);
                this.error = error.message;
                throw error;
            }
        },
        async verifyCode(verification_code) {
            const VERIFY_CODE_MUTATION = gql`
                mutation VerifyCode($verification_code: String!) {
                    verifyCode(verification_code: $verification_code) {
                        user_id
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: VERIFY_CODE_MUTATION,
                    variables: { verification_code },
                    fetchPolicy: "network-only",
                });
                // console.log(response, "verifyCode");
                const { user_id, message } = response.data.verifyCode;
                this.userId = user_id;
                localStorage.setItem("userIdForgot", user_id);
                localStorage.removeItem("forgot");
                this.message = message;
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        // Método para restablecer la contraseña
        async resetPassword(newPassword) {
            const RESET_PASSWORD_MUTATION = gql`
                mutation ResetPassword(
                    $userId: String!
                    $newPassword: String!
                ) {
                    resetPassword(userId: $userId, newPassword: $newPassword) {
                        message
                    }
                }
            `;

            const userId = this.userId || localStorage.getItem("userIdForgot");

            if (!userId) {
                this.error = "Error al identificar al usuario";
                return;
            }

            try {
                const response = await apolloClient.mutate({
                    mutation: RESET_PASSWORD_MUTATION,
                    variables: { userId, newPassword },
                    fetchPolicy: "network-only",
                });
                // console.log("resetPassword", response);
                const { message } = response.data.resetPassword;
                this.message = message;
                this.error = null; // Limpiar errores si la operación fue exitosa
                this.userId = null;
                localStorage.removeItem("userIdForgot");
                return this.message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },

        // Método para guardar el userId después de verificar el código
        setUserId(userId) {
            this.userId = userId;
            localStorage.setItem("userId", userId);
        },
        async fetchUser() {
            const ISAUTH_QUERY = gql`
                query isAuth {
                    isAuth {
                        user {
                            user_id
                            username
                            email
                            role_id
                            avatar
                            name
                            role {
                                role_id
                                name
                                title
                                description
                                color
                            }
                        }
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: ISAUTH_QUERY,
                    operationName: "isAuth",
                    fetchPolicy: "network-only",
                });
                const { user } = response.data.isAuth;
                this.user = user;
                this.isUserFetched = true; // Se marca como verdadero una vez que se obtiene el estado del usuario
            } catch (error) {
                console.error("Error fetching user:", error);
                this.user = null;
                this.isUserFetched = true; // Aunque haya un error, marcamos que ya se ha intentado
            }
        },
        async isAuth() {
            const ISAUTH_QUERY = gql`
                query isAuthBool {
                    isAuthBool {
                        isAuth
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: ISAUTH_QUERY,
                    operationName: "isAuth",
                    fetchPolicy: "network-only",
                });
                const { isAuth } = response.data.isAuthBool;
                this.isAuthenticated = isAuth;
                return isAuth;
            } catch (error) {
                console.error("Error fetching user:", error);
                this.user = null;
            }
        },
        async logOut() {
            const LOGOUT_QUERY = gql`
                query logout {
                    logout {
                        message
                    }
                }
            `;
            try {
                // Ejecuta la mutación para hacer logout
                const response = await apolloClient.query({
                    query: LOGOUT_QUERY,
                    fetchPolicy: "network-only",
                });
                const { message } = response.data.logout;
                if (response.data) {
                    console.log(response.data, "logout");
                    // Limpia el estado del usuario
                    this.user = null;
                    navigateTo("/login");
                    // Restablecer el store global
                    this.globalStore.resetStore();
                    return message;
                }
            } catch (error) {
                console.error("Error during logout:", error);
                return false;
            }
        },
        async updateUserStore(user) {
            try {
                this.user = user
            } catch (error) {
                console.error("Error fetching user:", error);
                this.user = null;
            }
        },
        clearError() {
            this.error = null;
        },
    },
});
