export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null;
          content: string;
          cover_image_url: string | null;
          created_at: string | null;
          excerpt: string | null;
          id: string;
          published: boolean | null;
          published_at: string | null;
          slug: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author_id?: string | null;
          content: string;
          cover_image_url?: string | null;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          published?: boolean | null;
          published_at?: string | null;
          slug: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string | null;
          content?: string;
          cover_image_url?: string | null;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          published?: boolean | null;
          published_at?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          created_at: string | null;
          id: string;
          tool_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          tool_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          tool_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          active: boolean | null;
          email: string;
          id: string;
          subscribed_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          email: string;
          id?: string;
          subscribed_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          email?: string;
          id?: string;
          subscribed_at?: string | null;
        };
        Relationships: [];
      };
      page_visits: {
        Row: {
          id: string;
          page_path: string;
          referrer: string | null;
          user_agent: string | null;
          visited_at: string | null;
          visitor_ip: string | null;
        };
        Insert: {
          id?: string;
          page_path: string;
          referrer?: string | null;
          user_agent?: string | null;
          visited_at?: string | null;
          visitor_ip?: string | null;
        };
        Update: {
          id?: string;
          page_path?: string;
          referrer?: string | null;
          user_agent?: string | null;
          visited_at?: string | null;
          visitor_ip?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          created_at: string | null;
          id: string;
          rating: number;
          review_text: string | null;
          tool_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          rating: number;
          review_text?: string | null;
          tool_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          rating?: number;
          review_text?: string | null;
          tool_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          }
        ];
      };
      tool_clicks: {
        Row: {
          clicked_at: string | null;
          id: string;
          tool_id: string;
          user_id: string | null;
        };
        Insert: {
          clicked_at?: string | null;
          id?: string;
          tool_id: string;
          user_id?: string | null;
        };
        Update: {
          clicked_at?: string | null;
          id?: string;
          tool_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tool_clicks_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          }
        ];
      };
      tool_submissions: {
        Row: {
          category: string;
          created_at: string | null;
          description: string;
          id: string;
          link: string;
          logo_url: string | null;
          name: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: string | null;
          submitter_email: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description: string;
          id?: string;
          link: string;
          logo_url?: string | null;
          name: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string | null;
          submitter_email?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string;
          id?: string;
          link?: string;
          logo_url?: string | null;
          name?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: string | null;
          submitter_email?: string | null;
        };
        Relationships: [];
      };
      tools: {
        Row: {
          affiliate_link: string | null;
          average_rating: number | null;
          category: Database["public"]["Enums"]["tool_category"];
          click_count: number | null;
          created_at: string | null;
          description: string;
          featured: boolean | null;
          features: string[] | null;
          id: string;
          link: string;
          logo_url: string | null;
          name: string;
          pricing: string | null;
          review_count: number | null;
          updated_at: string | null;
          upvote_count: number | null;
        };
        Insert: {
          affiliate_link?: string | null;
          average_rating?: number | null;
          category?: Database["public"]["Enums"]["tool_category"];
          click_count?: number | null;
          created_at?: string | null;
          description: string;
          featured?: boolean | null;
          features?: string[] | null;
          id?: string;
          link: string;
          logo_url?: string | null;
          name: string;
          pricing?: string | null;
          review_count?: number | null;
          updated_at?: string | null;
          upvote_count?: number | null;
        };
        Update: {
          affiliate_link?: string | null;
          average_rating?: number | null;
          category?: Database["public"]["Enums"]["tool_category"];
          click_count?: number | null;
          created_at?: string | null;
          description?: string;
          featured?: boolean | null;
          features?: string[] | null;
          id?: string;
          link?: string;
          logo_url?: string | null;
          name?: string;
          pricing?: string | null;
          review_count?: number | null;
          updated_at?: string | null;
          upvote_count?: number | null;
        };
        Relationships: [];
      };
      upvotes: {
        Row: {
          created_at: string | null;
          id: string;
          tool_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          tool_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          tool_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "upvotes_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          }
        ];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
      tool_category:
        | "chatbot"
        | "image"
        | "video"
        | "audio"
        | "code"
        | "productivity"
        | "writing"
        | "research"
        | "other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      tool_category: [
        "chatbot",
        "image",
        "video",
        "audio",
        "code",
        "productivity",
        "writing",
        "research",
        "other",
      ],
    },
  },
} as const;
