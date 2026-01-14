import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BlogCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}

export function BlogPostSkeleton() {
    return (
        <div className="py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-4 w-24 ml-auto" />
                    </div>
                    <Skeleton className="h-12 w-full mb-2" />
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-2/3" />
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>

                {/* Cover Image */}
                <Skeleton className="aspect-video rounded-lg mb-8" />

                {/* Content */}
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-8 w-1/2 mt-6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        </div>
    );
}

export function BlogListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <BlogCardSkeleton key={i} />
            ))}
        </div>
    );
}
