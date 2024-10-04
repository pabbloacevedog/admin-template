import models from '../models/index.js';
import { QueryTypes } from 'sequelize';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';

// Función para validar condiciones
const validateConditions = async (userIdEditor, conditionId, resource, resourceId) => {
    // Obtener las condiciones asociadas al permiso
    console.log(userIdEditor, conditionId, resource)
    const condition = await models.Condition.findOne({
        where: { condition_id: conditionId },
    });
    console.log(`condition: ${condition}`)
    if (!condition) {
        return true; // Si no hay condiciones, se permite el acceso por defecto
    }



    // Validar según la regla predefinida
    const isValid = await validateRule(userIdEditor, condition.name, resource, resourceId);
    if (!isValid) {
        return false; // La condición no se cumple
    }


    return true; // Todas las condiciones se cumplen
};

// Función para validar según la regla
const validateRule = async (userIdEditor, name,  resource, resourceId) => {
    console.log('validateRule', name, resource);
    switch (name) {
        case 'owner_only':
            const isOwner = await isUserOwner(userIdEditor,resource, resourceId);
            return isOwner;

        case 'all':
            return true;
        // Agrega más reglas predefinidas según sea necesario

        default:
            throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);
    }
};

// Verifica si el usuario es el propietario del recurso
async function isUserOwner(userIdEditor, resource, resourceId) {
    let result = false;

    if (resource === 'user') {
        // Para el recurso 'user', el userId debe coincidir con el resourceId
        result = await models.sequelize.query(
            'SELECT * FROM user WHERE user_id = :resourceId AND user_id = :userIdEditor LIMIT 1', // Verificamos que el usuario que edita es el mismo que se está editando
            {
                replacements: { userIdEditor: userIdEditor, resourceId: resourceId },
                type: QueryTypes.SELECT
            }
        );
    } else {
        // Para otros recursos, el owner_id debe coincidir con el userId
        result = await models.sequelize.query(
            'SELECT * FROM ' + resource + ' WHERE owner_id = :userIdEditor AND ' + resource + '_id = :resourceId LIMIT 1', // Verificamos que el usuario que edita es el propietario del recurso
            {
                replacements: { userIdEditor: userIdEditor, resourceId: resourceId },
                type: QueryTypes.SELECT
            }
        );
    }

    console.log(result, 'result');
    return result.length > 0; // Devuelve true si el recurso pertenece al usuario o es el mismo usuario editado
}

// // Verifica si el usuario es mayor de edad
// async function isUserOfLegalAge(userId) {
//     const user = await models.User.findOne({ where: { user_id: userId } });
//     const age = user ? calculateAge(user.birthdate) : null; // Asegúrate de tener el campo birthdate en tu modelo User
//     return age >= 18; // Considera mayor de edad a 18 años o más
// }

// // Función auxiliar para calcular la edad
// function calculateAge(birthdate) {
//     const today = new Date();
//     const birthDate = new Date(birthdate);
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDifference = today.getMonth() - birthDate.getMonth();
//     if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//     }
//     return age;
// }

export default validateConditions;
