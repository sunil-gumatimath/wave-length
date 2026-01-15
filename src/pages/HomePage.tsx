import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogCard } from '@/components/blog';
import { BlogListSkeleton } from '@/components/common';
import { SEO } from '@/components/seo';
import { usePosts } from '@/hooks/usePosts';
import { toast } from 'sonner';

export function HomePage() {
  const { posts, loading, error, refetch } = usePosts();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const motionEnabled = !shouldReduceMotion;

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      toast.error('Please enter your email.');
      return;
    }

    // Basic client-side validation (browser also validates via type="email")
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Simulate subscription
    setIsSubscribed(true);
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <SEO />

      <div>
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          {/* Animated shapes */}
          {motionEnabled && (
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
          {motionEnabled && (
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          <div className="container mx-auto text-center relative z-10">
            <motion.div
              initial={motionEnabled ? 'hidden' : false}
              animate={motionEnabled ? 'visible' : undefined}
              variants={motionEnabled ? containerVariants : undefined}
            >
              <motion.div
                variants={motionEnabled ? itemVariants : undefined}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4" />
                Personal Blog
              </motion.div>

              <motion.h1
                variants={motionEnabled ? itemVariants : undefined}
                className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
              >
                Welcome to{' '}
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Wavelength
                </span>
              </motion.h1>

              <motion.p
                variants={motionEnabled ? itemVariants : undefined}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
              >
                I share notes on web development, technology, and building things.
              </motion.p>

              <motion.div
                variants={motionEnabled ? itemVariants : undefined}
                className="flex gap-4 justify-center flex-wrap"
              >
                <Button size="lg" asChild className="shadow-lg shadow-primary/20">
                  <Link to="/blog">
                    Read Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={motionEnabled ? { opacity: 0, y: 20 } : false}
              whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Latest Articles</h2>
                <p className="text-muted-foreground mt-2">Fresh content from our writers</p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link to="/blog">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            {loading ? (
              <BlogListSkeleton count={3} />
            ) : error ? (
              <motion.div
                initial={motionEnabled ? { opacity: 0 } : false}
                animate={motionEnabled ? { opacity: 1 } : undefined}
                className="text-center py-16 bg-muted/30 rounded-xl"
              >
                <p className="text-xl font-medium mb-2">Couldn’t load posts</p>
                <p className="text-muted-foreground mb-6">{error}</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button variant="outline" onClick={() => void refetch()}>
                    Retry
                  </Button>
                  <Button asChild>
                    <Link to="/blog">Browse blog</Link>
                  </Button>
                </div>
              </motion.div>
            ) : posts.length === 0 ? (
              <motion.div
                initial={motionEnabled ? { opacity: 0 } : false}
                animate={motionEnabled ? { opacity: 1 } : undefined}
                className="text-center py-16 bg-muted/30 rounded-xl"
              >
                <p className="text-xl text-muted-foreground mb-4">No posts yet</p>
                <Button asChild>
                  <Link to="/admin/posts/new">Create your first post</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(0, 3).map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            )}

            <motion.div
              initial={motionEnabled ? { opacity: 0 } : false}
              whileInView={motionEnabled ? { opacity: 1 } : undefined}
              viewport={{ once: true }}
              className="text-center mt-8 sm:hidden"
            >
              <Button variant="outline" asChild>
                <Link to="/blog">
                  View all articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={motionEnabled ? { opacity: 0, y: 20 } : false}
              whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-12"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <motion.div
                  initial={motionEnabled ? { scale: 0 } : false}
                  whileInView={motionEnabled ? { scale: 1 } : undefined}
                  viewport={{ once: true }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
                >
                  <Mail className="h-8 w-8 text-primary" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Subscribe to our newsletter for the latest articles, tutorials, and updates.
                  No spam, unsubscribe at any time.
                </p>

                {isSubscribed ? (
                  <motion.div
                    initial={motionEnabled ? { opacity: 0, scale: 0.8 } : false}
                    animate={motionEnabled ? { opacity: 1, scale: 1 } : undefined}
                    className="inline-flex items-center gap-2 text-primary font-medium"
                  >
                    <Check className="h-5 w-5" />
                    You're subscribed! Check your inbox.
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-background"
                      autoComplete="email"
                      inputMode="email"
                      required
                    />
                    <Button type="submit">
                      Subscribe
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <motion.div
              initial={motionEnabled ? { opacity: 0, y: 20 } : false}
              whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Wavelength?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A modern blogging platform built with the latest web technologies
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Modern Stack',
                  description: 'Built with React 19, Vite 7, Tailwind CSS 4, and PostgreSQL for blazing fast performance.',
                  icon: '⚡',
                },
                {
                  title: 'Beautiful Design',
                  description: 'Clean, minimal design with dark mode support and smooth animations using Framer Motion.',
                  icon: '🎨',
                },
                {
                  title: 'Full Featured',
                  description: 'Complete CRUD operations, comments, categories, search, and much more out of the box.',
                  icon: '✨',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={motionEnabled ? { opacity: 0, y: 20 } : false}
                  whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
                  viewport={{ once: true }}
                  transition={motionEnabled ? { delay: index * 0.1 } : undefined}
                  className="text-center p-6 rounded-xl bg-background shadow-sm border"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
