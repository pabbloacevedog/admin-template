import { Model, DataTypes } from 'sequelize';

class Condition extends Model {
    static associate(models) {
        this.belongsTo(models.Permission, { foreignKey: 'permission_id' });
    }
}

const initializeCondition = (sequelize) => {
    Condition.init({
        condition_id: {
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
    }, {
        sequelize,
        tableName: 'condition',
        modelName: 'Condition',
        timestamps: true,
    });

    return Condition;
};

export default initializeCondition;
