'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface DescriptionEditorProps {
    value: string;
    onChange: (content: string) => void;
    disabled?: boolean;
}

const ToolbarButton = ({
    isActive,
    onClick,
    children,
    disabled
}: {
    isActive?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
}) => (
    <button
        type="button"
        onMouseDown={(e) => {
            e.preventDefault(); // Prevent focus loss
            onClick();
        }}
        disabled={disabled}
        className={cn(
            "p-2 rounded-lg transition-colors text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800",
            isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);

export const DescriptionEditor = ({ value, onChange, disabled }: DescriptionEditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write a detailed description...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-zinc-400 before:float-left before:pointer-events-none',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editable: !disabled,
    });

    // Sync external value changes (optional, handled carefully to avoid loops)
    // For now, we assume uncontrolled mostly or initial value
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if Content is truly different (very basic check)
            // Ideally we check if focused. For now, trust Tiptap.
            // editor.commands.setContent(value); 
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className={cn(
            "bg-background border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all",
            disabled && "opacity-50"
        )}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-x-auto">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    disabled={disabled}
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    disabled={disabled}
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    disabled={disabled}
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    disabled={disabled}
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    disabled={disabled}
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    disabled={disabled}
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <div className="flex-1" />
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo() || disabled}>
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo() || disabled}>
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Area */}
            <EditorContent editor={editor} />
        </div>
    );
};
