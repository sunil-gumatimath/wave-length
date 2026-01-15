import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SEO } from '@/components/seo';

const techStack = [
  { name: 'React 19', description: 'UI Library', color: 'bg-blue-500' },
  { name: 'Vite 7', description: 'Build Tool', color: 'bg-purple-500' },
  { name: 'ShadCN UI', description: 'Component Library', color: 'bg-green-500' },
  { name: 'Tailwind CSS 4', description: 'Styling', color: 'bg-cyan-500' },
  { name: 'Neon', description: 'Serverless PostgreSQL', color: 'bg-emerald-500' },
  { name: 'Drizzle ORM', description: 'Type-safe Queries', color: 'bg-yellow-500' },
  { name: 'TypeScript', description: 'Type Safety', color: 'bg-blue-600' },
  { name: 'Bun', description: 'Tooling', color: 'bg-orange-500' },
];

const features = [
  'Admin CRUD for posts',
  'Comments on posts',
  'Category filtering + post search',
  'Dark/Light mode support',
  'Responsive design for all devices',
  'SEO meta tags per page',
  'Markdown content with syntax highlighting',
  'Reading progress + related posts',
];

const socialLinks = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
];

export function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <SEO
        title="About"
        description="Learn more about Wavelength — a modern blog built with React, Vite, and ShadCN UI."
      />

      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              About{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Wavelength
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              A modern blog project focused on clean UI, fast navigation, and a solid
              writing experience for technical posts.
            </motion.p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="mb-12 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-8">
                <h2 className="text-2xl font-bold mb-4">What This Site Is For</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Wavelength is a lightweight place to publish posts, organize them by
                  category, and make them easy to find later. It’s designed to stay
                  readable, responsive, and quick to navigate.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
            <p className="text-muted-foreground mb-6">
              Built with a modern stack for UI, styling, and data access:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-md transition-shadow cursor-default">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${tech.color}`} />
                        <div>
                          <p className="font-semibold text-sm">{tech.name}</p>
                          <p className="text-xs text-muted-foreground">{tech.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Features */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <Separator className="my-12" />

          {/* Contact */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Want to reach out? Find me on the platforms below.
            </p>

            <div className="flex justify-center gap-4 mb-8">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <Button asChild>
              <Link to="/blog">
                Start Reading
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.section>
        </div>
      </div>
    </>
  );
}
