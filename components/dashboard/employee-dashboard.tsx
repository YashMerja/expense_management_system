"use client";

import { motion } from "framer-motion";
import {
    Activity,
    CreditCard,
    TrendingUp,
    Calendar,
    Plus,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface EmployeeDashboardProps {
    stats: {
        todayExpenseTotal?: number;
        monthExpenseTotal?: number;
        expenseCount?: number;
        lastExpense: any;
        recentExpenses: any[];
    };
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function EmployeeDashboard({ stats }: EmployeeDashboardProps) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                    >
                        Dashboard
                    </motion.h2>
                    <p className="text-muted-foreground">
                        Manage your expenses and view your summaries.
                    </p>
                </div>
                <Button onClick={() => router.push("/expenses")} className="shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Add Expense
                </Button>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                <motion.div variants={item}>
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500 bg-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Today's Expenses
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-teal-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.todayExpenseTotal || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(), "MMM dd, yyyy")}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                This Month
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats.monthExpenseTotal || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Cumulative total
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 bg-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Records
                            </CardTitle>
                            <Activity className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {stats.expenseCount || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Submitted records
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-rose-500 bg-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Last Expense
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold truncate text-foreground" title={stats.lastExpense ? `${stats.lastExpense.amount}` : "0"}>
                                {stats.lastExpense
                                    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(stats.lastExpense.amount))
                                    : "$0.00"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {stats.lastExpense ? stats.lastExpense.description : "No recent activity"}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2"
            >
                <Card className="col-span-2 border shadow-sm bg-card">
                    <CardHeader>
                        <CardTitle>Recent History</CardTitle>
                        <CardDescription>
                            Your recently submitted expenses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentExpenses.map((expense, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                            {expense.category?.categoryName?.substring(0, 2).toUpperCase() || "?"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{expense.description}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(expense.expenseDate), "PPP")}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-rose-500">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(expense.amount))}
                                    </div>
                                </div>
                            ))}
                            {stats.recentExpenses.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground">
                                    You haven't added any expenses yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
