import { Post } from "@shared/schema";
import { format } from "date-fns";
import { User, ArrowRight } from "lucide-react";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const formattedDate = format(new Date(post.createdAt), "MMMM dd, yyyy");
  
  if (featured) {
    return (
      <div className="lg:col-span-2 bg-card rounded-lg overflow-hidden card-hover" data-testid={`card-post-${post.id}`}>
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-64 object-cover"
            data-testid={`img-post-${post.id}`}
          />
        )}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium" data-testid="badge-featured">
              Featured
            </span>
            <span className="text-muted-foreground text-sm" data-testid={`text-date-${post.id}`}>
              {formattedDate}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-3" data-testid={`text-title-${post.id}`}>
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4" data-testid={`text-content-${post.id}`}>
            {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Admin</span>
            </div>
            <button className="text-primary hover:text-primary/80 font-medium" data-testid={`button-read-more-${post.id}`}>
              Read More <ArrowRight className="inline h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-card rounded-lg overflow-hidden card-hover" data-testid={`card-post-${post.id}`}>
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-32 object-cover"
          data-testid={`img-post-${post.id}`}
        />
      )}
      <div className="p-4">
        <span className="text-muted-foreground text-sm" data-testid={`text-date-${post.id}`}>
          {formattedDate}
        </span>
        <h4 className="text-lg font-semibold mb-2" data-testid={`text-title-${post.id}`}>
          {post.title}
        </h4>
        <p className="text-muted-foreground text-sm mb-3" data-testid={`text-content-${post.id}`}>
          {post.content.length > 120 ? `${post.content.substring(0, 120)}...` : post.content}
        </p>
        <button className="text-primary hover:text-primary/80 text-sm font-medium" data-testid={`button-read-more-${post.id}`}>
          Read More <ArrowRight className="inline h-4 w-4 ml-1" />
        </button>
      </div>
    </article>
  );
}
