import React from "react";

type MarkdownRendererProps = {
  content: string;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split("\n");

  const renderLine = (line: string) => {
    const parts = line.split(/(`.*?`)/g);

    return parts.map((part, index) => {
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
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4 text-base leading-relaxed text-card-foreground">
      {lines.map((line, index) => {
        if (line.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="text-xl font-semibold mt-6 mb-2 text-foreground"
            >
              {renderLine(line.substring(4))}
            </h3>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="text-2xl font-bold mt-8 mb-3 border-b pb-2 text-foreground"
            >
              {renderLine(line.substring(3))}
            </h2>
          );
        }
        if (line.startsWith("* ") || line.startsWith("- ")) {
          return (
            <div key={index} className="flex items-start pl-4">
              <span className="mr-3 mt-1.5 text-primary">●</span>
              <p className="flex-1">{renderLine(line.substring(2))}</p>
            </div>
          );
        }
        if (line.trim() === "") {
          return null;
        }
        return <p key={index}>{renderLine(line)}</p>;
      })}
    </div>
  );
};

export default MarkdownRenderer;
