import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import PostCard from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Eye, FileText, Users } from "lucide-react";

export default function Home() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border" data-testid="header-navigation">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary" data-testid="text-logo">BlogCMS</h1>
              <span className="text-muted-foreground text-sm">Melbet Inspired</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-primary transition-colors" data-testid="link-home">
                <i className="fas fa-home mr-2"></i>Home
              </a>
              <a href="/admin" className="text-foreground hover:text-primary transition-colors" data-testid="link-admin">
                <i className="fas fa-cog mr-2"></i>Admin
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-black via-gray-900 to-brand-black py-20" data-testid="section-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-primary">Modern</span> Blog Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the latest articles, insights, and stories from our community of writers
          </p>
          <button className="gradient-button text-brand-black font-semibold px-8 py-4 rounded-lg hover:shadow-lg transition-all" data-testid="button-explore">
            Explore Articles
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-total-posts">{posts?.length || 0}</div>
              <div className="text-muted-foreground">Published Articles</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-secondary mb-2" data-testid="text-monthly-readers">48K</div>
              <div className="text-muted-foreground">Monthly Readers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-authors">12</div>
              <div className="text-muted-foreground">Contributing Authors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16" data-testid="section-articles">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Latest Articles</h2>
            <p className="text-muted-foreground text-lg">Stay updated with our newest content</p>
          </div>

          {error && (
            <div className="text-center py-12" data-testid="error-state">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Failed to Load Articles</h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="loading-state">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && posts && posts.length === 0 && (
            <div className="text-center py-12" data-testid="empty-state">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground">
                No published articles are available at the moment. Check back later!
              </p>
            </div>
          )}

          {!isLoading && !error && posts && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="posts-grid">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} featured={index === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10" data-testid="section-newsletter">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter and never miss the latest articles and insights
          </p>
          <div className="max-w-md mx-auto flex space-x-4">
            <input type="email" placeholder="Enter your email" 
                   className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                   data-testid="input-email" />
            <button className="gradient-button text-brand-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    data-testid="button-subscribe">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12" data-testid="footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary">BlogCMS</h3>
              <p className="text-muted-foreground">Modern blog platform with Melbet-inspired design for content creators and developers.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="/admin" className="hover:text-primary transition-colors">Admin</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Categories</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Design</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Programming</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-discord text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 BlogCMS. All rights reserved. Built with React, TailwindCSS, Express & PostgreSQL.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
