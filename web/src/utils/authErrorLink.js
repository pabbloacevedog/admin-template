// src/utils/authErrorLink.js
import { onError } from "@apollo/client/link/error";
import { navigateTo } from "../services/navigationService";
import { useAuthStore } from "../stores/auth";
import { Notify } from 'quasar';
export const authErrorLink = onError(({ graphQLErrors, networkError }) => {
    const authStore = useAuthStore();

    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            const errorCode = err.extensions?.code;
            console.log(err,'err')
            if (errorCode === "UNAUTHENTICATED") {
                authStore.logout();
                navigateTo("/login");
            } else {
                console.error(`[GraphQL error]: Message: ${err.message}, Code: ${errorCode}`);
            }
            Notify.create({
                type: 'negative',
                message: err.message
            });
        }
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});
