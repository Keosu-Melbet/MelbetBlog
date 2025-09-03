import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Edit, Trash2, Plus, Images, BarChart3, Settings, ArrowRight } from "lucide-react";

interface PostsManagementProps {
  posts?: Post[];
  isLoading: boolean;
}

export default function PostsManagement({ posts, isLoading }: PostsManagementProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      await apiRequest('DELETE', `/api/posts/${postId}`);
    },
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete post",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleDeletePost = (postId: string, postTitle: string) => {
    if (confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      deletePostMutation.mutate(postId);
    }
  };

  const recentPosts = posts?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Recent Posts */}
      <div className="bg-card p-6 rounded-lg" data-testid="section-recent-posts">
        <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b border-border pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="empty-posts">
            <p>No posts available. Create your first post!</p>
          </div>
        ) : (
          <div className="space-y-4" data-testid="posts-list">
            {recentPosts.map((post) => (
              <div key={post.id} className="border-b border-border pb-4" data-testid={`post-item-${post.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1" data-testid={`text-post-title-${post.id}`}>
                      {post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}
                    </h4>
                    <p className="text-muted-foreground text-xs mb-2" data-testid={`text-post-date-${post.id}`}>
                      {format(new Date(post.createdAt), "MMMM dd, yyyy")}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={post.published ? "secondary" : "outline"}
                        className={post.published ? "bg-secondary text-secondary-foreground" : ""}
                        data-testid={`badge-status-${post.id}`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-primary hover:text-primary/80"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast({
                          title: "Edit functionality",
                          description: "Edit feature will be implemented soon.",
                        });
                      }}
                      data-testid={`button-edit-${post.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive/80"
                      onClick={() => handleDeletePost(post.id, post.title)}
                      disabled={deletePostMutation.isPending}
                      data-testid={`button-delete-${post.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button 
          variant="link" 
          className="w-full mt-4 text-primary hover:text-primary/80 text-sm font-medium"
          data-testid="button-view-all-posts"
        >
          View All Posts <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-lg" data-testid="section-quick-actions">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button 
            className="w-full admin-active text-accent-foreground hover:opacity-90"
            data-testid="button-new-post"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
          <Button 
            variant="secondary"
            className="w-full"
            data-testid="button-media-library"
          >
            <Images className="h-4 w-4 mr-2" />
            Media Library
          </Button>
          <Button 
            variant="secondary"
            className="w-full"
            data-testid="button-analytics"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button 
            variant="secondary"
            className="w-full"
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
