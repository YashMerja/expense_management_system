"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Budget } from "@/lib/prisma";
import { createBudget, updateBudget } from "@/actions/data-actions";
import { budgetSchema } from "@/lib/schemas";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface BudgetDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    budget: Budget | null;
    categories: Category[];
}

const MONTHS = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

export function BudgetDialog({
    open,
    setOpen,
    budget,
    categories,
}: BudgetDialogProps) {
    const form = useForm<z.infer<typeof budgetSchema>>({
        resolver: zodResolver(budgetSchema) as any,
        defaultValues: {
            amount: 0,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            categoryId: null,
        },
    });

    useEffect(() => {
        if (budget) {
            form.reset({
                amount: Number(budget.amount),
                month: budget.month,
                year: budget.year,
                categoryId: budget.categoryId,
            });
        } else {
            form.reset({
                amount: 0,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                categoryId: null,
            });
        }
    }, [budget, form, open]);

    async function onSubmit(values: z.infer<typeof budgetSchema>) {
        try {
            if (budget) {
                await updateBudget(budget.budgetId, values);
                toast.success("Budget updated");
            } else {
                await createBudget(values);
                toast.success("Budget created");
            }
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {budget ? "Edit Budget" : "Add Budget"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Month</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(parseInt(val))}
                                            defaultValue={field.value.toString()}
                                            value={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Month" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {MONTHS.map((m) => (
                                                    <SelectItem key={m.value} value={m.value}>
                                                        {m.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value?.toString() || ""}
                                        value={field.value?.toString() || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.filter(c => c.isActive && c.isExpense).map((c) => (
                                                <SelectItem key={c.categoryId} value={c.categoryId.toString()}>
                                                    {c.categoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                            {form.formState.isSubmitting ? "Saving..." : "Save Budget"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
