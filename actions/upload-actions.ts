'use server';

import cloudinary from '@/lib/cloudinary';

export async function uploadFile(formData: FormData, folder: string) {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file provided');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ publicId: string; secureUrl: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto', // Automatically detect image or raw (pdf, etc.)
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(new Error('Upload failed'));
                } else {
                    resolve({
                        publicId: result!.public_id,
                        secureUrl: result!.secure_url,
                    });
                }
            }
        ).end(buffer);
    });
}

export async function deleteFile(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Delete failed');
    }
}
