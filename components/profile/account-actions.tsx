"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import { signOut, useSession } from "next-auth/react"

export function AccountActions() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const { data: session } = useSession()

    const isEmployee = session?.user?.accountType === "PEOPLE" || session?.user?.role === "EMPLOYEE"

    async function onLogoutAll() {
        setIsLoggingOut(true)
        try {
            const res = await fetch("/api/auth/logout-all", { method: "POST" })
            if (!res.ok) throw new Error()
            toast.success("Logged out", {
                description: "You have been logged out from all devices.",
            })
            // Force local logout
            signOut({ callbackUrl: "/login" })
        } catch (error) {
            toast.error("Error", {
                description: "Failed to logout from all devices.",
            })
        } finally {
            setIsLoggingOut(false)
        }
    }

    async function onDeleteAccount() {
        setIsDeleting(true)
        try {
            const res = await fetch("/api/user/account", { method: "DELETE" })
            if (!res.ok) throw new Error()
            toast.success("Account deleted", {
                description: "Your account has been permanently deleted.",
            })
            signOut({ callbackUrl: "/login" })
        } catch (error) {
            toast.error("Error", {
                description: "Failed to delete account.",
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                    Sign out from all devices that are currently logged into your account.
                </p>
                <Button variant="outline" onClick={onLogoutAll} disabled={isLoggingOut} className="w-fit">
                    {isLoggingOut ? "Logging out..." : "Logout from all devices"}
                </Button>
            </div>

            {
                !isEmployee && (
                    <div className="flex flex-col gap-4 mt-8">
                        <p className="text-sm text-muted-foreground">
                            Permanently remove your account and all of its data. This action cannot be undone.
                        </p>
                        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="w-fit">Delete Account</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={onDeleteAccount} disabled={isDeleting}>
                                        {isDeleting ? "Deleting..." : "Delete Account"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            }
        </div >
    )
}
