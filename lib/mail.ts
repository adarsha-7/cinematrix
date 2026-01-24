import { MailtrapClient } from 'mailtrap';
import 'dotenv/config';
import { availableMemory } from 'process';

const TOKEN = process.env.MAILTRAP_API_KEY as string;

const client = new MailtrapClient({
    token: TOKEN,
});

const sender = {
    email: 'cinematrix@adarshaghimire.com.np',
    name: 'Cinematrix',
};

export async function sendMail(recipients: { email: string }[], subject: string, text: string) {
    client
        .send({
            from: sender,
            to: recipients,
            subject,
            text,
        })
        .then(() => console.log('Email send successfully.'))
        .catch((err) => console.error('Error sending email', err));
}
