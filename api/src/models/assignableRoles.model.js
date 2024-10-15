import { Model, DataTypes } from 'sequelize';

class AssignableRoles extends Model {
    static associate(models) {
        this.belongsTo(models.Role, { foreignKey: 'assigned_role_id' });
    }
}

const initializeAssignableRoles = (sequelize) => {
    AssignableRoles.init({
        assignable_role_id: {
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
        assigned_role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'role', // Nombre de la tabla de roles
                key: 'role_id',
            }
        },
    }, {
        sequelize,
        tableName: 'AssignableRoles',
        modelName: 'AssignableRoles',
        timestamps: true, // Si no quieres tener createdAt o updatedAt
    });

    return AssignableRoles;
};

export default initializeAssignableRoles;

