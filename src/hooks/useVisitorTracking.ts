import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVisitorTracking = (pagePath: string) => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get visitor IP from a service
        let visitorIp = null;
        try {
          const ipResponse = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipResponse.json();
          visitorIp = ipData.ip;
        } catch (ipError) {
          console.log("Could not fetch IP:", ipError);
        }

        // Check if this visitor has already been tracked today for this page
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: existingVisit } = await supabase
          .from("page_visits")
          .select("id")
          .eq("page_path", pagePath)
          .eq("visitor_ip", visitorIp)
          .gte("visited_at", today.toISOString())
          .single();

        // Only track if no visit exists for this IP today
        if (!existingVisit) {
          await supabase.from("page_visits").insert({
            page_path: pagePath,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
            visitor_ip: visitorIp,
          });
        }
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    };

    trackVisit();
  }, [pagePath]);
};
