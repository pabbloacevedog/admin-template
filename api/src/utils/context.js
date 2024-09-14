import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js'; // Asegúrate de que JWT_SECRET esté correctamente exportado desde config.js
import throwCustomError, {
    ErrorTypes,
} from '../helpers/error-handler.helper.js';
// Función para verificar y obtener el usuario a partir del token JWT
const getUserToken = async (token, res) => {
    try {
        if (token) {
            return jwt.verify(token, JWT_SECRET);
        }
        return null;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Maneja el caso específico de TokenExpiredError
            console.error('Token expirado:', error);
            // Eliminar la cookie del token expirado
            if (res) {
                res.clearCookie('token'); // Asegúrate de que 'token' sea el nombre correcto de la cookie
            }
        } else {
            console.error('Error verificando el token:', error);
        }
        return null;
    }
};

// Función de contexto para Apollo Server
const context = async ({ req, res }) => {
    const operationName = req.body.operationName;
    console.log('req.body.operationName:', operationName);

    // Lista de operaciones que no requieren autenticación
    const publicOperations = ['PublicData', 'Register', 'Login', 'IntrospectionQuery', 'ForgotPassword','VerifyCode', 'ResetPassword'];

    // Permitir operaciones públicas sin verificar token
    if (publicOperations.includes(operationName)) {
        return { req, res };
    }

    // Asegúrate de que las cookies estén presentes
    const token = req.cookies ? req.cookies.token : null;

    // console.log('context-token:', token);

    // Si no hay token, lanzar error de autenticación
    if (!token) {
        throwCustomError(ErrorTypes.UNAUTHENTICATED); // Lanzar error personalizado
    }

    // Verificar el token y obtener usuario
    try {
        const user = await getUserToken(token, res); // Función que valida el token y obtiene el usuario

        if (!user) {
            throwCustomError(ErrorTypes.UNAUTHENTICATED); // Si el usuario no existe, lanzar error
        }

        // console.log('context-user:', user);

        // Retornar el contexto con el usuario si todo está bien
        return { user, req, res };

    } catch (error) {
        // Manejar cualquier error durante la verificación del token o la búsqueda del usuario
        console.error('Error en el contexto de autenticación:', error);
        throwCustomError(ErrorTypes.UNAUTHENTICATED); // Manejo de error general
    }
};

export default context;
