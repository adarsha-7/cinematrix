import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const REC_API_BASE_URL = process.env.REC_API_BASE_URL;
const REC_API_KEY = process.env.REC_API_KEY;

export async function POST() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // get interaction from body, store it in db
    // modify and fetch N, if N >= 5

    const res = await fetch(`${REC_API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': REC_API_KEY || '',
        },
        body: JSON.stringify({
            userId: session?.user.id || '',
        }),
    });
    const data = await res.json();
    console.log(data);

    // store this data in the db

    return NextResponse.json({
        message: 'stored interaction successfully',
    });
}
