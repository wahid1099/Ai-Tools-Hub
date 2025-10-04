import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBookmarks = (userId: string | undefined) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchBookmarks();
  }, [userId]);

  const fetchBookmarks = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("tool_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching bookmarks:", error);
    } else {
      setBookmarkedIds(new Set(data.map((b) => b.tool_id)));
    }
    setLoading(false);
  };

  const toggleBookmark = async (toolId: string) => {
    if (!userId) {
      toast.error("Please sign in to bookmark tools");
      return;
    }

    const isBookmarked = bookmarkedIds.has(toolId);

    if (isBookmarked) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("tool_id", toolId);

      if (error) {
        toast.error("Failed to remove bookmark");
      } else {
        setBookmarkedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(toolId);
          return newSet;
        });
        toast.success("Bookmark removed");
      }
    } else {
      const { error } = await supabase
        .from("bookmarks")
        .insert([{ user_id: userId, tool_id: toolId }]);

      if (error) {
        toast.error("Failed to add bookmark");
      } else {
        setBookmarkedIds((prev) => new Set(prev).add(toolId));
        toast.success("Tool bookmarked");
      }
    }
  };

  return { bookmarkedIds, toggleBookmark, loading };
};
