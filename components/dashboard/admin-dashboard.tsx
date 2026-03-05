"use client";

import { motion } from "framer-motion";
import {
    Activity,
    CreditCard,
    DollarSign,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { format } from "date-fns";
import { ContainerScroll } from "../ui/aceternity/container-scroll-animation";

interface AdminDashboardProps {
    stats: {
        totalExpense: number;
        totalIncome: number;
        balance: number;
        lastExpense: any;
        recentExpenses: any[];
    };
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function AdminDashboard({ stats }: AdminDashboardProps) {
    const chartData = [
        {
            name: "Income",
            total: stats.totalIncome,
        },
        // We can add more dummy data or projected data if needed for a better "Area" visual
        // For now, let's just show the current month as a point, effectively bar-like but in Area
        {
            name: "Expenses",
            total: stats.totalExpense,
        },
        {
            name: "Balance",
            total: stats.balance,
        },
    ];

    // Better dummy data for the chart to look nice (Area Chart usually needs time series)
    // Since we only have "Month Total", we might want to fake a trend or just use the totals as categories
    const chartDataCategories = [
        { name: "Income", value: stats.totalIncome, fill: "url(#colorIncome)" },
        { name: "Expense", value: stats.totalExpense, fill: "url(#colorExpense)" },
    ];

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col overflow-hidden">
                <ContainerScroll
                    titleComponent={
                        <>
                            <h1 className="text-4xl font-semibold text-black dark:text-white">
                                Admin Dashboard
                                <br />
                                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                                    Financial Overview
                                </span>
                            </h1>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 h-full bg-white dark:bg-zinc-900 rounded-2xl overflow-y-auto custom-scrollbar">
                        {/* Summary Cards inside the scroll container for impact */}
                        <Card className="bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Income</CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalIncome)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                    <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-rose-600 dark:text-rose-400">Total Expenses</CardTitle>
                                <CreditCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.totalExpense)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                    <ArrowDownRight className="h-4 w-4 text-rose-500 mr-1" />
                                    +4% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Current Balance</CardTitle>
                                <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.balance)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Available currently
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </ContainerScroll>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 px-4 md:px-8 pb-8">
                <motion.div
                    variants={item}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="col-span-4"
                >
                    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <CardTitle>Financial Overview</CardTitle>
                            <CardDescription>
                                Income vs Expenses for this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
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
                                        contentStyle={{
                                            backgroundColor: "var(--card)",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                        }}
                                        labelStyle={{ color: "var(--foreground)" }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="var(--primary)"
                                        fillOpacity={1}
                                        fill="url(#colorIncome)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    variants={item}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="col-span-3"
                >
                    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>
                                Latest expenses recorded across the system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 pr-2 custom-scrollbar max-h-[350px] overflow-y-auto">
                                {stats.recentExpenses.map((expense, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between group p-3 rounded-xl hover:bg-muted/50 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                                {expense.category?.categoryName?.substring(0, 2).toUpperCase() || "EX"}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                                    {expense.description || "Expense"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(new Date(expense.expenseDate), "MMM dd, yyyy")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-rose-500">
                                            -
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(Number(expense.amount))}
                                        </div>
                                    </div>
                                ))}
                                {stats.recentExpenses.length === 0 && (
                                    <div className="text-center text-muted-foreground py-8">
                                        No recent activity
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
