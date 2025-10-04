import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Sparkles,
  LogOut,
  Bookmark,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-border/50 animate-fade-in">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group hover-lift">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg animate-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">AI Tools Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hover-lift">
            <Link to="/blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild className="hover-lift">
                <Link to="/bookmarks" className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Bookmarks</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="hover-lift">
                <Link to="/admin" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover-lift"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button asChild className="hover-lift animate-glow">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
