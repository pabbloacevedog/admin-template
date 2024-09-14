
const routes = [
    {
        path: '/',
        component: async () => await  import('layouts/CleanLayout.vue'), //aqui va la webLayout
        children: [
            { path: '', component: async () => await  import('pages/Home.vue'), meta: { requiresAuth: false, onlyWithoutAuth: false } },
            { path: 'login', component: async () => await import('components/Login.vue'), meta: { requiresAuth: false, onlyWithoutAuth: true } },
            { path: 'register', component: async () => await import('components/Register.vue'), meta: { requiresAuth: false, onlyWithoutAuth: true } },
            { path: 'forgot_password', component: async () => await import('pages/ForgotPassword.vue'), meta: { requiresAuth: false, onlyWithoutAuth: true } },
            { path: 'verify_code', component: async () => await import('pages/VerifyCode.vue'), meta: { requiresAuth: false, onlyWithoutAuth: true } },
            { path: 'reset_password', component: async () => await import('pages/ResetPassword.vue'), meta: { requiresAuth: false, onlyWithoutAuth: true } },
            { path: 'settings', component: async () => await import('pages/SettingsUser.vue'), meta: { requiresAuth: true, onlyWithoutAuth: false } },
            { path: 'test', component: async () => await import('pages/SettingsUserTest.vue'), meta: { requiresAuth: true, onlyWithoutAuth: false } },
        ],
    },
    {
        path: '/admin',
        component: async () => await  import('layouts/WebLayout.vue'), //aqui va el menu del administrador
        children: [
            { path: '', component: async () => await  import('pages/Home.vue') },
        ],
    },
    // cualquier otro modulo se agrega como el del admin
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
    }
]

export default routes
