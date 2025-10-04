import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLink, ArrowLeft, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useUpvotes } from "@/hooks/useUpvotes";
import { ToolActions } from "@/components/ToolActions";
import { toast } from "sonner";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  logo_url?: string;
  created_at: string;
  upvote_count: number;
  average_rating: number;
  review_count: number;
  featured: boolean;
  pricing?: string;
  features?: string[];
}

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user_id: string;
}

const ToolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useVisitorTracking(`/tool/${id}`);
  const { user } = useAuth();
  const { bookmarkedIds, toggleBookmark } = useBookmarks(user?.id);
  const { upvotedIds, toggleUpvote } = useUpvotes(user?.id);
  const [tool, setTool] = useState<Tool | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTool(id);
      fetchReviews(id);
      trackClick(id);
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      fetchUserReview(id);
    }
  }, [user, id]);

  const fetchTool = async (toolId: string) => {
    try {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("id", toolId)
        .single();

      if (error) throw error;
      setTool(data);
    } catch (error) {
      console.error("Error fetching tool:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (toolId: string) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("tool_id", toolId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
  };

  const fetchUserReview = async (toolId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("reviews")
      .select("rating, review_text")
      .eq("tool_id", toolId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setUserRating(data.rating);
      setUserReview(data.review_text || "");
    }
  };

  const trackClick = async (toolId: string) => {
    await supabase.from("tool_clicks").insert([{
      tool_id: toolId,
      user_id: user?.id || null,
    }]);
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to leave a review");
      navigate("/auth");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingReview(true);

    try {
      const { error } = await supabase
        .from("reviews")
        .upsert({
          user_id: user.id,
          tool_id: id!,
          rating: userRating,
          review_text: userReview || null,
        });

      if (error) throw error;

      toast.success("Review submitted successfully!");
      fetchReviews(id!);
      fetchTool(id!);
    } catch (error: any) {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground">Tool not found</p>
          <Button asChild className="mt-4">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Link>
          </Button>

          <Card className="p-8 bg-gradient-card border-border/50">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                {tool.logo_url ? (
                  <img
                    src={tool.logo_url}
                    alt={tool.name}
                    className="w-32 h-32 rounded-xl object-cover border border-border"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <span className="text-white font-bold text-4xl">
                      {tool.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-4xl font-bold">{tool.name}</h1>
                    {tool.featured && (
                      <Badge className="bg-primary text-white">Featured</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="text-sm">
                      {tool.category}
                    </Badge>
                    {tool.pricing && (
                      <Badge variant="outline">{tool.pricing}</Badge>
                    )}
                  </div>
                </div>

                {tool.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(tool.average_rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">
                      {tool.average_rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({tool.review_count} reviews)
                    </span>
                  </div>
                )}

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>

                {tool.features && tool.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Key Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {tool.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg">
                    <a href={tool.link} target="_blank" rel="noopener noreferrer">
                      Visit Tool
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  
                  <ToolActions
                    toolId={tool.id}
                    toolName={tool.name}
                    isBookmarked={bookmarkedIds.has(tool.id)}
                    isUpvoted={upvotedIds.has(tool.id)}
                    upvoteCount={tool.upvote_count}
                    onBookmark={() => toggleBookmark(tool.id)}
                    onUpvote={() => toggleUpvote(tool.id)}
                  />
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Added: {new Date(tool.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Reviews Section */}
          <Card className="p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>

            {/* Review Form */}
            <div className="mb-8 p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-4">Leave a Review</h3>
              <div className="space-y-4">
                <div>
                  <Label>Your Rating</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setUserRating(rating)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= userRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="review">Your Review (optional)</Label>
                  <Textarea
                    id="review"
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this tool..."
                    className="mt-2"
                  />
                </div>

                <Button
                  onClick={handleReviewSubmit}
                  disabled={submittingReview || userRating === 0}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet. Be the first to review this tool!
                </p>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          User
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.review_text && (
                      <p className="text-muted-foreground">{review.review_text}</p>
                    )}
                  </Card>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ToolDetail;
