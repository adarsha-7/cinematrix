'use client';

import { Suspense } from 'react';
import VerifyEmailContent from './Content';

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}
