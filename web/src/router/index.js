import { route } from "quasar/wrappers";
import {
    createRouter,
    createMemoryHistory,
    createWebHistory,
    createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "../stores/auth";
import { initializeRouter } from "../services/navigationService";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === "history"
          ? createWebHistory
          : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.VUE_ROUTER_BASE),
    });
    initializeRouter(Router);
    // Router.beforeEach(async (to, from, next) => {
    //     const authStore = useAuthStore();
    //     // Intenta obtener al usuario autenticado
    //     await authStore.fetchUser();

    //     // Verifica si la ruta requiere autenticación
    //     if (to.matched.some((record) => record.meta.requiresAuth)) {
    //         if (!authStore.user) {
    //             // Si el usuario no está autenticado, redirige a /login
    //             return next({ path: "/login" });
    //         } else {
    //             // Si el usuario está autenticado, deja continuar
    //             return next();
    //         }
    //     } else {
    //         // Si no requiere autenticación
    //         if (authStore.user && to.path === "/login") {
    //             // Si el usuario está autenticado y trata de ir a /login, redirige a /settings
    //             return next({ path: "/settings" });
    //         } else {
    //             // Si no está autenticado o está yendo a una ruta pública, deja continuar
    //             return next();
    //         }
    //     }
    // });
    Router.beforeEach(async (to, from, next) => {
        const authStore = useAuthStore();



        // Verifica si la ruta requiere autenticación
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            // Intenta obtener al usuario autenticado

            await authStore.fetchUser();
            console.log('if 1')
            if (!authStore.user) {
                console.log('if 1.1')
                // Si el usuario no está autenticado y no está en /login
                console.log(to,'to authrequired');
                if (to.path !== "/login") {
                    console.log('if 1.1.1')
                    return next({ path: "/login" });
                }
            } else {
                // Si el usuario está autenticado, deja continuar
                return next();
            }
        } else {
            console.log('else 1')
            // Si no requiere autenticación
            console.log(to,'to no authrequired');
            if (authStore.user && to.path === "/login") {
                console.log('else 1 if 1')
                // Si el usuario está autenticado y trata de ir a /login, redirige a /settings
                return next({ path: "/settings" });
            } else {
                console.log('else 1.1')
                // Si no está autenticado o está yendo a una ruta pública, deja continuar
                return next();
            }
        }
    });


    return Router;
});
