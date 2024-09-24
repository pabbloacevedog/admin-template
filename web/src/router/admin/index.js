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
                path: "settings",
                component: async () => await import("src/pages/auth/SettingsUser.vue"),

            },
        ],
    },
];
