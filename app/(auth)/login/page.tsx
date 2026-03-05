'use client'

import { useActionState, useState } from 'react'
import { authenticate } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined)
    const [loginType, setLoginType] = useState<"USER" | "PEOPLE">("USER")

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-background to-background p-4 dark:from-sky-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 50, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-none shadow-2xl bg-card/70 backdrop-blur-xl ring-1 ring-white/20 dark:ring-white/10">
                    <CardHeader className="space-y-1 text-center pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                Welcome back
                            </CardTitle>
                        </motion.div>
                        <CardDescription className="text-base">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="USER" className="w-full mb-6" onValueChange={(v) => setLoginType(v as any)}>
                            <TabsList className="grid w-full grid-cols-2 h-10">
                                <TabsTrigger value="USER">Admin (Owner)</TabsTrigger>
                                <TabsTrigger value="PEOPLE">Employee (Staff)</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <form action={dispatch} className="grid gap-5">
                            <input type="hidden" name="loginType" value={loginType} />

                            <div className="grid gap-2 group">
                                <Label htmlFor="email" className="group-focus-within:text-primary transition-colors">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={loginType === "USER" ? "admin@company.com" : "employee@company.com"}
                                    required
                                    className="bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300 hover:bg-background/80"
                                />
                            </div>
                            <div className="grid gap-2 group">
                                <Label htmlFor="password" className="group-focus-within:text-primary transition-colors">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300 hover:bg-background/80"
                                />
                            </div>
                            <Button className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing into {loginType === "USER" ? "Admin" : "Staff"}...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                    className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center font-medium border border-destructive/20"
                                >
                                    {errorMessage}
                                </motion.div>
                            )}
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-4">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted-foreground/20" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background/0 px-2 text-muted-foreground/70 backdrop-blur-md">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary hover:text-primary/80 font-semibold hover:underline underline-offset-4 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
