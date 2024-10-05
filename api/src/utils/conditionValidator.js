import models from '../models/index.js';
import { QueryTypes } from 'sequelize';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';

// Función para validar condiciones
const validateConditions = async (userIdEditor, conditionId, resource, resourceId) => {
    // Obtener las condiciones asociadas al permiso
    console.log(userIdEditor, conditionId, resource);
    const condition = await models.Condition.findOne({
        where: { condition_id: conditionId },
    });
    console.log(`condition: ${condition}`);

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
const validateRule = async (userIdEditor, name, resource, resourceId) => {
    console.log('validateRule', name, resource);
    switch (name) {
        case 'owner_only':
            const isOwner = await isUserOwner(userIdEditor, resource, resourceId);
            return isOwner;

        case 'all':
            return true;

        case 'onwner_and_others_owners':
            const hasAccess = await hasUserOrRoleAccess(userIdEditor, resource, resourceId);
            return hasAccess;

        case 'role_based_access':
            const canViewOthers = await canViewResourcesByOtherRolesOrUsers(userIdEditor, resource, resourceId);
            return canViewOthers;

        default:
            throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);
    }
};

// Verifica si el usuario o rol tiene acceso al recurso
async function hasUserOrRoleAccess(userIdEditor, resource, resourceId) {
    // Primero, verifica si el usuario es el propietario del recurso
    const isOwner = await isUserOwner(userIdEditor, resource, resourceId);
    if (isOwner) return true;

    // Luego, verifica si el usuario o su rol tiene acceso adicional al recurso
    const userRoles = await models.UserRole.findAll({
        where: { user_id: userIdEditor },
        attributes: ['role_id']
    });

    const roleIds = userRoles.map(role => role.role_id);

    // Consulta para verificar si el usuario o su rol tienen acceso al recurso
    const result = await models.sequelize.query(
        `
        SELECT * FROM resource_access
        WHERE resource_id = :resourceId
        AND resource_type = :resource
        AND (user_id = :userIdEditor OR role_id IN (:roleIds))
        LIMIT 1
        `,
        {
            replacements: {
                resourceId: resourceId,
                resource: resource,
                userIdEditor: userIdEditor,
                roleIds: roleIds.length ? roleIds : [null] // Asegura que la consulta funcione incluso si no hay roles
            },
            type: QueryTypes.SELECT
        }
    );

    return result.length > 0; // Devuelve true si se encontró acceso adicional
}

// Verifica si el usuario o su rol tiene acceso para ver recursos creados por otros usuarios o roles
async function canViewResourcesByOtherRolesOrUsers(userIdEditor, resource, resourceId) {
    // Obtener los roles del usuario que intenta acceder
    const userRoles = await models.UserRole.findAll({
        where: { user_id: userIdEditor },
        attributes: ['role_id']
    });
    const roleIds = userRoles.map(role => role.role_id);

    // Verifica si el usuario o sus roles tienen acceso para ver recursos creados por otros roles o usuarios
    const result = await models.sequelize.query(
        `
        SELECT * FROM resource_access
        WHERE resource_id = :resourceId
        AND resource_type = :resource
        AND access_type = 'view'  -- Verificamos que el acceso sea para 'view'
        AND (user_id = :userIdEditor OR role_id IN (:roleIds))
        LIMIT 1
        `,
        {
            replacements: {
                resourceId: resourceId,
                resource: resource,
                userIdEditor: userIdEditor,
                roleIds: roleIds.length ? roleIds : [null] // Manejo de roles
            },
            type: QueryTypes.SELECT
        }
    );

    return result.length > 0; // Retorna true si tiene acceso a ver el recurso
}

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

export default validateConditions;
