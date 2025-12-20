
'use client';

import { useState } from 'react';
import VideoUpload from '@/components/stories/VideoUpload';
import { useRouter } from 'next/navigation';

export default function NewStoryPage() {
    const router = useRouter();
    const [videoUrl, setVideoUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!videoUrl) {
            alert('Please upload a video first');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/stories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoUrl,
                    caption,
                }),
            });

            if (res.ok) {
                router.push('/stories');
            } else {
                const data = await res.json();
                alert('Failed to post story: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error posting story:', error);
            alert('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4 transition-colors duration-300">
            <div className="max-w-md mx-auto pt-20">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-foreground/40 hover:text-primary transition-colors font-black uppercase tracking-widest text-[10px]"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">New Story</h1>
                    <div className="w-8"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Video (9:16 vertical)
                        </label>
                        <VideoUpload
                            value={videoUrl}
                            onChange={setVideoUrl}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-2 ml-2">
                            Caption
                        </label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="WHAT'S HAPPENING IN THE ECOSYSTEM?"
                            className="w-full bg-surface border-2 border-surface-border rounded-2xl p-4 text-foreground placeholder:text-foreground/5 focus:outline-none focus:border-primary min-h-[120px] font-black uppercase tracking-tight transition-all"
                            maxLength={150}
                        />
                        <div className="text-right text-[8px] font-black text-foreground/20 mt-2 uppercase tracking-widest">
                            {caption.length} / 150
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !videoUrl}
                        className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed omni-glow"
                    >
                        {submitting ? 'TRANSMITTING...' : 'INITIALIZE BROADCAST'}
                    </button>
                </form>
            </div>
        </div>
    );
}
