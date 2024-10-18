import { route } from "quasar/wrappers";
import {
    createRouter,
    createMemoryHistory,
    createWebHistory,
    createWebHashHistory,
} from "vue-router";
// import routes from "./routes";
import { useAuthStore } from "stores/auth";
import { initializeRouter } from "../services/navigationService";

//routes
import Auth from './auth'
import notFound from './notFound'
import Web from './web'
import Admin from './admin'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
const auxiliar = [];
//concatenamos las rutas y asignamos la variable route que usara vue router
const routes = auxiliar.concat(
    //aqui se agregan las rutas de los archivos o paginas del sistema
    Web,
    Auth,
    Admin,
    notFound,
    //incluir siempre el router del empresa, al final, ya que al recibir el parametro, causa conflicto con los otros routers
    //   empresa
)
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
        } else if (onlyWithoutAuth) {
            // Si el usuario está autenticado y trata de acceder a una ruta lo envia al admin
            if (await authStore.isAuth()) {
                return next({ path: "/admin" });
            }
            return next(); // cambia de ruta si no es auth
        } else {
            // console.log("to",to);
            // debugger
            // if(to.fullPath === "/login"|| to.fullPath === "/register"|| to.fullPath === "/forgot_password"|| to.fullPath === "/verify_code" || to.fullPath === "/reset_password"){
            //     return next({ path: "/settings" });
            // }
            // else{
            //     return next();
            // }
            return next();

        }
    });

    return Router;
});
