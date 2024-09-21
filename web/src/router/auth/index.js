export default [
    {
        path: "/",
        component: async () => await import("layouts/CleanLayout.vue"), //aqui va la webLayout
        children: [
            {
                path: "login",
                component: async () => await import("pages/LoginPage.vue"),
                meta: { requiresAuth: false, onlyWithoutAuth: true },
            },
            {
                path: "register",
                component: async () => await import("pages/RegisterPage.vue"),
                meta: {
                    requiresAuth: false,
                    onlyWithoutAuth: true,
                },
            },
            {
                path: "forgot_password",
                component: async () => await import("pages/ForgotPassword.vue"),
                meta: { requiresAuth: false, onlyWithoutAuth: true },
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
                component: async () => await import("pages/VerifyCode.vue"),
                meta: { requiresAuth: false, onlyWithoutAuth: true },
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
                component: async () => await import("pages/ResetPassword.vue"),
                meta: { requiresAuth: false, onlyWithoutAuth: true },
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
            {
                path: "settings",
                component: async () => await import("pages/SettingsUser.vue"),
                meta: { requiresAuth: true, onlyWithoutAuth: false },
            },
            {
                path: "verify_email",
                component: async () => await import("pages/EmailVerification.vue"),
                name: "VerifyEmail",
                meta: { requiresAuth: false, onlyWithoutAuth: true },
            },
        ],
    },
];
