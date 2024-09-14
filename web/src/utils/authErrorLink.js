// src/utils/authErrorLink.js
import { onError } from "@apollo/client/link/error";
import { navigateTo } from "../services/navigationService";
import { useAuthStore } from "../stores/auth";
import { Notify } from 'quasar';
// export const authErrorLink = onError(({ graphQLErrors, networkError }) => {
//     const authStore = useAuthStore();

//     if (graphQLErrors) {
//         for (let err of graphQLErrors) {
//             const errorCode = err.extensions?.code;
//             console.log(err,'err')
//             if (errorCode === "UNAUTHENTICATED") {
//                 // authStore.logout();
//                 navigateTo("/login");
//             } else {
//                 console.error(`[GraphQL error]: Message: ${err.message}, Code: ${errorCode}`);
//             }
//             Notify.create({
//                 type: 'negative',
//                 message: err.message
//             });
//         }
//     }

//     if (networkError) {
//         console.error(`[Network error]: ${networkError}`);
//     }
// });
export const authErrorLink = onError(({ graphQLErrors, networkError }) => {
    const authStore = useAuthStore();

    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            const errorCode = err.extensions?.code;
            console.log(err,'err')
            if (errorCode === "UNAUTHENTICATED") {
                // Asegúrate de que no redirija infinitamente a /login
                // console.log(window.location.hash,'authlinkerror')
                // console.log(window.location.hash,'authlinkerror')
                // if (window.location.hash !== '#/login') {
                //     navigateTo("/login");
                // }
                Notify.create({
                    type: 'negative',
                    message: err.message
                });
            } else {
                console.error(`[GraphQL error]: Message: ${err.message}, Code: ${errorCode}`);
            }

        }
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});
