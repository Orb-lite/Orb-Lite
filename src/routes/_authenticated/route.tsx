import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const ALLOWED_EMAILS = ["ventas@orb-lite.com", "isaacgomezestrada60@gmail.com"];

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      throw redirect({ to: "/auth" });
    }
    const email = (data.user.email ?? "").toLowerCase().trim();
    if (!ALLOWED_EMAILS.includes(email)) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});
