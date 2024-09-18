import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';
import errorTranslations from '../utils/errorTranslations.js';
import { asyncLocalStorage } from '../middleware/languageMiddleware.js';

export const ErrorTypes = {
    BAD_USER_INPUT: {
        errorCode: ApolloServerErrorCode.BAD_USER_INPUT,
        errorStatus: 400,
    },
    BAD_USER_PASSWORD: {
        errorCode: 'BAD_USER_PASSWORD',
        errorStatus: 400,
    },
    USER_NOT_FOUND: {
        errorCode: 'USER_NOT_FOUND',
        errorStatus: 400,
    },
    BAD_REQUEST: {
        errorCode: ApolloServerErrorCode.BAD_REQUEST,
        errorStatus: 400,
    },
    INVALID_RESET_TOKEN: {
        errorCode: 'NO_ACTIONS_FOR_ROLE',
        errorStatus: 400,
    },
    NO_ACTIONS_FOR_ROLE: {
        errorCode: 'INVALID_RESET_TOKEN',
        errorStatus: 400,
    },
    NOT_FOUND: {
        errorCode: 'NOT_FOUND',
        errorStatus: 404,
    },
    UNAUTHENTICATED: {
        errorCode: 'UNAUTHENTICATED',
        errorStatus: 401,
    },
    UNAUTHORIZED: {
        errorCode: 'UNAUTHORIZED',
        errorStatus: 403,
    },
    TOKEN_EXPIRED: {
        errorCode: 'TOKEN_EXPIRED',
        errorStatus: 401,
    },
    USER_ALREADY_EXISTS: {
        errorCode: 'USER_ALREADY_EXISTS',
        errorStatus: 400,
    },
    INTERNAL_SERVER_ERROR: {
        errorCode: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
        errorStatus: 500,
    },
    PASSWORD_SAME_AS_OLD:{
        errorCode: 'PASSWORD_SAME_AS_OLD',
        errorStatus: 400,
    }

};
const getCurrentLanguage = () => {
    const store = asyncLocalStorage.getStore();
    let lang = store ? store.get('lang') : 'en';
    // Solo tomar el prefijo del idioma (p. ej., 'es' en lugar de 'es-419')
    lang = lang.split('-')[0];
    return lang;
};
// Función para lanzar errores personalizados
export default (errorType) => {
    const lang = getCurrentLanguage();
    console.log(errorType.errorCode)
    console.log(lang)
    const errorMessage = errorTranslations[lang][errorType.errorCode] || errorTranslations['en'][errorType.errorCode];
    throw new GraphQLError(errorMessage, {
        extensions: {
            code: errorType.errorCode,
            http: {
                status: errorType.errorStatus,
            },
        },
    });
};
