import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
// import Colada Plugin

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
    const pinia = createPinia()
    // You can add Pinia plugins here
    // pinia.use(SomePiniaPlugin)
    const storeNames = pinia._s; // Obtiene los nombres de las tiendas registradas
    console.log('Stores registradas en Pinia:', storeNames);
    return pinia
})
