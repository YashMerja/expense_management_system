"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState } from "react"

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordFormSchema>

interface PasswordFormProps {
    user: {
        email?: string | null
    }
}

export function PasswordForm({ user }: PasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: PasswordFormValues) {
        setIsLoading(true)

        const response = await fetch("/api/user/password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        const result = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            return toast.error("Error", {
                description: result.message || "Something went wrong.",
            })
        }

        setIsLoading(false)
        form.reset()
        toast.success("Success", {
            description: "Password updated successfully.",
        })
    }

    // If user is OAuth (no password), we should probably hide this form or show a message.
    // We can't easily detect if user has keycloak/oauth vs credentials just from session unless we pass provider info.
    // But usually password field in DB is null for OAuth.
    // The API will check it. But UI?
    // User prop has email. We don't have provider info in session by default unless we added it.
    // But we can try to change password, API will return "User not found or using OAuth".
    // Better UX: Pass `provider` to session?
    // Profile page: "Account managed by Google" if OAuth.
    // I'll leave as is for now, API handles edge cases.

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Changing..." : "Change Password"}
                </Button>
            </form>
        </Form>
    )
}
