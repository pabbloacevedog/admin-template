import models from '../models/index.js';
import { QueryTypes } from 'sequelize';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';

// Función para validar condiciones
const validateConditions = async (userIdEditor, permission, resource, resourceId) => {
    // Obtener las condiciones asociadas al permiso
    console.log(userIdEditor, permission, resource);
    const condition = await models.Condition.findOne({
        where: { condition_id: permission.condition_id },
    });
    console.log(`condition: ${condition}`);

    if (!condition) {
        return true; // Si no hay condiciones, se permite el acceso por defecto
    }

    // Validar según la regla predefinida
    const isValid = await validateRule(userIdEditor, condition.name, resource, resourceId, permission);
    if (!isValid) {
        return false; // La condición no se cumple
    }

    return true; // Todas las condiciones se cumplen
};

// Función para validar según la regla
const validateRule = async (userIdEditor, name, resource, resourceId, permission) => {
    console.log('validateRule, condicion ' + name + ' resource ' + resource + ' resourseId ' + resourceId + ' Editor ' + userIdEditor);
    switch (name) {
        case 'owner_only':
            const isOwner = await isUserOwner(userIdEditor, resource, resourceId);
            return isOwner;

        case 'all':
            return true;

        case 'others':
            const hasAccess = await hasUserOrRoleAccess(userIdEditor, permission);
            return hasAccess;

        case 'resource':
            const hasAccessResource = await hasResourceAccess(userIdEditor, resourceId);
            return hasAccessResource;
        default:
            throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);
    }
};
// Verifica si el usuario o rol tiene acceso al recurso
async function hasUserOrRoleAccess(userIdEditor, permission) {
    // Consulta todos los roles y usuarios que tienen acceso al recurso con el permiso dado
    const userRoles = await models.sequelize.query(
        `
        select ra.role_id, ra.user_id from resource_access ra
        inner join permission pe on pe.permission_id = ra.permission_id
        where pe.permission_id = :permissionId and pe.condition_id = '3'
        `,
        {
            replacements: {
                permissionId: permission.permission_id,
            },
            type: QueryTypes.SELECT
        }
    );

    // Extrae todos los role_id y user_id
    const roleIds = userRoles.map(ur => ur.role_id).filter(role_id => role_id !== null);
    const userIds = userRoles.map(ur => ur.user_id).filter(user_id => user_id !== null);

    console.log('roleIds', roleIds);
    console.log('userIds', userIds);

    // Realiza la segunda consulta con los role_id y user_id
    const result = await models.sequelize.query(
        `
        select ra.* from resource_access ra
        inner join permission pe on pe.permission_id = ra.permission_id
        inner join user us on pe.role_id = us.role_id
        where us.user_id = :userIdEditor
        and ( ra.role_id IN (:roleIds) or ra.user_id IN (:userIds) )
        `,
        {
            replacements: {
                userIdEditor: userIdEditor,
                roleIds: roleIds.length ? roleIds : [null], // Si no hay role_ids, usar [null] para evitar error
                userIds: userIds.length ? userIds : [null], // Si no hay user_ids, usar [null]
            },
            type: QueryTypes.SELECT
        }
    );

    return result.length > 0; // Devuelve true si se encontró acceso adicional
}

// Verifica si el usuario o rol tiene acceso al recurso
// Verifica si el usuario tiene acceso al recurso
async function hasResourceAccess(userIdEditor, resourceId) {
    if (resourceId) {
        const result = await models.sequelize.query(
            `
                select ra.resource_id from resource_access ra
                inner join permission pe on pe.permission_id = ra.permission_id
                inner join user us on pe.role_id = us.role_id
                where us.user_id = :userIdEditor and ra.resource_id = :resourceId
            `,
            {
                replacements: {
                    resourceId: resourceId,
                    userIdEditor: userIdEditor
                },
                type: QueryTypes.SELECT
            }
        );
        return result.length > 0; // Devuelve true si se encontró acceso adicional
    }
}
// Verifica si el usuario es el propietario del recurso
async function isUserOwner(userIdEditor, resource, resourceId) {
    let result = false;

    if (resource === 'user') {
        // Para el recurso 'user', el userId debe coincidir con el resourceId
        result = await models.sequelize.query(
            'SELECT * FROM user WHERE user_id = :resourceId AND owner_id = :userIdEditor LIMIT 1', // Verificamos que el usuario que edita es el mismo que se está editando
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
