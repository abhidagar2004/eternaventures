import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Image as ImageIcon, Link as LinkIcon, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <Bold size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <Italic size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('strike') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <Strikethrough size={16} />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <Heading1 size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <Heading2 size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <Heading3 size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <List size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <ListOrdered size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('blockquote') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <Quote size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button type="button" onClick={setLink} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('link') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <LinkIcon size={16} />
      </button>
      <button type="button" onClick={addImage} className="p-2 rounded hover:bg-gray-200 transition text-gray-700">
        <ImageIcon size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('codeBlock') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}>
        <Code size={16} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded hover:bg-gray-200 transition text-gray-700 disabled:opacity-50">
        <Undo size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded hover:bg-gray-200 transition text-gray-700 disabled:opacity-50">
        <Redo size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[300px]',
      },
    },
  });

  // Handle case where content changes from parent (e.g., initial load)
  React.useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
