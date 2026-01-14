import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, FileText, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/about", label: "About", icon: User },
    { href: "/admin", label: "Admin", icon: Settings },
];

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                <SheetHeader className="border-b pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <img src="/logo.svg" alt="TedBlog Logo" className="h-8 w-8" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            TedBlog
                        </span>
                    </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 py-4">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            to={href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                                location.pathname === href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto border-t pt-4">
                    <Button className="w-full" onClick={() => setOpen(false)}>
                        Subscribe
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
