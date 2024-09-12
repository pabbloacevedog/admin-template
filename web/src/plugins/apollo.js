// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, gql } from '@apollo/client/core';
import { authErrorLink } from '../utils/authErrorLink'; // Asegúrate de importar correctamente

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL, // URL de tu servidor GraphQL
    credentials: 'include', // Incluye las credenciales en las peticiones
});

const link = ApolloLink.from([authErrorLink, httpLink]);

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

export { apolloClient, gql };
