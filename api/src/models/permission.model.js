import { Model, DataTypes } from 'sequelize';

class Permission extends Model {
    static associate(models) {
        this.belongsTo(models.Role, { foreignKey: 'role_id' });
        this.belongsTo(models.Route, { foreignKey: 'route_id' });
        this.belongsTo(models.Action, { foreignKey: 'action_id' });
        this.belongsTo(models.Condition, { foreignKey: 'condition_id' }); // Relación con las condiciones
        this.hasMany(models.ResourceAccess, { foreignKey: 'permission_id' }); // Relación con los accesos a recursos
    }
}

const initializePermission = (sequelize) => {
    Permission.init({
        permission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'role', // Nombre de la tabla de roles
                key: 'role_id',
            }
        },
        route_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        condition_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'permission',
        modelName: 'Permission',
        timestamps: true, // Si no quieres tener createdAt o updatedAt
    });

    return Permission;
};

export default initializePermission;

