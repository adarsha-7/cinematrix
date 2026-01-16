import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: 'cinematrix/profile-images',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    },
                )
                .end(buffer);
        });

        return NextResponse.json({
            image_url: uploadResult.secure_url,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
