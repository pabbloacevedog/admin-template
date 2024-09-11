import { boot } from 'quasar/wrappers';
import { ApolloClient, InMemoryCache, split, ApolloLink } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
console.log('VITE_GRAPHQL_URL', import.meta.env.VITE_GRAPHQL_URL)
console.log('VITE_GRAPHQL_WS', import.meta.env.VITE_GRAPHQL_WS)
const httpLink = createUploadLink({
    uri: import.meta.env.VITE_GRAPHQL_URL, credentials: 'include' // Asegúrate de incluir las cookies en cada solicitud
});
const wsLink = new GraphQLWsLink(createClient({
    url: import.meta.env.VITE_GRAPHQL_WS,
    options: { reconnect: true },
}));

let token = localStorage.getItem('token');
const withToken = setContext(() => ({ token }));
const resetToken = onError(({ networkError }) => {
    if (networkError && networkError.name === 'ServerError' && networkError.statusCode === 401) {
        token = null;
    }
});

const authFlowLink = withToken.concat(resetToken);
const terminatingLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
);

const apolloClient = new ApolloClient({
    link: ApolloLink.from([onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
            );
        }
        if (networkError) {
            console.log(`[Network error]: ${networkError}`);
        }
    }), authFlowLink, terminatingLink]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

// Exporta la instancia de Apollo Client
export { apolloClient };
export default boot(({ app }) => {

    app.provide(provideApolloClient, apolloClient);
    provideApolloClient(apolloClient)
    // app.config.globalProperties.$apollo = apolloClient;
});
