import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS } from '../config/config.js';

// Configurar el transporte de nodemailer
// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com', // O el servicio que estés utilizando
//     port: 587, // O el servicio que estés utilizando
//     secure: false, // O el servicio que estés utilizando
//     auth: {
//         user: EMAIL_USER,
//         pass: EMAIL_PASS,
//     },
// });
let testAccount = await nodemailer.createTestAccount();
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
    },
});
let i
export async function sendEmail(obj) {
    const { to, subject, text } = obj
    console.log(to,'to')
    console.log(subject,'subject')
    console.log(text,'text')
    const mailOptions = {
        // from: EMAIL_USER,
        form: testAccount.user,
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
