import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Quote,
  List,
  Code,
  TerminalSquare,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  CornerDownRight,
  Heading4,
  Heading5,
  Heading6,
  Minus,
  ListOrdered,
} from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ToolbarGroupProps {
  editor: Editor;
}

export function HeadingToolbar({ editor }: Readonly<ToolbarGroupProps>) {
  const headings = [
    { level: 1 as const, icon: <Heading1 className="h-4 w-4" /> },
    { level: 2 as const, icon: <Heading2 className="h-4 w-4" /> },
    { level: 3 as const, icon: <Heading3 className="h-4 w-4" /> },
    { level: 4 as const, icon: <Heading4 className="h-4 w-4" /> },
    { level: 5 as const, icon: <Heading5 className="h-4 w-4" /> },
    { level: 6 as const, icon: <Heading6 className="h-4 w-4" /> },
  ];

  return (
    <>
      {headings.map(({ level, icon }) => (
        <Tooltip key={level}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={
                editor.isActive("heading", { level }) ? "default" : "ghost"
              }
              onClick={() =>
                editor.chain().focus().toggleHeading({ level }).run()
              }
              className="h-8 w-8"
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Heading {level}</TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}

export function FormattingToolbar({ editor }: Readonly<ToolbarGroupProps>) {
  const formats = [
    {
      name: "bold",
      icon: <Bold className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      tooltip: "Bold (Ctrl+B)",
    },
    {
      name: "italic",
      icon: <Italic className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      tooltip: "Italic (Ctrl+I)",
    },
    {
      name: "strike",
      icon: <Strikethrough className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      tooltip: "Strikethrough",
    },
    {
      name: "code",
      icon: <Code className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
      tooltip: "Inline Code (Ctrl+E)",
    },
  ];

  return (
    <>
      {formats.map((format) => (
        <Tooltip key={format.name}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={format.isActive() ? "default" : "ghost"}
              onClick={format.action}
              className="h-8 w-8"
            >
              {format.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{format.tooltip}</TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}

export function ListsToolbar({ editor }: Readonly<ToolbarGroupProps>) {
  const items = [
    {
      name: "bulletList",
      icon: <List className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
      tooltip: "Bullet List",
    },
    {
      name: "orderedList",
      icon: <ListOrdered className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
      tooltip: "Ordered List",
    },
    {
      name: "blockquote",
      icon: <Quote className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
      tooltip: "Blockquote",
    },
  ];

  return (
    <>
      {items.map((item) => (
        <Tooltip key={item.name}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={item.isActive() ? "default" : "ghost"}
              onClick={item.action}
              className="h-8 w-8"
            >
              {item.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{item.tooltip}</TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}

export function SpecialToolbar({ editor }: Readonly<ToolbarGroupProps>) {
  const items = [
    {
      name: "codeBlock",
      icon: <TerminalSquare className="h-4 w-4" />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
      tooltip: "Code Block",
    },
    {
      name: "hardBreak",
      icon: <CornerDownRight className="h-4 w-4" />,
      action: () => editor.chain().focus().setHardBreak().run(),
      isActive: () => false,
      tooltip: "Hard Break",
    },
    {
      name: "horizontalRule",
      icon: <Minus className="h-4 w-4" />,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: () => false,
      tooltip: "Horizontal Rule",
    },
  ];

  return (
    <>
      {items.map((item) => (
        <Tooltip key={item.name}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={item.isActive() ? "default" : "ghost"}
              onClick={item.action}
              className="h-8 w-8"
            >
              {item.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{item.tooltip}</TooltipContent>
        </Tooltip>
      ))}
    </>
  );
}
