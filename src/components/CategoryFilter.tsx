import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Image,
  Video,
  Headphones,
  Code,
  Zap,
  PenTool,
  Search,
  Grid3X3,
  Sparkles,
} from "lucide-react";

const categories = [
  { value: "all", label: "All Tools", icon: Grid3X3 },
  { value: "chatbot", label: "Chatbots", icon: MessageSquare },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "audio", label: "Audio", icon: Headphones },
  { value: "code", label: "Code", icon: Code },
  { value: "productivity", label: "Productivity", icon: Zap },
  { value: "writing", label: "Writing", icon: PenTool },
  { value: "research", label: "Research", icon: Search },
  { value: "other", label: "Other", icon: Sparkles },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          Browse by Category
        </h2>
        <p className="text-muted-foreground">
          Discover AI tools tailored to your needs
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.value;

          return (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(cat.value)}
                className={`
                  group relative overflow-hidden transition-all duration-300 hover-lift
                  ${
                    isSelected
                      ? "bg-gradient-primary text-white shadow-lg shadow-primary/25 animate-glow"
                      : "hover:border-primary/50 hover:bg-primary/5"
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 mr-2 transition-transform group-hover:scale-110 ${
                    isSelected ? "text-white" : ""
                  }`}
                />
                <span className="relative z-10">{cat.label}</span>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
