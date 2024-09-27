import { Model, DataTypes } from 'sequelize';

class RoleRoute extends Model {
    static associate(models) {
        // Define associations here if needed
    }
}

const initializeRoleRoute = (sequelize) => {
    RoleRoute.init({
        role_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'role',
                key: 'role_id'
            }
        },
        route_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'route',
                key: 'route_id'
            }
        },
    }, {
        sequelize,
        tableName: 'role_route',
        modelName: 'RoleRoute',
        timestamps: false,
    });

    return RoleRoute;
};

export default initializeRoleRoute;

