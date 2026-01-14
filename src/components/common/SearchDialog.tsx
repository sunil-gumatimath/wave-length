import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PostWithRelations } from "@/types/blog";

interface SearchDialogProps {
    posts: PostWithRelations[];
}

export function SearchDialog({ posts }: SearchDialogProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    // Keyboard shortcut to open search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const results = useMemo(() => {
        const trimmed = query.trim();
        if (!trimmed) return [];

        const lowerQuery = trimmed.toLowerCase();
        return posts.filter(
            (post) =>
                post.title.toLowerCase().includes(lowerQuery) ||
                post.excerpt?.toLowerCase().includes(lowerQuery) ||
                post.content.toLowerCase().includes(lowerQuery) ||
                post.author.name.toLowerCase().includes(lowerQuery) ||
                post.postCategories.some((pc) =>
                    pc.category?.name.toLowerCase().includes(lowerQuery)
                )
        );
    }, [posts, query]);

    const handleSelect = (slug: string) => {
        setOpen(false);
        setQuery("");
        navigate(`/blog/${slug}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                >
                    <Search className="h-4 w-4 xl:mr-2" />
                    <span className="hidden xl:inline-flex">Search posts...</span>
                    <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 gap-0">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="sr-only">Search Posts</DialogTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search posts, authors, categories..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 pr-10"
                            autoFocus
                        />
                        {query && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                                onClick={() => setQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </DialogHeader>
                <ScrollArea className="max-h-[400px]">
                    <div className="p-4 pt-2">
                        {query && results.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No posts found for "{query}"</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground mb-2">
                                    {results.length} result{results.length !== 1 ? "s" : ""} found
                                </p>
                                {results.map((post) => (
                                    <button
                                        key={post.id}
                                        onClick={() => handleSelect(post.slug)}
                                        className="flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-accent transition-colors"
                                    >
                                        <FileText className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium truncate">{post.title}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {post.excerpt || "No description available"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    by {post.author.name}
                                                </span>
                                                {post.postCategories.length > 0 && (
                                                    <>
                                                        <span className="text-xs text-muted-foreground">
                                                            •
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {post.postCategories
                                                                .map((pc) => pc.category?.name)
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">Start typing to search posts...</p>
                                <p className="text-xs mt-2">
                                    Search by title, content, author, or category
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
