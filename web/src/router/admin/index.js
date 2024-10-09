export default [
    {
        path: "/admin",
        component: async () => await import("layouts/AdminLayout.vue"), //aqui va el menu del administrador
        meta: { requiresAuth: true, onlyWithoutAuth: false },
        children: [
            {
                path: "",
                component: async () => await import("src/pages/admin/Dashboard.vue"),
            },
            {
                path: "account",
                component: async () => await import("src/pages/auth/AccountSettings.vue"),

            },
            {
                path: "users",
                component: async () => await import("src/pages/admin/UserPage.vue"),

            },
            {
                path: "roles",
                component: async () => await import("src/pages/admin/RolePage.vue"),

            },
        ],
    },
];
