import { Model, DataTypes } from 'sequelize';

class Route extends Model {
    static associate(models) {
        // this.belongsToMany(models.Role, { through: models.RoleRoute, foreignKey: 'route_id' });
        this.belongsTo(models.Module, { foreignKey: 'module_id' });
    }
}

const initializeRoute = (sequelize) => {
    Route.init({
        route_id: {
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
        path: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resource: {
            type: DataTypes.STRING,
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        },
        public: {
            type: DataTypes.BOOLEAN
        },
        obligatory: {
            type: DataTypes.BOOLEAN
        },
        module_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'route',
        modelName: 'Route',
        timestamps: false,
    });

    return Route;
};

export default initializeRoute;
