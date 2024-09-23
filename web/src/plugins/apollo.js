// src/apolloClient.js

import {
    ApolloClient,
    InMemoryCache,
    ApolloLink,
    gql,
} from "@apollo/client/core";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const httpLink = createUploadLink({
    uri: import.meta.env.VITE_GRAPHQL_URL, // URL de tu servidor GraphQL
    credentials: "include",
    headers: {
        "Apollo-Require-Preflight": "true",
    },
});

// import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, gql } from '@apollo/client/core';
import { authErrorLink } from "../utils/authErrorLink"; // Asegúrate de importar correctamente
// import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
// const httpLink = createUploadLink({
//     uri: import.meta.env.VITE_GRAPHQL_URL, // URL de tu servidor GraphQL
//     credentials: 'include', // Incluye las credenciales en las peticiones
// });

const link = ApolloLink.from([authErrorLink, httpLink]);

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

export { apolloClient, gql };
