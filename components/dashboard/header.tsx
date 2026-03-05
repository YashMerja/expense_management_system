"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { NotificationDropdown } from "@/components/global/notification-dropdown";

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="lg:hidden">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <LayoutDashboard className="h-6 w-6" />
                    <span className="">Expense Manager</span>
                </Link>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <NotificationDropdown />
                <ModeToggle />
            </div>
        </header>
    );
}
