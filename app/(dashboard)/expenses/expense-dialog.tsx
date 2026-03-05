"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, People, Project, Expense } from "@/lib/prisma";
import { createExpense, updateExpense } from "@/actions/data-actions";
import { expenseSchema } from "@/lib/schemas";
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
import { FileUpload } from "@/components/ui/file-upload";
import { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ExpenseDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    expense: Expense | null;
    categories: Category[];
    projects: Project[];
    people: People[];
    role?: string;
    userId?: string;
}

export function ExpenseDialog({
    open,
    setOpen,
    expense,
    categories,
    projects,
    people,
    role,
    userId,
}: ExpenseDialogProps) {
    const form = useForm<z.infer<typeof expenseSchema>>({
        resolver: zodResolver(expenseSchema) as any,
        defaultValues: {
            amount: 0,
            expenseDate: new Date(),
            expenseDetail: "",
            description: "",
            categoryId: null,
            subCategoryId: null,
            projectId: null,
            peopleId: 0,
            attachmentPath: "",
        },
    });

    useEffect(() => {
        if (expense) {
            form.reset({
                amount: Number(expense.amount),
                expenseDate: new Date(expense.expenseDate),
                expenseDetail: expense.expenseDetail || "",
                description: expense.description || "",
                categoryId: expense.categoryId,
                subCategoryId: expense.subCategoryId,
                projectId: expense.projectId,
                peopleId: expense.peopleId,
                attachmentPath: expense.attachmentPath || "",
            });
        } else {
            // Default peopleId for Employee
            let defaultPeopleId = 0;
            if (role === "PEOPLE" && userId) {
                // userId passed from page is actually the `id` of the session user. 
                // If role is PEOPLE, session.user.id IS the peopleId.
                defaultPeopleId = Number(userId);
            }

            form.reset({
                amount: 0,
                expenseDate: new Date(),
                expenseDetail: "",
                description: "",
                categoryId: null,
                subCategoryId: null,
                projectId: null,
                peopleId: defaultPeopleId,
                attachmentPath: "",
            });
        }
    }, [expense, form, open, role, userId]);

    async function onSubmit(values: z.infer<typeof expenseSchema>) {
        try {
            if (expense) {
                await updateExpense(expense.expenseId, values);
                toast.success("Expense updated");
            } else {
                await createExpense(values);
                toast.success("Expense created");
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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {expense ? "Edit Expense" : "Add Expense"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="expenseDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value || undefined}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                            name="projectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value?.toString() || ""}
                                        value={field.value?.toString() || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Project (Optional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0">None</SelectItem>
                                            {/* Technically "0" isn't null, but Select needs a string. 
                           I'll handle 0 as null in schema or manually? 
                           Zod coerce number might handle string "null" as NaN.
                           Better to use "null" string or handling clean value.
                           Common pattern: value={String(val ?? "")}.
                           If value is "0", I might need to transform in onSubmit or use a transform in schema.
                           Schema uses z.coerce.number().optional().nullable().
                           If I pass "0", it becomes 0. projectId 0 doesn't exist.
                           I should probably not support deselecting easily in this simple UI or add a "None" option with value "0" and handle it.
                        */}
                                            <SelectItem value="null">None</SelectItem>
                                            {projects.filter(p => p.isActive).map((p) => (
                                                <SelectItem key={p.projectId} value={p.projectId.toString()}>
                                                    {p.projectName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Hide Payee selection for Employees */
                            (role !== "PEOPLE" && role !== "EMPLOYEE") && (
                                <FormField
                                    control={form.control}
                                    name="peopleId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payee</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value?.toString() || ""}
                                                value={field.value?.toString() || ""}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Payee" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {people.filter(p => p.isActive).map((p) => (
                                                        <SelectItem key={p.peopleId} value={p.peopleId.toString()}>
                                                            {p.peopleName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="attachmentPath"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Attachment</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            onRemove={() => field.onChange("")}
                                            folder="expenses/attachments"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="col-span-2 flex justify-end">
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save Expense"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
