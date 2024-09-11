
const routes = [
    {
        path: '/',
        component: async () => await  import('../App.vue'),
        children: [
            { path: '', component: async () => await  import('pages/Home.vue') },
            { path: 'login', component: async () => await import('components/Login.vue') },
            { path: 'register', component: async () => await import('components/Register.vue') },
            { path: 'protected', component: async () => await import('pages/ProtectedPage.vue'), meta: { requiresAuth: true } },
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
