// src/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import models from '../models/index.js';
import { sendEmail } from '../utils/emailService.js';
import { JWT_EXPIRES, JWT_SECRET, RESET_PASSWORD_URL } from '../config/config.js';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';
// Get un user por email
export async function getUser(email) {
    return await models.User.findOne({ where: { email } });
}

// Generar token JWT
export async function generateToken(user) {
    const datosUser = user.get();
    return jwt.sign(datosUser, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// Get las actions (permisos) de un rol
export async function getActions(roleId) {
    const role = await models.Role.findByPk(roleId, {
        include: {
            model: models.Action,
            through: { attributes: [] },
        }
    });
    if (!role || !role.Actions) {
        throwCustomError(ErrorTypes.NO_ACTIONS_FOR_ROLE);
    }
    return role.Actions.map(action => action.name);
}

// Función para iniciar sesión
export async function login(email, password, res) {
    const user = await getUser(email);
    if (!user) {
        throwCustomError(ErrorTypes.BAD_USER_INPUT);
    }
    // console.log('password recibida ', password)
    // console.log('password bd ', user.password)
    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log('passwordMatch', passwordMatch);
    if (!passwordMatch) {
        throwCustomError(ErrorTypes.BAD_USER_PASSWORD);
    }

    const actions = await getActions(user.role_id);

    const token = await generateToken(user);
    console.log('res-login', res.cookie)
    // Solo configura la cookie si el objeto 'res' está presente
    if (res && res.cookie) {
        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
        });
    }
    return { token, email: user.email, actions };

}

// Función para registrar un new user
export async function signup(email, password) {
    const user = await getUser(email);

    if (user) {
        throwCustomError(ErrorTypes.ALREADY_EXISTS);
    }

    // const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await models.User.create({
        email,
        password,
        role_id: 1,
    });

    return { email: newUser.email, message: "Usuario creado con éxito." };

}
//Funcion para recuperar password
export async function forgotPassword(email) {
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
        throwCustomError(ErrorTypes.BAD_USER_INPUT);
    }

    const verification_code = crypto.randomBytes(32).toString('hex');
    const verification_expires = new Date(Date.now() + 3600000); // 1 hora para expirar

    user.verification_code = verification_code;
    user.verification_expires = verification_expires;

    await user.save();

    const resetLink = RESET_PASSWORD_URL + `${verification_code}`;

    await sendEmail(email, 'Restablecimiento de Contraseña', `Por favor, usa el siguiente enlace para restablecer tu contraseña: ${resetLink}`);

    return { message: 'Password reset link sent to your email.' };
}
export async function resetPassword(verification_code, newPassword) {
    const user = await models.User.findOne({
        where: {
            verification_code,
            verification_expires: {
                [Op.gt]: new Date(),
            },
        },
    });

    if (!user) {
        throwCustomError(ErrorTypes.INVALID_RESET_TOKEN);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.verification_code = null;
    user.verification_expires = null;

    await user.save();

    return { message: 'Password has been reset successfully' };
}
export async function getUserById(userId) {
    try {
        const user = await models.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}
export async function updateUser(userId, updateData) {
    try {
        const user = await models.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await user.update(updateData);
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}
