export default [
    {
        path: "/admin",
        component: async () => await import("layouts/AdminLayout.vue"), //aqui va el menu del administrador
        meta: { requiresAuth: true, onlyWithoutAuth: false },
        children: [
            {
                path: "account",
                name: "dashboard",
                component: async () => await import("src/pages/admin/Dashboard.vue"),
            },
            {
                name: "",
                path: "account",
                component: async () => await import("src/pages/auth/AccountSettings.vue"),

            },
            {
                name: "users",
                path: "users",
                component: async () => await import("src/pages/admin/UserPage.vue"),

            },
            {
                name: "roles",
                path: "roles",
                component: async () => await import("src/pages/admin/RolePage.vue"),

            },
        ],
    },
];
