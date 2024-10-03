import models from '../models/index.js';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';

// Función para validar condiciones
const validateConditions = async (userId, permissionId, resource) => {
    // Obtener las condiciones asociadas al permiso
    const conditions = await models.Condition.findAll({
        where: { permission_id: permissionId },
        include: [models.Rule] // Incluir la regla asociada
    });

    if (!conditions.length) {
        return true; // Si no hay condiciones, se permite el acceso por defecto
    }

    for (const condition of conditions) {
        const { Rule, value } = condition;

        // Validar según la regla predefinida
        const isValid = await validateRule(Rule.logic, userId, value, resource);
        if (!isValid) {
            return false; // La condición no se cumple
        }
    }

    return true; // Todas las condiciones se cumplen
};

// Función para validar según la regla
const validateRule = async (ruleLogic, userId, expectedValue, resource) => {
    switch (ruleLogic) {
        case 'owner_only':
            const isOwner = await isUserOwner(userId, resource);
            return isOwner === (expectedValue === 'true');

        case 'all':
            return true;
        // Agrega más reglas predefinidas según sea necesario

        default:
            throwCustomError(ErrorTypes.INVALID_RULE);
    }
};

// Verifica si el usuario es el propietario del recurso
async function isUserOwner(userId, resource) {
    const resource = await models.sequelize.query(
        ' SELECT * FROM :resource WHERE owner_id = :user_id LIMIT 1 ',
        {
            replacements: { user_id: userId, resource: resource },
            type: QueryTypes.SELECT
        }
    );
    return !!resource; // Devuelve true si el recurso pertenece al usuario
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
