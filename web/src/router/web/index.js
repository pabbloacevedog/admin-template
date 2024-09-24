export default [
    {
        path: "/",
        component: async () => await import("layouts/WebLayout.vue"), //aqui va la webLayout
        children: [
            {
                path: "",
                component: async () => await import("src/pages/web/Home.vue"),
                meta: { requiresAuth: false, onlyWithoutAuth: false },
            },
        ],
    },
];
