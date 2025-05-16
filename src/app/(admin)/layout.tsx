"use client";

import { useSidebar } from "@/context/SidebarContext";
import { withAuth } from "@/HOC/withAuth";
import useProfileQuery from "@/hooks/api/auth/useProfileQuery";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useAuthStore } from "@/stores/authStore";
import React, { useEffect } from "react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { setUser, token } = useAuthStore();
  const { data: profile } = useProfileQuery({ enabled: !!token });
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  useEffect(() => {
    if (profile?.data?.user) {
      setUser(profile.data.user);
    }
  }, [profile, setUser]);

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminLayout, {
  requiredRoles: ["admin", "owner"],
});
