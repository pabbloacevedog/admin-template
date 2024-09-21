import { defineStore } from "pinia";
import { apolloClient, gql } from "../plugins/apollo";
import { navigateTo } from "../services/navigationService";
export const useAuthStore = defineStore("auth", {
    state: () => ({
        email: null,
        actions: null,
        error: null,
        user: null,
        verification_code: null,
        isUserFetched: false,
        userId: null,
        message: null,
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
                mutation Register($name:String!, $email: String!, $password: String!) {
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
                        email,
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: VERIFY_EMAIL_MUTATION,
                    variables: { token },
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
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: USERSETTINGS_QUERY,
                    variables: { userId: userId },
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
        async updateUserSettings(updatedUser) {
            const UPDATE_USER_MUTATION = gql`
                mutation UpdateUser(
                    $userId: String!
                    $input: UserUpdateInput!
                ) {
                    updateUser(userId: $userId, input: $input) {
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
                const updatedData = response.data.updateUser;
                this.user = updatedData; // Actualiza el estado con la respuesta
                return updatedData;
            } catch (error) {
                console.log(error);
                this.error = error.message;
                throw error;
            }
        },
        async changePassword({ currentPassword, newPassword }) {
            const CHANGE_PASSWORD_MUTATION = gql`
                mutation ChangePassword(
                    $currentPassword: String!
                    $newPassword: String!
                ) {
                    changePassword(
                        currentPassword: $currentPassword
                        newPassword: $newPassword
                    )
                }
            `;
            try {
                await apolloClient.mutate({
                    mutation: CHANGE_PASSWORD_MUTATION,
                    variables: {
                        currentPassword,
                        newPassword,
                    },
                });
            } catch (error) {
                this.error = error.message;
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
                    errorPolicy: "all",
                });
                localStorage.setItem("forgot", true);
                console.log(response, "forgot password");
                const { message, error } = response.data.forgotPassword;
                this.error = error;
                return message;
            } catch (error) {
                debugger;
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
                });
                console.log(response, "verifyCode");
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
                });
                console.log("resetPassword", response);
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
                        }
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: ISAUTH_QUERY,
                    operationName: "isAuth",
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
                });

                if (response.data) {
                    console.log(response.data, "logout");
                    // Limpia el estado del usuario
                    this.user = null;
                    navigateTo("/login");
                    return true;
                }
            } catch (error) {
                console.error("Error during logout:", error);
                return false;
            }
        },
        clearError() {
            this.error = null;
        },
    },
});
