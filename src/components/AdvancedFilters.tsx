import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

interface AdvancedFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  pricingFilter: string;
  onPricingChange: (pricing: string) => void;
}

export const AdvancedFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  pricingFilter,
  onPricingChange,
}: AdvancedFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 glass-effect border-border/50 shadow-lg">
        <div className="space-y-6">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search for AI tools, features, or use cases..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-12 text-lg border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4 text-primary" />
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="h-11 border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-effect border-border/50">
                  <SelectItem value="popular">🔥 Most Popular</SelectItem>
                  <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                  <SelectItem value="newest">🆕 Newest</SelectItem>
                  <SelectItem value="name">🔤 Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="w-4 h-4 text-primary" />
                Pricing
              </Label>
              <Select value={pricingFilter} onValueChange={onPricingChange}>
                <SelectTrigger className="h-11 border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-effect border-border/50">
                  <SelectItem value="all">💎 All Tools</SelectItem>
                  <SelectItem value="free">🆓 Free</SelectItem>
                  <SelectItem value="freemium">🎯 Freemium</SelectItem>
                  <SelectItem value="paid">💰 Paid</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          {/* Filter indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Use filters to find the perfect AI tool for your needs</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
