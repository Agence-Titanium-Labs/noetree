"use client";

import { Editor } from "@tiptap/react";
import { Button } from "../ui/button";
import { Link as LinkIcon, Image as ImageIcon, Undo, Redo } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  HeadingToolbar,
  FormattingToolbar,
  ListsToolbar,
  SpecialToolbar,
} from "./ToolbarGroups";

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({
  editor,
}: Readonly<EditorToolbarProps>) {
  if (!editor) {
    return null;
  }

  const insertLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const insertImage = () => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap gap-1">
        {/* History group */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo (Ctrl+Z)"
          icon={<Undo className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo (Ctrl+Shift+Z)"
          icon={<Redo className="h-4 w-4" />}
        />

        <Separator orientation="vertical" className="h-auto!" />

        {/* Headings group */}
        <HeadingToolbar editor={editor} />

        <Separator orientation="vertical" className="h-auto!" />

        {/* Formatting group */}
        <FormattingToolbar editor={editor} />

        <Separator orientation="vertical" className="h-auto!" />

        {/* Lists and blockquote group */}
        <ListsToolbar editor={editor} />

        <Separator orientation="vertical" className="h-auto!" />

        {/* Special elements group */}
        <SpecialToolbar editor={editor} />

        <Separator orientation="vertical" className="h-auto!" />

        {/* Extra features */}
        <ToolbarButton
          onClick={insertLink}
          active={editor.isActive("link")}
          tooltip="Insert Link (Ctrl+K)"
          icon={<LinkIcon className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={insertImage}
          tooltip="Insert Image"
          icon={<ImageIcon className="h-4 w-4" />}
        />
      </div>
    </TooltipProvider>
  );
}

EditorToolbar.displayName = "EditorToolbar";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip: string;
  icon: React.ReactNode;
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  tooltip,
  icon,
}: ToolbarButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        size="icon"
        variant={active ? "secondary" : "ghost"}
        onClick={onClick}
        disabled={disabled}
        className="h-8 w-8"
      >
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">{tooltip}</TooltipContent>
  </Tooltip>
);
