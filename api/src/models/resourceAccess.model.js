import { Model, DataTypes } from 'sequelize';

class ResourceAccess extends Model {
    static associate(models) {
        // Definir asociaciones, si es necesario
        // Relación con el modelo User
        this.belongsTo(models.User, { foreignKey: 'user_id' });

        // Relación con el modelo Role
        this.belongsTo(models.Role, { foreignKey: 'role_id' });

        // Relación con el modelo Action
        this.belongsTo(models.Action, { foreignKey: 'action_id' });
    }
}

const initializeResourceAccess = (sequelize) => {
    ResourceAccess.init({
        access_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        resource_type: {
            type: DataTypes.STRING,
            allowNull: false,  // Tipo de recurso (ej: 'service', 'document')
        },
        resource_id: {
            type: DataTypes.INTEGER,
            allowNull: false  // ID específico del recurso
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,  // Puede ser null si solo está vinculado a un rol
            references: {
                model: 'user', // Nombre de la tabla de usuarios
                key: 'user_id',
            }
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: true,  // Puede ser null si solo está vinculado a un usuario
            references: {
                model: 'role', // Nombre de la tabla de roles
                key: 'role_id',
            }
        },
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: false,  // El tipo de acción permitida (ver, editar, etc.)
            references: {
                model: 'action', // Nombre de la tabla de acciones
                key: 'action_id',
            }
        },
    }, {
        sequelize,
        tableName: 'resource_access',
        modelName: 'ResourceAccess',
        timestamps: false,
    });

    return ResourceAccess;
};

export default initializeResourceAccess;
