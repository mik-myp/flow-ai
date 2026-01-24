"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { LogOut, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserData {
  user_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
}

export function NavUser() {
  const { isMobile } = useSidebar();

  const supabase = createClient();

  const router = useRouter();

  const [userData, setUserData] = useState<UserData>({
    user_name: null,
    email: null,
    avatar_url: null,
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("登出失败，请稍后再试。");
      return;
    }

    router.push("/login");
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, error } = await supabase.auth.getClaims();
        if (!error && data) {
          console.log(data.claims.user_metadata);
          setUserData(data.claims.user_metadata || {});
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [supabase.auth]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-4 w-44" />
                  </div>
                </div>
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={userData.avatar_url || undefined}
                      alt={userData.user_name || ""}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {userData.user_name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {userData.email}
                    </span>
                  </div>
                </>
              )}

              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userData.avatar_url || undefined}
                    alt={userData.user_name || ""}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userData.user_name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userData.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
