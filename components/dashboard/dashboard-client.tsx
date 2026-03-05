"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Activity,
    CreditCard,
    DollarSign,
    Users,
    TrendingUp,
    TrendingDown,
    Wallet,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { format } from "date-fns";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 50 },
    },
};

interface DashboardClientProps {
    stats: {
        totalExpense: number;
        totalIncome: number;
        balance: number;
        lastExpense: any;
        todayExpenseTotal?: number;
        monthExpenseTotal?: number;
        expenseCount?: number;
        recentExpenses: any[];
    };
    role?: "ADMIN" | "USER" | "EMPLOYEE" | "PEOPLE" | string; // Add role prop
}

export function DashboardClient({ stats, role }: DashboardClientProps) {
    const chartData = [
        {
            name: "Income",
            total: stats.totalIncome,
        },
        {
            name: "Expense",
            total: stats.totalExpense,
        },
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 space-y-8 p-8 pt-6"
        >
            <div className="flex items-center justify-between space-y-2">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                >
                    Dashboard
                </motion.h2>
            </div>

            <motion.div
                variants={container}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                {/* ADMIN / USER WIDGETS */}
                {(role === "USER" || role === "ADMIN" || !role) && (
                    <>
                        <motion.div variants={item}>
                            <Card className="hover:shadow-xl transition-all duration-300 border bg-card/50 backdrop-blur-sm group hover:-translate-y-1 hover:bg-card/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        Total Income
                                    </CardTitle>
                                    <div className="p-2 rounded-full bg-background/50 group-hover:bg-background transition-colors text-emerald-500">
                                        <DollarSign className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left text-foreground">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalIncome)}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                        <span className="text-emerald-500 font-medium mr-1">This Month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="hover:shadow-xl transition-all duration-300 border bg-card/50 backdrop-blur-sm group hover:-translate-y-1 hover:bg-card/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        Total Expenses
                                    </CardTitle>
                                    <div className="p-2 rounded-full bg-background/50 group-hover:bg-background transition-colors text-rose-500">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left text-foreground">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalExpense)}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                        <span className="text-rose-500 font-medium mr-1">This Month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="hover:shadow-xl transition-all duration-300 border bg-card/50 backdrop-blur-sm group hover:-translate-y-1 hover:bg-card/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        Balance
                                    </CardTitle>
                                    <div className="p-2 rounded-full bg-background/50 group-hover:bg-background transition-colors text-blue-500">
                                        <Wallet className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left text-foreground">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.balance)}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                        <span className="text-blue-500 font-medium mr-1">Current</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div variants={item}>
                            {/* Admin - Recent Activity Count */}
                            <Card className="hover:shadow-xl transition-all duration-300 border bg-card/50 backdrop-blur-sm group hover:-translate-y-1 hover:bg-card/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        Recent Activity
                                    </CardTitle>
                                    <div className="p-2 rounded-full bg-background/50 group-hover:bg-background transition-colors text-orange-500">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left text-foreground">
                                        {stats.recentExpenses.length}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                        <span className="text-orange-500 font-medium mr-1">Transactions</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}

                {/* EMPLOYEE WIDGETS */}
                {(role === "EMPLOYEE" || role === "PEOPLE") && (
                    <>
                        {/* 1. Today's Expenses */}
                        <motion.div variants={item}>
                            <Card className="hover:shadow-xl transition-all duration-300 border bg-card/50 backdrop-blur-sm group hover:-translate-y-1 hover:bg-card/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        Today&apos;s Expenses
                                    </CardTitle>
                                    <div className="p-2 rounded-full bg-background/50 group-hover:bg-background transition-colors text-teal-500">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left text-foreground">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.todayExpenseTotal || 0)}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                        <span className="text-teal-500 font-medium mr-1">Today</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 2. This Month Total */}
                        <motion.div variants={item}>
                            <Card className="hover:shadow-xl transition-all duration-300 border bg-card/50 backdrop-blur-sm group hover:-translate-y-1 hover:bg-card/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        This Month Total
                                    </CardTitle>
                                    <div className="p-2 rounded-full bg-background/50 group-hover:bg-background transition-colors text-purple-500">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left text-foreground">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.monthExpenseTotal || 0)}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                        <span className="text-purple-500 font-medium mr-1">This Month</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 3. Expense Count */}
                        <motion.div variants={item}>
                            <Card className="hover:shadow-xl transition-all duration-300 border bg-card/50 backdrop-blur-sm group hover:-translate-y-1 hover:bg-card/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        Expense Count
                                    </CardTitle>
                                    <div className="p-2 rounded-full bg-background/50 group-hover:bg-background transition-colors text-orange-500">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left text-foreground">
                                        {stats.expenseCount || 0}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                        <span className="text-orange-500 font-medium mr-1">Total Records</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 4. Last Expense */}
                        <motion.div variants={item}>
                            <Card className="hover:shadow-xl transition-all duration-300 border bg-card/50 backdrop-blur-sm group hover:-translate-y-1 hover:bg-card/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                        Last Expense
                                    </CardTitle>
                                    <div className="p-2 rounded-full bg-background/50 group-hover:bg-background transition-colors text-rose-500">
                                        <TrendingDown className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left text-foreground">
                                        {stats.lastExpense
                                            ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(stats.lastExpense.amount))
                                            : "$0.00"}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                        <span className="text-rose-500 font-medium mr-1">
                                            {stats.lastExpense ? format(new Date(stats.lastExpense.expenseDate), "MMM dd") : "None"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}

            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                {
                    (role === "USER" || role === "ADMIN" || !role) && (
                        <motion.div variants={item} className="col-span-4">
                            <Card className="h-full border shadow-lg bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300">
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                    <CardDescription>
                                        Monthly Income vs Expenses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={chartData}>
                                            <XAxis
                                                dataKey="name"
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `$${value}`}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'var(--muted)' }}
                                                contentStyle={{
                                                    backgroundColor: 'var(--card)',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--foreground)'
                                                }}
                                            />
                                            <Bar
                                                dataKey="total"
                                                fill="currentColor"
                                                radius={[4, 4, 0, 0]}
                                                className="fill-primary"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                }

                <motion.div variants={item} className="col-span-3">
                    <Card className="h-full border shadow-lg bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>
                                Your latest expenses.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8 pr-4 custom-scrollbar">
                                {stats.recentExpenses.map((expense, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                            {expense.category?.categoryName?.substring(0, 2).toUpperCase() || "EX"}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors text-foreground">
                                                {expense.description || "Expense"}
                                            </p>
                                            <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
                                                {format(new Date(expense.expenseDate), "PPP")}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium group-hover:text-rose-500 transition-colors text-foreground">
                                            -
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(Number(expense.amount))}
                                        </div>
                                    </div>
                                ))}
                                {stats.recentExpenses.length === 0 && (
                                    <div className="text-center text-muted-foreground">No recent expenses</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div >
        </motion.div >
    );
}
