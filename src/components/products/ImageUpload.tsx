// src/components/products/ImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { useModal } from '@/context/ModalContext';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modal = useModal();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.url) {
                onChange(data.url);
            } else {
                console.error('Upload failed:', data.error);
                modal.alert('The storage nexus rejected the transmission.', 'Upload Error', 'error');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            modal.alert('A network disturbance prevented the image upload.', 'Link Error', 'error');
        } finally {
            setUploading(false);
            // Reset input so the same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
            />
            {value ? (
                <div className="relative">
                    <img
                        src={value}
                        alt="Product"
                        className="w-full h-48 object-cover rounded-lg border-2 border-white/20"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Change Image
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-48 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 transition-all disabled:opacity-50"
                >
                    <div className="text-5xl">📸</div>
                    <div className="text-white font-semibold">
                        {uploading ? 'Uploading...' : 'Upload Product Image'}
                    </div>
                    <div className="text-sm text-purple-300">
                        Click to browse from your device
                    </div>
                </button>
            )}
        </div>
    );
}
