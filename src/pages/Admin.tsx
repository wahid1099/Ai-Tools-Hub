import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search, Filter } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { SubmissionsManagement } from "@/components/admin/SubmissionsManagement";
import { BlogManagement } from "@/components/admin/BlogManagement";

interface Tool {
  id: string;
  name: string;
  description: string;
  category:
    | "chatbot"
    | "image"
    | "video"
    | "audio"
    | "code"
    | "productivity"
    | "writing"
    | "research"
    | "other";
  link: string;
  logo_url?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category:
      | "chatbot"
      | "image"
      | "video"
      | "audio"
      | "code"
      | "productivity"
      | "writing"
      | "research"
      | "other";
    link: string;
    logo_url: string;
  }>({
    name: "",
    description: "",
    category: "other",
    link: "",
    logo_url: "",
  });

  const checkAuth = async () => {
    if (adminLoading) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    if (!isAdmin) {
      toast.error("You don't have admin access");
      navigate("/");
    }
  };

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
    checkAuth();
  }, [isAdmin, adminLoading, checkAuth]);

  useEffect(() => {
    if (isAdmin) {
      fetchTools();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = tools;

    if (searchQuery) {
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((tool) => tool.category === categoryFilter);
    }

    setFilteredTools(filtered);
  }, [tools, searchQuery, categoryFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTool) {
        const { error } = await supabase
          .from("tools")
          .update(formData)
          .eq("id", editingTool.id);

        if (error) throw error;
        toast.success("Tool updated successfully!");
      } else {
        const { error } = await supabase.from("tools").insert([formData]);

        if (error) throw error;
        toast.success("Tool added successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTools();
    } catch (error: any) {
      toast.error(error.message || "Error saving tool");
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      category: tool.category,
      link: tool.link,
      logo_url: tool.logo_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;

    try {
      const { error } = await supabase.from("tools").delete().eq("id", id);

      if (error) throw error;
      toast.success("Tool deleted successfully!");
      fetchTools();
    } catch (error: any) {
      toast.error(error.message || "Error deleting tool");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "other",
      link: "",
      logo_url: "",
    });
    setEditingTool(null);
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your AI tools directory
          </p>
        </div>

        <AnalyticsDashboard />

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Tools</h2>
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tool
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingTool ? "Edit Tool" : "Add New Tool"}
                      </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Tool Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              category: value as typeof formData.category,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chatbot">Chatbot</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="code">Code</SelectItem>
                            <SelectItem value="productivity">
                              Productivity
                            </SelectItem>
                            <SelectItem value="writing">Writing</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="link">Tool Link</Label>
                        <Input
                          id="link"
                          type="url"
                          value={formData.link}
                          onChange={(e) =>
                            setFormData({ ...formData, link: e.target.value })
                          }
                          placeholder="https://example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logo_url">Logo URL (optional)</Label>
                        <Input
                          id="logo_url"
                          type="url"
                          value={formData.logo_url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              logo_url: e.target.value,
                            })
                          }
                          placeholder="https://example.com/logo.png"
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        {editingTool ? "Update Tool" : "Add Tool"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search and Filter */}
              <Card className="p-4 glass-effect">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search tools by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2 md:w-64">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="chatbot">Chatbot</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                        <SelectItem value="productivity">
                          Productivity
                        </SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(searchQuery || categoryFilter !== "all") && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Showing {filteredTools.length} of {tools.length} tools
                  </div>
                )}
              </Card>
            </div>

            {tools.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No tools yet. Add your first tool!
                </p>
              </Card>
            ) : filteredTools.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No tools match your search criteria.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredTools.map((tool) => (
                  <Card key={tool.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {tool.logo_url ? (
                          <img
                            src={tool.logo_url}
                            alt={tool.name}
                            className="w-16 h-16 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              {tool.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Category: {tool.category}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {tool.description}
                          </p>
                          <a
                            href={tool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-2 inline-block"
                          >
                            {tool.link}
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(tool)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(tool.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsManagement />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
