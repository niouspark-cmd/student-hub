'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';

interface EditableContentProps {
    id: string;
    defaultContent: React.ReactNode;
    className?: string;
    role?: 'admin' | 'superadmin';
    type?: 'text' | 'rich';
}

export default function EditableContent({
    id,
    defaultContent,
    className = "",
    role = 'admin',
    type = 'text'
}: EditableContentProps) {
    const { contentOverrides, ghostEditMode, superAccess, refreshConfig } = useAdmin();
    const [isSaving, setIsSaving] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // 1. Resolve Active Content
    const override = contentOverrides[id];
    const displayContent = override !== undefined ? override : defaultContent;

    // 2. Editing Permission
    const canEdit = superAccess && ghostEditMode;

    const handleSave = async () => {
        if (!contentRef.current) return;

        const newContent = contentRef.current.innerHTML;

        // Don't save if no change (optimization could happen here, but keeping it simple)
        if (newContent === override) return;

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, content: newContent })
            });

            if (res.ok) {
                // Success visual (maybe flash green?)
                await refreshConfig();
            } else {
                alert("Failed to save edit");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBlur = () => {
        handleSave();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Simple save on Enter? Maybe risky for rich text.
            // For now, allow Enter to prevent chaos, strictly save on Blur is safer.
            // But user wants "Tap... change them".
            // We'll stick to Blur for saving.
        }
    };

    // 3. Render
    // If we have an override (string), we MUST use dangerouslySetInnerHTML to show it.
    // If it's defaultContent (ReactNode), we render children.
    // BUT if we edit, we edit the HTML string.

    // Strategy: Always render a wrapper.
    // If editing, it's contentEditable.
    // Content is derived.

    const isStringContent = typeof displayContent === 'string';

    if (isStringContent) {
        return (
            <div
                ref={contentRef}
                contentEditable={canEdit}
                onBlur={canEdit ? handleBlur : undefined}
                suppressContentEditableWarning={true}
                className={`
                    ${className} 
                    transition-all duration-200 outline-none
                    ${canEdit ? 'cursor-text hover:bg-[#39FF14]/10 hover:outline-dashed hover:outline-2 hover:outline-[#39FF14]/50 rounded-lg p-1 -m-1' : ''}
                    ${isSaving ? 'opacity-50 animate-pulse' : ''}
                `}
                dangerouslySetInnerHTML={{ __html: displayContent as string }}
            />
        );
    }

    return (
        <div
            ref={contentRef}
            contentEditable={canEdit}
            onBlur={canEdit ? handleBlur : undefined}
            suppressContentEditableWarning={true}
            className={`
                ${className} 
                transition-all duration-200 outline-none
                ${canEdit ? 'cursor-text hover:bg-[#39FF14]/10 hover:outline-dashed hover:outline-2 hover:outline-[#39FF14]/50 rounded-lg p-1 -m-1' : ''}
                ${isSaving ? 'opacity-50 animate-pulse' : ''}
            `}
        >
            {displayContent}
        </div>
    );
}
