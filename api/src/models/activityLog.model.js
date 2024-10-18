import { Model, DataTypes } from 'sequelize';

class ActivityLog extends Model {
    static associate(models) {
        // Relación con el modelo User
        this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
}

const initializeActivityLog = (sequelize) => {
    ActivityLog.init({
        activity_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,  // Tipo de recurso (ej: 'service', 'document')
        },
        resource: {
            type: DataTypes.STRING,
            allowNull: false  // ID específico del recurso
        },
        timestamp: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        data_before: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        data_current: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,  // Puede ser null si solo está vinculado a un rol
            references: {
                model: 'user', // Nombre de la tabla de usuarios
                key: 'user_id',
            }
        },
    }, {
        sequelize,
        tableName: 'activity_log',
        modelName: 'ActivityLog',
        timestamps: false,
    });

    return ActivityLog;
};

export default initializeActivityLog;
