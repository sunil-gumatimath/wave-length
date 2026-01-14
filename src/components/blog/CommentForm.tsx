import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { getDb } from "@/db";
import { comments, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const commentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    content: z.string().min(10, "Comment must be at least 10 characters"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
    postId: number;
    onCommentAdded: () => void;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
    });

    const onSubmit = async (data: CommentFormData) => {
        setIsSubmitting(true);

        try {
            const db = getDb();

            // Check if user exists, if not create one
            let user = await db.query.users.findFirst({
                where: eq(users.email, data.email),
            });

            if (!user) {
                const [newUser] = await db
                    .insert(users)
                    .values({
                        name: data.name,
                        email: data.email,
                    })
                    .returning();
                user = newUser;
            }

            // Create comment
            await db.insert(comments).values({
                postId,
                authorId: user.id,
                content: data.content,
            });

            toast.success("Comment added successfully!");
            reset();
            onCommentAdded();
        } catch (error) {
            console.error("Failed to add comment:", error);
            toast.error("Failed to add comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            placeholder="Your name"
                            {...register("name")}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            {...register("email")}
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="content">Comment *</Label>
                    <Textarea
                        id="content"
                        placeholder="Write your comment..."
                        rows={4}
                        {...register("content")}
                        disabled={isSubmitting}
                    />
                    {errors.content && (
                        <p className="text-sm text-destructive">{errors.content.message}</p>
                    )}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        <>
                            <Send className="h-4 w-4 mr-2" />
                            Post Comment
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
