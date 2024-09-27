import { Model, DataTypes } from 'sequelize';

class Module extends Model {
    static associate(models) {
        this.belongsToMany(models.Route, { through: models.Route, foreignKey: 'module_id', otherKey: 'route_id' });
    }
}

const initializeModule = (sequelize) => {
    Module.init({
        module_id: {
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
    }, {
        sequelize,
        tableName: 'module',
        modelName: 'Module',
        timestamps: false,
    });

    return Module;
};

export default initializeModule;
