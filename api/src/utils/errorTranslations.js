// src/utils/errorTranslations.js

const errorTranslations = {
    en: {
        BAD_USER_PASSWORD: 'The password you entered is incorrect. Please try again.',
        BAD_USER_INPUT: 'We do not have any registered users with the email provided.',
        USER_NOT_FOUND: 'User not found.',
        INVALID_RESET_TOKEN: 'The reset token is invalid or has expired.',
        NO_ACTIONS_FOR_ROLE: 'No actions found for the specified role.',
        NOT_FOUND: 'The requested resource was not found.',
        UNAUTHENTICATED: 'You are not authenticated. Please log in.',
        UNAUTHORIZED: 'You do not have permissions for this action.',
        TOKEN_EXPIRED: 'Token expired, login again.',
        USER_ALREADY_EXISTS: 'The user already exists. Login with your credentials',
        USER_CREATE_ALREADY_EXISTS: 'The user already exists.',
        INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
        PASSWORD_SAME_AS_OLD: 'The new password is the same as old.',
        INVALID_VERIFY_CODE: 'The verify code was invalid.',
        EXPIRED_VERIFY_CODE: 'The verify code has expired.',
        WRONG_CURRENT_PASSWORD: 'Wrong current password',
        EMAIL_NOT_VERIFIED:'Email not verified, please verify your email before logging in.',
        EMAIL_ALREADY_IN_USE:'Email already in use by another user.'
    },
    es: {
        BAD_USER_PASSWORD: 'Lo sentimos, la contraseña que ingresaste es incorrecta. Inténtalo de nuevo.',
        BAD_USER_INPUT: 'No tenemos ningun usuario registrado con el email proporcionado.',
        USER_NOT_FOUND: 'No hay usuarios registrados con ese email.',
        INVALID_RESET_TOKEN: 'El token de restablecimiento es inválido o ha expirado.',
        NO_ACTIONS_FOR_ROLE: 'No se encontraron acciones para el rol especificado.',
        NOT_FOUND: 'No se encontró el recurso solicitado.',
        UNAUTHENTICATED: 'No estás autenticado. Por favor, inicia sesión.',
        UNAUTHORIZED: 'No tienes permisos para esta acción.',
        TOKEN_EXPIRED: 'Token expirado, inicia sesión nuevamente.',
        USER_ALREADY_EXISTS: 'El usuario ya existe. Inicia sesión con tus credentiales',
        USER_CREATE_ALREADY_EXISTS: 'El usuario ya existe.',
        INTERNAL_SERVER_ERROR: 'Ocurrió un error interno en el servidor.',
        PASSWORD_SAME_AS_OLD: 'La contraseña es igual que la anterior.',
        INVALID_VERIFY_CODE: 'Código de verificación inválido',
        EXPIRED_VERIFY_CODE: 'El código de verificación ha expirado',
        WRONG_CURRENT_PASSWORD: 'contraseña actual incorrecta',
        EMAIL_NOT_VERIFIED:'Email no verificado, verificalo desde tu correo para continuar.',
        EMAIL_ALREADY_IN_USE:'El email esta siendo usado por otro usuario.',
    },
    // Agrega más idiomas aquí
};

export default errorTranslations;
