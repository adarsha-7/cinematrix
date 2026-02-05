import { MailtrapClient } from 'mailtrap';

const sender = {
    email: 'cinematrix@adarshaghimire.com.np',
    name: 'Cinematrix',
};

export async function sendMail(recipients: { email: string }[], subject: string, text: string) {
    try {
        const client = new MailtrapClient({
            token: process.env.MAILTRAP_API_KEY as string,
        });

        await client.send({
            from: sender,
            to: recipients,
            subject,
            text,
        });

        console.log('Email sent successfully');
    } catch (err) {
        console.error('Error sending email', err);
        throw err;
    }
}
