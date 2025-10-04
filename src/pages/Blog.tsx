import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  cover_image_url: string | null;
  published_at: string;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Insights, tutorials, and updates about AI tools
          </p>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Check back soon!</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                    {post.cover_image_url && (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.published_at || post.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
