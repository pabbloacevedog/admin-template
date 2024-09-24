export default [
    {
        path: "/",
        component: async () => await import("layouts/CleanLayout.vue"), //aqui va la webLayout
        meta: { requiresAuth: false, onlyWithoutAuth: true },
        children: [
            {
                path: "login",
                component: async () => await import("components/Login.vue"),
            },
            {
                path: "register",
                component: async () => await import("src/pages/auth/RegisterPage.vue"),
                meta: {
                    requiresAuth: false,
                    onlyWithoutAuth: true,
                },
            },
            {
                path: "forgot_password",
                component: async () => await import("src/pages/auth/ForgotPassword.vue"),

                beforeEnter(to, from, next) {
                    if (localStorage.getItem("userIdForgot")) {
                        next("reset_password");
                    } else {
                        if (localStorage.getItem("forgot")) {
                            next("verify_code");
                        } else {
                            next();
                        }
                    }
                },
            },
            {
                path: "verify_code",
                component: async () => await import("src/pages/auth/VerifyCode.vue"),
                beforeEnter(to, from, next) {
                    if (!localStorage.getItem("forgot")) {
                        if (localStorage.getItem("userIdForgot")) {
                            next("reset_password");
                        } else {
                            next("forgot_password");
                        }
                    } else {
                        next();
                    }
                },
            },
            {
                path: "reset_password",
                component: async () => await import("src/pages/auth/ResetPassword.vue"),
                beforeEnter(to, from, next) {
                    if (!localStorage.getItem("userIdForgot")) {
                        if (localStorage.getItem("forgot")) {
                            next("verify_code");
                        } else {
                            next("forgot_password");
                        }
                    } else {
                        next();
                    }
                },
            },
            // {
            //     path: "settings",
            //     component: async () => await import("src/pages/auth/SettingsUser.vue"),
            //     meta: { requiresAuth: true, onlyWithoutAuth: false },
            // },
            {
                path: "verify_email",
                component: async () => await import("src/pages/auth/EmailVerification.vue"),
                name: "VerifyEmail",

            },
        ],
    },
];
