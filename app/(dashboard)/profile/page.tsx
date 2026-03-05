"use client"

import { auth } from "@/auth"
import { ProfileForm } from "@/components/profile/profile-form"
import { PasswordForm } from "@/components/profile/password-form"
import { AccountActions } from "@/components/profile/account-actions"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { User, Lock, ShieldAlert, CreditCard } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const tabItems = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "danger", label: "Danger Zone", icon: ShieldAlert },
]

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const [activeTab, setActiveTab] = useState("general")

    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading profile...</div>
    }

    if (!session?.user) {
        return null
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto p-6">
            <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:w-64 flex-shrink-0 space-y-2"
            >
                <div className="mb-6 px-4">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground text-sm">Manage your account</p>
                </div>
                <nav className="space-y-1">
                    {tabItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 px-4 py-6 text-base font-medium transition-all hover:translate-x-1",
                                activeTab === item.id && "bg-secondary shadow-sm"
                            )}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </motion.aside>

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1"
            >
                <div className="space-y-6">
                    {activeTab === "general" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle>General Information</CardTitle>
                                    <CardDescription>Update your public profile details.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ProfileForm user={session.user} />
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === "security" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle>Security</CardTitle>
                                    <CardDescription>Manage your password and security settings.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PasswordForm user={session.user} />
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === "danger" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-destructive/10 shadow-md bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                    <CardDescription>Irreversible actions for your account.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AccountActions />
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </motion.main>
        </div>
    )
}
