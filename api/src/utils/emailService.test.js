// src/utils/emailService.test.js
import nodemailer from 'nodemailer';
import { sendEmail } from './emailService.js';

jest.mock('nodemailer');

describe('sendEmail', () => {
    let mockSendMail;

    beforeAll(() => {
        mockSendMail = jest.fn();
        nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
    });

    it('should send an email with the correct parameters', async () => {
        const to = 'test@example.com';
        const subject = 'Test Email';
        const text = 'This is a test email.';

        await sendEmail(to, subject, text);

        expect(mockSendMail).toHaveBeenCalledWith({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
    });

    it('should log an error if email sending fails', async () => {
        const to = 'test@example.com';
        const subject = 'Test Subject';
        const text = 'This is a test email';

        // Mocking a rejected promise to simulate an error
        mockSendMail.mockRejectedValueOnce(new Error('Failed to send email'));

        console.error = jest.fn(); // Mock console.error to check error logs

        await sendEmail(to, subject, text);

        expect(console.error).toHaveBeenCalledWith(
            `Error al enviar correo a ${to}:`,
            expect.any(Error)
        );
    });
});
