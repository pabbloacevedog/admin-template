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
    Router.beforeEach(async (to, from, next) => {
        const authStore = useAuthStore();

        // Rutas que solo se deben permitir sin autenticación
        const onlyWithoutAuth = to.matched.some(
            (record) => record.meta.onlyWithoutAuth,
        );
        
        // Verifica si la ruta requiere autenticación
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            // Intenta obtener al usuario autenticado
            await authStore.fetchUser();
            // Si la ruta requiere autenticación
            if (!authStore.user) {
                // Si no está autenticado, redirige a /login
                return next({ path: "/login" });
            } else {
                // Si está autenticado, permite continuar a la ruta protegida
                return next();
            }
        } else if (onlyWithoutAuth && authStore.user) {
            // Si el usuario está autenticado y trata de acceder a una ruta que solo es accesible sin autenticación
            // Evita redirigir a la ruta solicitada y quédate en la ruta actual
            return next(false); // Evita que cambie de ruta
        } else {
            // Si no requiere autenticación o no cae en las condiciones previas, permite continuar
            return next();
        }
    });

    return Router;
});
