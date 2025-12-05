import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
    const aboutText =
        'Cinematrix is a web based movie catalogue where users can browse, maintain watchlists and rate movies and the app provides personalized movie recommendations to the user based on their ratings and activities.';
    return NextResponse.json({
        aboutText,
    });
}
