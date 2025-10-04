import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Heart, ExternalLink, Trash2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Tool {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  category: string;
  average_rating: number | null;
  upvote_count: number | null;
}

const Bookmarks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchBookmarkedTools();
  }, [user, navigate, fetchBookmarkedTools]);

  const fetchBookmarkedTools = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select(
        `
        tool_id,
        tools (*)
      `
      )
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching bookmarks:", error);
    } else {
      setTools(data?.map((b: any) => b.tools).filter(Boolean) || []);
    }
    setLoading(false);
  };

  const removeBookmark = async (toolId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("tool_id", toolId);

    if (error) {
      toast.error("Failed to remove bookmark");
    } else {
      toast.success("Bookmark removed");
      setTools(tools.filter((tool) => tool.id !== toolId));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="p-3 rounded-xl bg-gradient-primary shadow-lg animate-glow">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gradient">My Bookmarks</h1>
            <p className="text-muted-foreground mt-1">
              {tools.length} saved {tools.length === 1 ? "tool" : "tools"}
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : tools.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-12 text-center glass-effect hover-lift">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary/10 flex items-center justify-center">
                <Bookmark className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gradient">
                No bookmarks yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start bookmarking your favorite AI tools to access them quickly
                from here
              </p>
              <Button asChild className="animate-glow">
                <Link to="/">
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Tools
                </Link>
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden glass-effect hover-lift border-border/50">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {tool.logo_url ? (
                          <img
                            src={tool.logo_url}
                            alt={tool.name}
                            className="w-12 h-12 object-cover rounded-xl border border-border/50"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {tool.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          removeBookmark(tool.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {tool.average_rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{tool.average_rating.toFixed(1)}</span>
                          </div>
                        )}
                        {tool.upvote_count && (
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                            <span>{tool.upvote_count}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Link to={`/tool/${tool.id}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
