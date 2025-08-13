"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, Briefcase, MessageSquare, Target, Settings, BookOpen, TrendingUp } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/resume-analyzer", label: "Resume Analyzer", icon: FileText },
  { href: "/dashboard/career-match", label: "Career Match", icon: Briefcase },
  { href: "/dashboard/learning-roadmap", label: "Learning Roadmap", icon: BookOpen },
  { href: "/dashboard/mock-interview", label: "Mock Interview", icon: MessageSquare },
  { href: "/dashboard/insights-trends", label: "Insights & Trends", icon: TrendingUp },
  { href: "/dashboard/progress-tracker", label: "Progress Tracker", icon: Target },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
