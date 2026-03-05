"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, CreditCard, DollarSign, Tags, Briefcase, PieChart, Calendar as CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
    session: any;
}

export function Sidebar({ session }: SidebarProps) {
    const pathname = usePathname();
    const isAdmin = session?.user?.accountType === "USER" || !session?.user?.accountType;

    const routes = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/calendar", label: "Calendar", icon: CalendarIcon },
        { href: "/profile", label: "Profile", icon: User },
        ...(isAdmin ? [{ href: "/people", label: "People", icon: User }] : []),
        { href: "/expenses", label: "Expenses", icon: CreditCard },
        { href: "/incomes", label: "Incomes", icon: DollarSign },
        { href: "/categories", label: "Categories", icon: Tags },
        { href: "/subcategories", label: "Sub Categories", icon: Tags },
        { href: "/projects", label: "Projects", icon: Briefcase },
        ...(isAdmin ? [{ href: "/budgets", label: "Budgets", icon: PieChart }] : []),
    ];

    return (
        <aside className="hidden w-64 flex-col border-r border-border/40 bg-background/60 backdrop-blur-xl lg:flex fixed inset-y-0 h-full z-50 shadow-sm">
            <div className="flex h-14 items-center border-b border-border/40 px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80">
                    <div className="p-1 rounded-lg bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                        <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Expense Manager</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary hover:bg-primary/10 hover:shadow-sm",
                                pathname === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <route.icon className="h-4 w-4" />
                            {route.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t border-border/40 bg-muted/10">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                    <Avatar className="h-9 w-9 border border-border/50 transition-transform group-hover:scale-105">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">{session?.user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{session?.user?.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{session?.user?.role}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
