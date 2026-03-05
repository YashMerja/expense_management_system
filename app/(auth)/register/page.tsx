'use client'

import { useActionState, useState } from 'react'
import { register } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
    const [state, dispatch, isPending] = useActionState(register, undefined)
    const [registerType, setRegisterType] = useState<"USER" | "PEOPLE">("USER")

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-background to-background p-4 dark:from-sky-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -50, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-teal-500/20 blur-3xl"
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
                            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-600">
                                Create an account
                            </CardTitle>
                        </motion.div>
                        <CardDescription className="text-base">
                            Enter your information to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="USER" className="w-full mb-6" onValueChange={(v) => setRegisterType(v as any)}>
                            <TabsList className="grid w-full grid-cols-2 h-10">
                                <TabsTrigger value="USER">Admin (Owner)</TabsTrigger>
                                <TabsTrigger value="PEOPLE">Employee (Staff)</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <form action={dispatch} className="grid gap-5">
                            <input type="hidden" name="registerType" value={registerType} />

                            <div className="grid gap-2 group">
                                <Label htmlFor="name" className="group-focus-within:text-teal-500 transition-colors">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    required
                                    className="bg-background/50 border-muted-foreground/20 focus:border-teal-500 transition-all duration-300 hover:bg-background/80"
                                />
                            </div>
                            <div className="grid gap-2 group">
                                <Label htmlFor="email" className="group-focus-within:text-teal-500 transition-colors">
                                    {registerType === "USER" ? "Email" : "Employee Email"}
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="bg-background/50 border-muted-foreground/20 focus:border-teal-500 transition-all duration-300 hover:bg-background/80"
                                />
                            </div>

                            {registerType === "PEOPLE" && (
                                <div className="grid gap-2 group">
                                    <Label htmlFor="adminEmail" className="group-focus-within:text-teal-500 transition-colors">Admin/Owner Email</Label>
                                    <Input
                                        id="adminEmail"
                                        name="adminEmail"
                                        type="email"
                                        placeholder="admin@company.com"
                                        required
                                        className="bg-background/50 border-muted-foreground/20 focus:border-teal-500 transition-all duration-300 hover:bg-background/80"
                                    />
                                    <p className="text-xs text-muted-foreground">We need this to link you to your employer.</p>
                                </div>
                            )}

                            <div className="grid gap-2 group">
                                <Label htmlFor="password" className="group-focus-within:text-teal-500 transition-colors">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="bg-background/50 border-muted-foreground/20 focus:border-teal-500 transition-all duration-300 hover:bg-background/80"
                                />
                            </div>
                            <Button className="w-full h-11 text-base shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 border-none" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating {registerType === "USER" ? "Admin" : "Employee"}...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <UserPlus className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            {state && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                    className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center font-medium border border-destructive/20"
                                >
                                    {state}
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
                                    Already have an account?
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                            <Link href="/login" className="text-teal-600 hover:text-teal-500 font-semibold hover:underline underline-offset-4 transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
