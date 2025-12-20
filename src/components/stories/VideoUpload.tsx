// src/components/stories/VideoUpload.tsx
'use client';

import { useState, useRef } from 'react';

interface VideoUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onDurationChange?: (duration: number) => void;
}

export default function VideoUpload({ value, onChange, onDurationChange }: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Note: Simple fetch doesn't support progress events easily without XMLHttpRequest
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 50 * 1024 * 1024) { // 50MB
            alert('File too large (max 50MB)');
            return;
        }

        setUploading(true);
        // Simulate progress for UX
        const interval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 500);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'video'); // Tell backend it's a video

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.url) {
                onChange(data.url);
                setUploadProgress(100);
                if (onDurationChange && data.duration) {
                    onDurationChange(data.duration);
                }
            } else {
                console.error('Upload failed:', data.error);
                alert('Failed to upload video: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Error uploading video');
        } finally {
            clearInterval(interval);
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="video/mp4,video/mov,video/avi,video/webm"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
            />
            {value ? (
                <div className="relative">
                    <video
                        src={value}
                        controls
                        className="w-full h-96 object-cover rounded-lg border-2 border-white/20"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Change Video
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
                <div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full h-96 border-2 border-dashed border-surface-border rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all disabled:opacity-50 bg-surface/50 group"
                    >
                        <div className="text-6xl group-hover:scale-110 transition-transform">🎥</div>
                        <div className="text-foreground font-black uppercase tracking-tighter text-2xl">
                            {uploading ? `Uplink Active: ${uploadProgress}%` : 'Upload Story Video'}
                        </div>
                        <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em] max-w-xs text-center leading-loose">
                            Vertical Format (9:16) • Max 50MB
                        </div>
                    </button>

                    {uploading && (
                        <div className="mt-8">
                            <div className="w-full bg-surface border border-surface-border rounded-full h-3 overflow-hidden p-0.5">
                                <div
                                    className="bg-primary h-full rounded-full transition-all duration-300 omni-glow"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
