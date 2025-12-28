
import React from "react";

type MarkdownRendererProps = {
  content: string;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderInline = (text: string) => {
    // Regex to split by bold (**) and inline code (`)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="bg-muted rounded-md px-2 py-1 text-sm font-medium text-accent font-code"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderBlock = (block: string, index: number) => {
    const trimmedBlock = block.trim();

    if (trimmedBlock.startsWith("# ")) {
      return (
        <h1 key={index} className="text-3xl font-bold mt-8 mb-4 border-b pb-2 text-foreground">
          {renderInline(trimmedBlock.substring(2))}
        </h1>
      );
    }
    if (trimmedBlock.startsWith("## ")) {
      return (
        <h2 key={index} className="text-2xl font-bold mt-8 mb-3 border-b pb-2 text-foreground">
          {renderInline(trimmedBlock.substring(3))}
        </h2>
      );
    }
    if (trimmedBlock.startsWith("### ")) {
      return (
        <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-foreground">
          {renderInline(trimmedBlock.substring(4))}
        </h3>
      );
    }
    // Handle unordered lists
    if (trimmedBlock.startsWith("* ") || trimmedBlock.startsWith("- ")) {
      const listItems = trimmedBlock.split('\n').map((item, itemIndex) => {
        const trimmedItem = item.trim();
        if (trimmedItem.startsWith("* ") || trimmedItem.startsWith("- ")) {
          return (
            <li key={itemIndex} className="ml-4">
              {renderInline(trimmedItem.substring(2))}
            </li>
          );
        }
        return null;
      }).filter(Boolean);

      return <ul key={index} className="list-disc space-y-2 my-4">{listItems}</ul>;
    }
    
    // Handle paragraphs and preserve newlines within them
    return (
      <p key={index} className="whitespace-pre-wrap">
        {renderInline(trimmedBlock)}
      </p>
    );
  };
  
  // Split by double newlines to separate blocks, but keep single newlines.
  const blocks = content.split(/(\n\s*\n)/).reduce((acc, part, index) => {
    if (index % 2 === 0) {
      if (part.trim()) acc.push(part);
    }
    return acc;
  }, [] as string[]);


  return (
    <div className="space-y-4 text-base leading-relaxed text-card-foreground">
      {blocks.map(renderBlock)}
    </div>
  );
};

export default MarkdownRenderer;
