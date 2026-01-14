/**
 * Calculate estimated reading time for content
 * Average reading speed is ~200-250 words per minute
 */
export function calculateReadingTime(content: string): {
    minutes: number;
    text: string;
} {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return {
        minutes,
        text: minutes === 1 ? "1 min read" : `${minutes} min read`,
    };
}

/**
 * Format date relative to now (e.g., "2 days ago")
 */
export function formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours === 0) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            if (diffInMinutes < 1) return "Just now";
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
        }
        return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    }
    if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} month${months !== 1 ? "s" : ""} ago`;
    }

    const years = Math.floor(diffInDays / 365);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
}
