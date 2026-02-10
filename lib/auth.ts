import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { emailOTP } from 'better-auth/plugins';
import { sendMail } from '@/lib/mail';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: 'select_account consent',
            accessType: 'offline',
        },
    },

    plugins: [
        emailOTP({
            sendVerificationOnSignUp: true,
            overrideDefaultEmailVerification: true,

            async sendVerificationOTP({ email, otp, type }) {
                if (type === 'email-verification') {
                    await sendMail(
                        [{ email }],
                        'E-mail Verification for Cinematrix',
                        `Please use this OTP to verify your account for Cinematrix: ${otp}`,
                    );
                }
            },
        }),
    ],
});
