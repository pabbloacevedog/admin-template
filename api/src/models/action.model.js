import { Model, DataTypes } from 'sequelize';

class Action extends Model {
    static associate(models) {
        // this.belongsToMany(models.Role, { through: models.RoleAction, foreignKey: 'action_id' });
    }
}

const initializeAction = (sequelize) => {
    Action.init({
        action_id: {
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
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        tableName: '`action`',  // Escapar el nombre de la tabla
        modelName: 'Action',
        timestamps: false,
    });

    return Action;
};

export default initializeAction;
