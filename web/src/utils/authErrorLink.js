// src/utils/authErrorLink.js
import { onError } from "@apollo/client/link/error";
import { Notify } from 'quasar';
import { navigateTo } from "../services/navigationService";
export const authErrorLink = onError(({ graphQLErrors, networkError }) => {

    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            console.log('GraphQL Errors:', graphQLErrors);
            const errorCode = err.extensions?.code;
            console.log(err,'err')
            if (errorCode === "UNAUTHENTICATED" ) {
                // Asegúrate de que no redirija infinitamente a /login
                // console.log(window.location.hash,'authlinkerror')
                // console.log(window.location.hash,'authlinkerror')
                if (window.location.hash !== '#/login') {
                    navigateTo("/login");
                }
                Notify.create({
                    type: 'negative',
                    message: err.message
                });
            } else {
                Notify.create({
                    type: 'negative',
                    message: err.message
                });
                console.error(`[GraphQL error]: Message: ${err.message}, Code: ${errorCode}`);
            }
            // Notify.create({
            //     type: 'negative',
            //     message: `Error: ${err.message}`,
            // });
        }


        // Notify.create({
        //     type: 'negative',
        //     message: networkError.message,
        // });
        console.log(`[Network error]: ${networkError}`);
    }
});
