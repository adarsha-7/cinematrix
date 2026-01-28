'use client';

import { Suspense } from 'react';
import SearchContent from './Content';

export default function SearchPage() {
    return (
        <Suspense>
            <SearchContent />
        </Suspense>
    );
}
