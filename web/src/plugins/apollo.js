import {
    ApolloClient,
    InMemoryCache,
    gql,
    HttpLink,
} from "@apollo/client/core";
const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL, // URL de tu servidor GraphQL
    credentials: "include", // Incluye las credenciales en las peticiones
});

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export { apolloClient, gql };
