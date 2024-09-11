import { Model, DataTypes } from 'sequelize';

class RoleAction extends Model {
    static associate(models) {
        // Define associations here if needed
    }
}

const initializeRoleAction = (sequelize) => {
    RoleAction.init({
        role_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        action_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'action',
                key: 'id'
            }
        },
    }, {
        sequelize,
        tableName: 'role_action',
        modelName: 'RoleAction',
        timestamps: false,
    });

    return RoleAction;
};

export default initializeRoleAction;

