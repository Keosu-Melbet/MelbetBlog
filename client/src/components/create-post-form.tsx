import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema, type InsertPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CloudUpload, X, Save, FileText } from "lucide-react";

export default function CreatePostForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      published: false,
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiRequest('POST', '/api/upload', formData);
      return await response.json();
    },
    onSuccess: (data) => {
      form.setValue('imageUrl', data.imageUrl);
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and is ready to use.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: InsertPost) => {
      const response = await apiRequest('POST', '/api/posts', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post created successfully",
        description: "Your post has been published.",
      });
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);
    uploadImageMutation.mutate(file);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue('imageUrl', '');
    setIsUploading(false);
  };

  const onSubmit = (data: InsertPost) => {
    createPostMutation.mutate(data);
  };

  return (
    <div className="bg-card p-6 rounded-lg" data-testid="form-create-post">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter post title..." 
                    {...field}
                    data-testid="input-post-title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Featured Image</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20">
              {!imagePreview ? (
                <div className="space-y-4" data-testid="upload-area">
                  <CloudUpload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-muted-foreground">Drag and drop an image here, or</p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-primary hover:text-primary/80 font-medium p-0"
                      onClick={() => document.getElementById('file-input')?.click()}
                      data-testid="button-browse-files"
                    >
                      browse files
                    </Button>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                    data-testid="input-file"
                  />
                </div>
              ) : (
                <div className="space-y-4" data-testid="image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-48 object-cover mx-auto rounded-lg"
                    data-testid="img-preview"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImageRemove}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    data-testid="button-remove-image"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={8}
                    placeholder="Write your post content..."
                    className="resize-vertical"
                    {...field}
                    data-testid="textarea-post-content"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Published Checkbox */}
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="checkbox-published"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Publish immediately</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={createPostMutation.isPending || isUploading}
              className="gradient-button text-brand-black font-semibold hover:shadow-lg"
              data-testid="button-publish-post"
            >
              {createPostMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-black mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Publish Post
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.setValue('published', false);
                form.handleSubmit(onSubmit)();
              }}
              disabled={createPostMutation.isPending || isUploading}
              data-testid="button-save-draft"
            >
              <FileText className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
