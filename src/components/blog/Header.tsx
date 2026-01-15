import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme';
import { SearchDialog } from '@/components/common';
import { MobileNav } from '@/components/layout';
import { usePosts } from '@/hooks/usePosts';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/admin', label: 'Admin', requiresAdmin: true },
];

export function Header() {
  const location = useLocation();
  const { posts } = usePosts();
  const enableAdmin =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === 'true';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile Nav */}
        <MobileNav />

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Wavelength Logo" className="h-9 w-9 object-contain" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Wavelength
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems
            .filter((item) => !item.requiresAdmin || enableAdmin)
            .map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                location.pathname === href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <SearchDialog posts={posts} />
          <ThemeToggle />
          <Button size="sm" className="hidden sm:flex">
            Subscribe
          </Button>
        </div>
      </div>
    </header>
  );
}
