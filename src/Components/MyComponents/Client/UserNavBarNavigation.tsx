"use client";

import { Bell, Compass, LayoutDashboard, MessageSquare, SquarePlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserNavBarNavigationProps {
  readyToEdit: boolean;
  unreadNotifications: number;
  unreadRequests: number;
}

export const UserNavBarNavigation : React.FC<UserNavBarNavigationProps> = ({ readyToEdit, unreadNotifications, unreadRequests }) => {
  const pathname = usePathname();
  return (
    <div className="flex gap-8 justify-center items-center">
      <Link
        href="/dashboard"
        className={`group relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname == "/dashboard"
            ? "text-primary"
            : "text-muted-foreground"}`}
      >
        <LayoutDashboard size={24} />
        <span>Dashboard</span>
        {pathname === "/dashboard" && (
          <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
        )}
      </Link>
      <Link
        href="/explore"
        className={`group relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname == "/explore"
            ? "text-primary"
            : "text-muted-foreground"}`}
      >
        <Compass size={24} />
        <span>Explore</span>
        {pathname === "/explore" && (
          <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
        )}
      </Link>
      <Link
        href="/new-project"
        className={`group relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname == "/new-project"
            ? "text-primary"
            : "text-muted-foreground"}`}
      >
        <SquarePlus size={24} />
        <span>New Project</span>
        {pathname === "/new-project" && (
          <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
        )}
      </Link>
      <Link
        href="/notifications"
        className={`group relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname == "/notifications"
            ? "text-primary"
            : "text-muted-foreground"}`}
      >
        <Bell size={24} />
        <span>Notifications</span>
        {unreadNotifications > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {unreadNotifications}
          </span>
        )}
        {pathname === "/notifications" && (
          <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
        )}
      </Link>
      {readyToEdit && (
        <Link
          href="/requests"
          className={`group relative flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname == "/requests"
              ? "text-primary"
              : "text-muted-foreground"}`}
        >
          <MessageSquare size={24} />
          <span>Requests</span>
          {unreadRequests > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {unreadRequests}
            </span>
          )}
          {pathname === "/requests" && (
            <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
          )}
        </Link>
      )}
    </div>
  )
}