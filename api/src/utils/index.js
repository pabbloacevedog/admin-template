import bcrypt from 'bcryptjs';
// import CryptoJS from 'crypto-js';
import { SALT_ROUNDS, PASSPHRASE } from '../config/config.js';
// import jwt from 'jsonwebtoken';
// import models from '../models';
// const findUser = async (authToken) => {
//     // Find a user by their auth token
//     console.log('findUser', authToken)
//     return { id: 1, name: 'Test User' };
// };
// const tokenIsNotValid = (connectionParams) => {
//     // Check if the token is valid
//     console.log('tokenIsNotValid', connectionParams)
//     return false;
// };
// const encrypt = (text) => CryptoJS.AES.encrypt(text, PASSPHRASE).toString();

// const decrypt = (ciphertext) => {
//     const bytes = CryptoJS.AES.decrypt(ciphertext, PASSPHRASE);
//     return bytes.toString(CryptoJS.enc.Utf8);
// };

// // Función para desencriptar la contraseña (actualizada para usar la función decrypt)
// async function desencriptarPassword(passwordEncriptada) {
//     return decrypt(passwordEncriptada);
// }

// Utilidad para crear hash de contraseña
export async function hashPassword(password) {
	console.log('SALT_ROUNDS', SALT_ROUNDS)
    return await bcrypt.hash(password, SALT_ROUNDS);
}
// export const getDynamicContext = async (req) => {
//     const token = req.headers.authorization || '';
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await models.User.findByPk(decoded.user_id);
//         return { user };
//     } catch (error) {
//         // Manejar error o devolver un contexto sin usuario
//         throw new Error(`No autorizado`);
//     }
// };
// export function authorizeUser(roleIdAdmin, roleIdCustomer) {
//     return (parent, args, context, info) => {
//         const { user } = context;

//         // Verifica si el contexto contiene un usuario autenticado
//         if (!user) {
//             throw new Error('Acceso denegado: No autenticado');
//         }

//         // Verificar si el usuario es admin
//         if (user.role_id === roleIdAdmin) {
//             return; // El usuario es admin y puede proceder
//         }

//         // Verificar si el usuario es un cliente asociado con la compañía en cuestión
//         if (user.role_id === roleIdCustomer && user.company_id === args.company_id) {
//             return; // El usuario es un cliente asociado y puede proceder
//         }

//         // En cualquier otro caso, el acceso es denegado
//         throw new Error('Acceso denegado: No autorizado');
//     };
// }
// Set up ApolloServer.
// module.exports = {
//     // getDynamicContext,
//     // tokenIsNotValid,
//     // desencriptarPassword,
//     hashPassword,
//     // encrypt,
//     //decrypt,
//     // Cualquier otra función que desees exportar...
// };
