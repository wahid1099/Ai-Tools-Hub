import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Clock } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  logo_url?: string;
  submitter_email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export const SubmissionsManagement = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("tool_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions((data || []) as Submission[]);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submission: Submission) => {
    try {
      // Add to tools table
      const { error: toolError } = await supabase.from("tools").insert({
        name: submission.name,
        description: submission.description,
        category: submission.category as any,
        link: submission.link,
        logo_url: submission.logo_url,
      });

      if (toolError) throw toolError;

      // Update submission status
      const { error: updateError } = await supabase
        .from("tool_submissions")
        .update({ 
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", submission.id);

      if (updateError) throw updateError;

      toast.success("Tool approved and added to directory!");
      fetchSubmissions();
    } catch (error: any) {
      toast.error(error.message || "Error approving submission");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tool_submissions")
        .update({ 
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("Submission rejected");
      fetchSubmissions();
    } catch (error: any) {
      toast.error(error.message || "Error rejecting submission");
    }
  };

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tool Submissions</h2>

      {submissions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No submissions yet</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {submission.logo_url ? (
                    <img
                      src={submission.logo_url}
                      alt={submission.name}
                      className="w-16 h-16 rounded-lg object-cover border border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {submission.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{submission.name}</h3>
                      <Badge variant={
                        submission.status === "pending" ? "secondary" :
                        submission.status === "approved" ? "default" : "destructive"
                      }>
                        {submission.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {submission.status === "approved" && <Check className="w-3 h-3 mr-1" />}
                        {submission.status === "rejected" && <X className="w-3 h-3 mr-1" />}
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Category: {submission.category}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {submission.description}
                    </p>
                    <a
                      href={submission.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {submission.link}
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted by: {submission.submitter_email}
                    </p>
                  </div>
                </div>

                {submission.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(submission)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(submission.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
