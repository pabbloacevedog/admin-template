
const routes = [
    {
        path: '/',
        component: async () => await  import('layouts/CleanLayout.vue'),
        children: [
            { path: '', component: async () => await  import('pages/Home.vue'), meta: { requiresAuth: false } },
            { path: 'login', component: async () => await import('components/Login.vue'), meta: { requiresAuth: false } },
            { path: 'register', component: async () => await import('components/Register.vue'), meta: { requiresAuth: false } },
            { path: 'settings', component: async () => await import('pages/SettingsUser.vue'), meta: { requiresAuth: true } },
        ],
    },
    {
        path: '/',
        component: async () => await  import('layouts/WebLayout.vue'),
        children: [
            { path: '', component: async () => await  import('pages/Home.vue') },
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
