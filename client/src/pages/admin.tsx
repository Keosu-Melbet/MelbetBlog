import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import CreatePostForm from "@/components/create-post-form";
import PostsManagement from "@/components/posts-management";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CheckCircle, Edit, Eye } from "lucide-react";

export default function Admin() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/admin/posts'],
  });

  const publishedCount = posts?.filter(post => post.published).length || 0;
  const draftCount = posts?.filter(post => !post.published).length || 0;

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
              <a href="/" className="text-foreground hover:text-primary transition-colors" data-testid="link-home">
                <i className="fas fa-home mr-2"></i>Home
              </a>
              <a href="/admin" className="text-primary transition-colors" data-testid="link-admin">
                <i className="fas fa-cog mr-2"></i>Admin
              </a>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-admin-title">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your blog content and posts</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="stats-cards">
          <div className="bg-card p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Posts</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-primary" data-testid="text-total-posts">{posts?.length || 0}</p>
                )}
              </div>
              <FileText className="text-primary text-2xl" />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Published</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-secondary" data-testid="text-published-posts">{publishedCount}</p>
                )}
              </div>
              <CheckCircle className="text-secondary text-2xl" />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Drafts</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-muted-foreground" data-testid="text-draft-posts">{draftCount}</p>
                )}
              </div>
              <Edit className="text-muted-foreground text-2xl" />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Views Today</p>
                <p className="text-2xl font-bold text-accent" data-testid="text-views-today">1.2K</p>
              </div>
              <Eye className="text-accent text-2xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Post Form */}
          <div className="lg:col-span-2">
            <CreatePostForm />
          </div>

          {/* Posts Management */}
          <div>
            <PostsManagement posts={posts} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
