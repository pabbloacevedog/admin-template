import { Model, DataTypes } from 'sequelize';
import { hashPassword } from '../utils/index.js';

class User extends Model {
    static associate(models) {
        this.belongsTo(models.Role, { foreignKey: 'role_id'});
    }
}

const initializeUser = (sequelize) => {
    User.init({
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING(1000) // Considerar encriptación y longitud adecuada
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        // rut_user: {
        //     type: DataTypes.STRING(20)
        // },
        name: {
            type: DataTypes.STRING(1000)
        },
        username: {
            type: DataTypes.STRING(255),
            unique: true,
            llowNull: true,
            validate: {
                is: /^[a-zA-Z0-9_]+$/, // Solo letras, números y guiones bajos
            }
        },
        personal_phone: {
            type: DataTypes.STRING(20)
        },
        // En el modelo User
        verification_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verification_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verification_email_expires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verification_code_expiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        verified: {
            type: DataTypes.BOOLEAN
        },
        avatar: {
            type: DataTypes.STRING(255)
        },
        state: {
            type: DataTypes.BOOLEAN
        },
        role_id: {
            type: DataTypes.INTEGER
        },
    }, {
        timestamps: true,
        tableName: 'user',
        modelName: 'User',
        hooks: {
            // Hook para hashear la contraseña antes de guardar
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await hashPassword(user.password);
                }
            },
            // Hook para hashear la contraseña solo si ha cambiado
            beforeUpdate: async (user, options) => {
                // Verificar si la contraseña ha cambiado
                if (user.password !== user.previous('password')) {
                    if (user.password) {
                        user.password = await hashPassword(user.password);
                    }
                }
            },
        },
        sequelize,
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            // Otros índices según sea necesario
        ]
    });

    return User;
};

export default initializeUser;
