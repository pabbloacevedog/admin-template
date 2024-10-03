import { Model, DataTypes } from 'sequelize';

class Role extends Model {
    static associate(models) {
        // this.belongsToMany(models.Action, { through: models.RoleAction, foreignKey: 'role_id', otherKey: 'action_id' });
        // this.belongsToMany(models.Route, { through: models.RoleRoute, foreignKey: 'role_id', otherKey: 'route_id' });
        this.hasMany(models.User, { foreignKey: 'role_id'});
        this.hasMany(models.Permission, { foreignKey: 'role_id' });
    }
}

const initializeRole = (sequelize) => {
    Role.init({
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        tableName: 'role',
        modelName: 'Role',
        timestamps: true,
    });

    return Role;
};

export default initializeRole;
