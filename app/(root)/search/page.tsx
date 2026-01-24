'use client';

import { Suspense } from 'react';
import SearchContent from '@/app/components/SearchContext';

export default function SearchPage() {
    return (
        <Suspense>
            <SearchContent />
        </Suspense>
    );
}
