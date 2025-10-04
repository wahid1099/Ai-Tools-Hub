import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, TrendingUp, Calendar, Globe } from "lucide-react";

interface VisitorData {
  visitor_ip: string;
  page_path: string;
  visited_at: string;
  user_agent: string;
  referrer: string | null;
}

export const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    thisWeekVisits: 0,
    thisMonthVisits: 0,
  });
  const [recentVisitors, setRecentVisitors] = useState<VisitorData[]>([]);

  useEffect(() => {
    fetchAnalytics();
    fetchRecentVisitors();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      // Total visits
      const { count: totalCount } = await supabase
        .from("page_visits")
        .select("*", { count: "exact", head: true });

      // Unique visitors (distinct IPs)
      const { data: uniqueIPs } = await supabase
        .from("page_visits")
        .select("visitor_ip")
        .not("visitor_ip", "is", null);

      const uniqueVisitors = new Set(uniqueIPs?.map((v) => v.visitor_ip)).size;

      // Today's visits
      const { count: todayCount } = await supabase
        .from("page_visits")
        .select("*", { count: "exact", head: true })
        .gte("visited_at", today.toISOString());

      // This week's visits
      const { count: weekCount } = await supabase
        .from("page_visits")
        .select("*", { count: "exact", head: true })
        .gte("visited_at", weekAgo.toISOString());

      // This month's visits
      const { count: monthCount } = await supabase
        .from("page_visits")
        .select("*", { count: "exact", head: true })
        .gte("visited_at", monthAgo.toISOString());

      setStats({
        totalVisits: totalCount || 0,
        uniqueVisitors,
        todayVisits: todayCount || 0,
        thisWeekVisits: weekCount || 0,
        thisMonthVisits: monthCount || 0,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchRecentVisitors = async () => {
    try {
      const { data } = await supabase
        .from("page_visits")
        .select("visitor_ip, page_path, visited_at, user_agent, referrer")
        .order("visited_at", { ascending: false })
        .limit(10);

      setRecentVisitors(data || []);
    } catch (error) {
      console.error("Error fetching recent visitors:", error);
    }
  };

  const statCards = [
    {
      title: "Total Visits",
      value: stats.totalVisits,
      icon: Eye,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Unique Visitors",
      value: stats.uniqueVisitors,
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Today",
      value: stats.todayVisits,
      icon: Calendar,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "This Week",
      value: stats.thisWeekVisits,
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getBrowserFromUserAgent = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown";
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {statCards.map((stat, index) => (
          <Card
            key={stat.title}
            className="p-6 hover-lift glass-effect animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gradient">{stat.value}</p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg animate-glow`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 glass-effect animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Visitors</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentVisitors.map((visitor, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">
                    {visitor.visitor_ip || "Unknown"}
                  </TableCell>
                  <TableCell>{visitor.page_path}</TableCell>
                  <TableCell>
                    {getBrowserFromUserAgent(visitor.user_agent)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {visitor.referrer || "Direct"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(visitor.visited_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
