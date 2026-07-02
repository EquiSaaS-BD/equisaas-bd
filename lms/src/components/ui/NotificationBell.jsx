import React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const NotificationBell = ({ hasUnread = false, onClick, className, label = "Announcements" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/85 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:text-slate-900",
        className
      )}
    >
      <Bell className="h-4 w-4" />
      {hasUnread && (
        <>
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-red-500/35 animate-ping" />
        </>
      )}
    </button>
  );
};

export default NotificationBell;
