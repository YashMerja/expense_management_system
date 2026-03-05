'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { uploadFile } from '@/actions/upload-actions';

interface FileUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: (url: string) => void;
    folder?: string;
}

export const FileUpload = ({
    value,
    onChange,
    onRemove,
    folder = 'uploads',
}: FileUploadProps) => {
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                toast.error('File too large (max 5MB)');
                return;
            }

            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('file', file);

                // Call server action
                const result = await uploadFile(formData, folder);

                onChange(result.secureUrl);
                toast.success('File uploaded successfully');
            } catch (error) {
                console.error('Upload failed:', error);
                toast.error('Upload failed');
            } finally {
                setLoading(false);
            }
        },
        [onChange, folder]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
    });

    if (value) {
        const isPdf = value.endsWith('.pdf');

        return (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-card group">
                <div className="absolute top-2 right-2 z-10 transition-opacity">
                    <button
                        onClick={() => onRemove(value)}
                        className="p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {isPdf ? (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-muted/30">
                        <File className="w-16 h-16 text-primary mb-2" />
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors">
                            View PDF
                        </a>
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                        <Image
                            src={value}
                            alt="Upload"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                'w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors px-4 text-center',
                isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-muted-foreground/25 hover:border-primary hover:bg-accent/50'
            )}
        >
            <input {...getInputProps()} />
            {loading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <UploadCloud className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">
                        Drag & drop or click to upload
                    </p>
                    <p className="text-xs">
                        JPG, PNG, PDF (max 5MB)
                    </p>
                </div>
            )}
        </div>
    );
};
