import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js'; // Asegúrate de que JWT_SECRET esté correctamente exportado desde config.js
import throwCustomError, {
    ErrorTypes,
} from '../helpers/error-handler.helper.js';
// Función para verificar y obtener el usuario a partir del token JWT
const getUserToken = async (token) => {
    try {
        if (token) {
            // Pasa el token y la clave secreta a jwt.verify
            return jwt.verify(token, JWT_SECRET);
        }
        return null;
    } catch (error) {
        // Aquí podrías manejar o registrar el error específico
        console.error('Error verificando el token:', error);
        return null;
    }
};

// Función de contexto para Apollo Server
const context = async ({ req, res }) => {
    console.log('req.body.operationName',req.body.operationName);
    // Permitir operaciones públicas sin autenticación
    const publicOperations = ['PublicData', 'Signup', 'Login', 'IntrospectionQuery'];
    if (publicOperations.includes(req.body.operationName)) {
        return {req, res};
    }
    console.log("req.cookies",req.cookies);
    const token = req.cookies ? req.cookies.token : null;
    console.log("context-token",token);
    // Verificar si el token está presente
    if (!token) {
        throwCustomError(ErrorTypes.INVALID_TOKEN);
    }

    // Intentar recuperar un usuario con el token
    const user = await getUserToken(token);

    if (!user) {
        throwCustomError(ErrorTypes.UNAUTHENTICATED);
    }
    console.log("context-user",user);
    // Añadir el usuario al contexto
    return { user, req, res };
};

export default context;
