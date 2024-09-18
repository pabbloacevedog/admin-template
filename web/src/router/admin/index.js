export default [
    {
        path: '/admin',
        component: async () => await  import('layouts/WebLayout.vue'), //aqui va el menu del administrador
        children: [
            { path: '', component: async () => await  import('pages/Home.vue') },
        ],
    },
];
