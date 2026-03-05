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
import { FileUpload } from "@/components/ui/file-upload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSession } from "next-auth/react"

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    // email is read-only usually
    // image url
    image: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
    user: {
        id?: string
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const { update } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.name || "",
            image: user?.image || "",
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true)

        const response = await fetch("/api/user/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            setIsLoading(false)
            return toast.error("Something went wrong.", {
                description: "Your profile was not updated. Please try again.",
            })
        }

        // Update session
        await update({ name: data.name, image: data.image })

        setIsLoading(false)
        toast.success("Profile updated", {
            description: "Your profile has been updated successfully.",
        })
        router.refresh()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={form.getValues("image") || user.image || ""} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    {/* Simple URL input for now, or assume separate upload logic. Plan said "Profile picture (URL or uploaded image)". implementation plan "Upload/url". implementing URL input. */}
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input value={user.email || ""} disabled readOnly />
                        </FormControl>
                        <FormDescription>
                            Your email address is managed by the administrator.
                        </FormDescription>
                    </FormItem>
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                            <Input value={user.role || ""} disabled readOnly />
                        </FormControl>
                        <FormDescription>
                            Account permissions role.
                        </FormDescription>
                    </FormItem>
                </div>
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <FormControl>
                                <FileUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    onRemove={() => field.onChange("")}
                                    folder="users/profile"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update profile"}
                </Button>
            </form>
        </Form>
    )
}
