"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Notification {
    notificationId: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    referenceId?: number;
    referenceType?: string;
    created: string;
}

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering item click
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: "PATCH",
            });

            if (res.ok) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.notificationId === id ? { ...n, isRead: true } : n
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read if not already
        if (!notification.isRead) {
            await markAsRead(notification.notificationId, { stopPropagation: () => { } } as any);
        }

        setIsOpen(false);

        // Redirect based on type
        if (notification.referenceType === "expense") {
            router.push(`/expenses`); // Or specific ID if implemented
        } else if (notification.referenceType === "income") {
            router.push(`/incomes`);
        } else if (notification.referenceType === "project") {
            router.push(`/projects`);
        } else if (notification.referenceType === "budget") {
            router.push(`/budgets`);
        } else if (notification.referenceType === "project-start" || notification.type === "calendar") {
            router.push(`/projects`);
        } else if (notification.referenceType === "people" || notification.type === "activity") {
            router.push(`/people`);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs bg-red-500 hover:bg-red-600"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px]">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {unreadCount} unread
                        </span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.notificationId}
                                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.isRead ? "bg-muted/50" : ""
                                    }`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex w-full justify-between items-start gap-2">
                                    <span className="font-semibold text-sm">
                                        {notification.title}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(new Date(notification.created), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                        {!notification.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-primary hover:text-primary/80"
                                                onClick={(e) => markAsRead(notification.notificationId, e)}
                                                title="Mark as read"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                            <Button
                                variant="outline"
                                className="w-full text-xs h-8"
                                onClick={async () => {
                                    // Optimistic update
                                    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.notificationId);
                                    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                                    setUnreadCount(0);

                                    // Actual updates
                                    for (const id of unreadIds) {
                                        await fetch(`/api/notifications/${id}`, { method: "PATCH" });
                                    }
                                }}
                            >
                                Mark all as read
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
