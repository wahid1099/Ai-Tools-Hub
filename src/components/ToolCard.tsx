import { motion } from "framer-motion";
import { ExternalLink, Star, Sparkles, Heart } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  logo_url?: string;
  index: number;
  upvote_count?: number;
  average_rating?: number;
  review_count?: number;
  featured?: boolean;
}

export const ToolCard = ({
  id,
  name,
  description,
  category,
  link,
  logo_url,
  index,
  upvote_count = 0,
  average_rating = 0,
  review_count = 0,
  featured = false,
}: ToolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group"
    >
      <Card
        className={`relative overflow-hidden glass-effect hover-lift border-border/50 h-full transition-all duration-500 ${
          featured ? "ring-2 ring-primary/50 shadow-lg shadow-primary/20" : ""
        }`}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-primary text-white shadow-lg animate-glow">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        <Link to={`/tool/${id}`} className="block">
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="relative">
                {logo_url ? (
                  <img
                    src={logo_url}
                    alt={name}
                    className="w-14 h-14 rounded-xl object-cover border border-border/50 shadow-sm group-hover:shadow-md transition-shadow"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow animate-glow">
                    <span className="text-white font-bold text-xl">
                      {name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-foreground group-hover:text-gradient transition-all duration-300 line-clamp-1 mb-2">
                  {name}
                </h3>
                <Badge
                  variant="secondary"
                  className="text-xs px-3 py-1 rounded-full bg-muted/50 hover:bg-primary/10 transition-colors"
                >
                  {category}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {description}
            </p>

            {/* Stats and Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <div className="flex items-center gap-4">
                {average_rating > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {average_rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({review_count})
                    </span>
                  </div>
                )}
                {upvote_count > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                    <span className="font-medium">{upvote_count}</span>
                  </div>
                )}
              </div>

              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 z-10 relative"
              >
                <span>Visit</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </Link>

        {/* Hover border effect */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-colors duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  );
};
