import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SubmitToolForm } from "@/components/SubmitToolForm";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AdvancedFilters } from "@/components/AdvancedFilters";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  logo_url?: string | null;
  upvote_count?: number | null;
  average_rating?: number | null;
  review_count?: number | null;
  featured?: boolean | null;
  pricing?: string | null;
}

const Index = () => {
  useVisitorTracking("/");
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error("Error fetching tools:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    let filtered = tools;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (pricingFilter !== "all") {
      filtered = filtered.filter(
        (tool) => tool.pricing?.toLowerCase() === pricingFilter
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.upvote_count || 0) - (a.upvote_count || 0);
        case "rating":
          return (b.average_rating || 0) - (a.average_rating || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return 0;
      }
    });

    // Featured tools first
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    setFilteredTools(filtered);
  }, [tools, selectedCategory, searchQuery, sortBy, pricingFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(262,83%,58%,0.1),transparent_50%)]" />

        <div className="container mx-auto text-center space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-4 animate-fade-in">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Discover the future of AI
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gradient mb-6 animate-slide-up">
              Discover AI Tools
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in">
              Your curated directory of the best AI tools for every task.
              <span className="text-primary font-medium">
                {" "}
                Boost your productivity
              </span>{" "}
              with cutting-edge AI.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <SubmitToolForm />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <AdvancedFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              pricingFilter={pricingFilter}
              onPricingChange={setPricingFilter}
            />
          </motion.div>
        </div>
      </section>

      {/* Filters and Tools */}
      <section className="pb-20 px-4">
        <div className="container mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground animate-pulse">
                  Discovering amazing AI tools...
                </p>
              </div>
            </div>
          ) : filteredTools.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary/10 flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gradient">
                No tools found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search or filters to discover more AI tools.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-primary">
                    {filteredTools.length}
                  </span>{" "}
                  tools
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <ToolCard {...tool} index={index} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <NewsletterSignup />
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
