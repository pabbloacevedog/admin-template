import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS } from '../config/config.js';

// Configurar el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // O el servicio que estés utilizando
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a: ${to}`);
    } catch (error) {
        console.error(`Error al enviar correo a ${to}:`, error);
    }
}
