import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // Headings
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-8 mb-4 tracking-tight">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-bold mt-6 mb-3 tracking-tight">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-bold mt-5 mb-2 tracking-tight">{children}</h3>
                    ),
                    // Paragraphs
                    p: ({ children }) => (
                        <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
                    ),
                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target={href?.startsWith("http") ? "_blank" : undefined}
                            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-primary font-medium hover:underline"
                        >
                            {children}
                        </a>
                    ),
                    // Lists
                    ul: ({ children }) => (
                        <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-muted-foreground">{children}</li>
                    ),
                    // Code
                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;

                        if (isInline) {
                            return (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="bg-muted border rounded-lg overflow-x-auto p-4 my-4">
                            {children}
                        </pre>
                    ),
                    // Blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                            {children}
                        </blockquote>
                    ),
                    // Images
                    img: ({ src, alt }) => (
                        <figure className="my-6">
                            <img
                                src={src}
                                alt={alt}
                                className="rounded-lg shadow-md w-full"
                                loading="lazy"
                            />
                            {alt && (
                                <figcaption className="text-center text-sm text-muted-foreground mt-2">
                                    {alt}
                                </figcaption>
                            )}
                        </figure>
                    ),
                    // Horizontal rule
                    hr: () => <hr className="border-border my-8" />,
                    // Strong & Emphasis
                    strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-foreground">{children}</em>
                    ),
                    // Tables
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="w-full border-collapse">{children}</table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-border bg-muted p-2 text-left font-semibold">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-border p-2">{children}</td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
