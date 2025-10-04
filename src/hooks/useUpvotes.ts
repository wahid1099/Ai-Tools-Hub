import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUpvotes = (userId: string | undefined) => {
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchUpvotes();
  }, [userId]);

  const fetchUpvotes = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("upvotes")
      .select("tool_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching upvotes:", error);
    } else {
      setUpvotedIds(new Set(data.map((u) => u.tool_id)));
    }
    setLoading(false);
  };

  const toggleUpvote = async (toolId: string) => {
    if (!userId) {
      toast.error("Please sign in to upvote tools");
      return;
    }

    const isUpvoted = upvotedIds.has(toolId);

    if (isUpvoted) {
      const { error } = await supabase
        .from("upvotes")
        .delete()
        .eq("user_id", userId)
        .eq("tool_id", toolId);

      if (error) {
        toast.error("Failed to remove upvote");
      } else {
        setUpvotedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(toolId);
          return newSet;
        });
      }
    } else {
      const { error } = await supabase
        .from("upvotes")
        .insert([{ user_id: userId, tool_id: toolId }]);

      if (error) {
        toast.error("Failed to upvote");
      } else {
        setUpvotedIds((prev) => new Set(prev).add(toolId));
      }
    }
  };

  return { upvotedIds, toggleUpvote, loading };
};
