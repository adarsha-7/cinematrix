export async function uploadImage(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);

    if (type == 'profile') {
        const res = await fetch('/api/upload/profile-image', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Image upload failed');
        }

        const data = await res.json();
        return data.image_url;
    }
    return null;
}
