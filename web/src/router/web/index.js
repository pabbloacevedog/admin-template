export default [
    {
        path: "/",
        component: async () => await import("layouts/CleanLayout.vue"), //aqui va la webLayout
        children: [
            {
                path: "",
                component: async () => await import("pages/Home.vue"),
                meta: { requiresAuth: false, onlyWithoutAuth: false },
            },
        ],
    },
];
