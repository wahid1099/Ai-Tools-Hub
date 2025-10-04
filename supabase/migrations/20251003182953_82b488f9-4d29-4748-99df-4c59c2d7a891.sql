-- Fix search path for trigger functions

DROP TRIGGER IF EXISTS update_upvote_count ON public.upvotes;
DROP TRIGGER IF EXISTS update_review_stats_trigger ON public.reviews;

CREATE OR REPLACE FUNCTION update_tool_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tools
  SET upvote_count = (
    SELECT COUNT(*) FROM public.upvotes WHERE tool_id = NEW.tool_id
  )
  WHERE id = NEW.tool_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_upvote_count
  AFTER INSERT OR DELETE ON public.upvotes
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_stats();

CREATE OR REPLACE FUNCTION update_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tools
  SET 
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)),
    average_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id))
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_review_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_review_stats();