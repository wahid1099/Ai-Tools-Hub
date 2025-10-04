import { Button } from "./ui/button";
import { Bookmark, ArrowUp, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ToolActionsProps {
  toolId: string;
  toolName: string;
  isBookmarked: boolean;
  isUpvoted: boolean;
  upvoteCount: number;
  onBookmark: () => void;
  onUpvote: () => void;
}

export const ToolActions = ({
  toolId,
  toolName,
  isBookmarked,
  isUpvoted,
  upvoteCount,
  onBookmark,
  onUpvote,
}: ToolActionsProps) => {
  const handleShare = async () => {
    const url = `${window.location.origin}/tool/${toolId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: toolName,
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onUpvote}
        className={isUpvoted ? "text-primary" : ""}
      >
        <ArrowUp className="w-4 h-4 mr-1" />
        {upvoteCount}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onBookmark}
        className={isBookmarked ? "text-primary" : ""}
      >
        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
      </Button>
      
      <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
