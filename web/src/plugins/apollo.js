// src/apolloClient.js
import {
    ApolloClient,
    InMemoryCache,
    ApolloLink,
    gql,
    split
} from "@apollo/client/core";
import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
const httpLink = createUploadLink({
    uri: import.meta.env.VITE_GRAPHQL_URL, // URL de tu servidor GraphQL
    credentials: "include",
    headers: {
        "Apollo-Require-Preflight": "true",
    },
});
const wsLink = new GraphQLWsLink(createClient({
    url: import.meta.env.VITE_GRAPHQL_WS,
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);
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
