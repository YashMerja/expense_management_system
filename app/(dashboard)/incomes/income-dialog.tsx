"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, People, Project, Income } from "@/lib/prisma";
import { createIncome, updateIncome } from "@/actions/data-actions";
import { incomeSchema } from "@/lib/schemas";
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

interface IncomeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    income: Income | null;
    categories: Category[];
    projects: Project[];
    people: People[];
    role?: string;
    userId?: string;
}

export function IncomeDialog({
    open,
    setOpen,
    income,
    categories,
    projects,
    people,
    role,
    userId,
}: IncomeDialogProps) {
    const form = useForm<z.infer<typeof incomeSchema>>({
        resolver: zodResolver(incomeSchema) as any,
        defaultValues: {
            amount: 0,
            incomeDate: new Date(),
            incomeDetail: "",
            description: "",
            categoryId: null,
            subCategoryId: null,
            projectId: null,
            peopleId: 0,
            attachmentPath: "",
        },
    });

    useEffect(() => {
        if (income) {
            form.reset({
                amount: Number(income.amount),
                incomeDate: new Date(income.incomeDate),
                incomeDetail: income.incomeDetail || "",
                description: income.description || "",
                categoryId: income.categoryId,
                subCategoryId: income.subCategoryId,
                projectId: income.projectId,
                peopleId: income.peopleId,
                attachmentPath: income.attachmentPath || "",
            });
        } else {
            // Default peopleId for Employee
            let defaultPeopleId = 0;
            if (role === "PEOPLE" && userId) {
                defaultPeopleId = Number(userId);
            }

            form.reset({
                amount: 0,
                incomeDate: new Date(),
                incomeDetail: "",
                description: "",
                categoryId: null,
                subCategoryId: null,
                projectId: null,
                peopleId: defaultPeopleId,
                attachmentPath: "",
            });
        }
    }, [income, form, open, role, userId]);

    async function onSubmit(values: z.infer<typeof incomeSchema>) {
        try {
            // Sanitize values: Convert "null" strings to actual null
            const sanitizedValues = {
                ...values,
                categoryId: values.categoryId ? Number(values.categoryId) : null,
                subCategoryId: values.subCategoryId ? Number(values.subCategoryId) : null,
                projectId: values.projectId ? Number(values.projectId) : null,
                // peopleId is required, keep as is (coerced number)
            };

            // Double check if Zod coerced them to 0 or NaN if originally "null"?
            // Actually, the form values from Select might be string "null" if we blindly trust what's in the field, 
            // but useForm with zodResolver usually handles basic type checks.
            // However, "null" string passed to z.coerce.number() might be problematic or result in NaN.
            // It's safer to handle the Select onValueChange or sanitize here.

            // Let's look at how the Select is bound. 
            // value={field.value?.toString() || ""}
            // onValueChange={field.onChange} 
            // If SelectItem value is "null", field.onChange("null") happens.
            // "null" string in Zod number schema -> NaN.

            // Better to fix it at the form handling level or just before submit.
            // NOTE: We must ensure we don't send NaN to the server.

            if (sanitizedValues.categoryId && isNaN(sanitizedValues.categoryId)) sanitizedValues.categoryId = null;
            if (sanitizedValues.projectId && isNaN(sanitizedValues.projectId)) sanitizedValues.projectId = null;
            if (sanitizedValues.subCategoryId && isNaN(sanitizedValues.subCategoryId)) sanitizedValues.subCategoryId = null;

            if (income) {
                await updateIncome(income.incomeId, sanitizedValues);
                toast.success("Income updated");
            } else {
                await createIncome(sanitizedValues);
                toast.success("Income created");
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
                        {income ? "Edit Income" : "Add Income"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="incomeDate"
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
                                        onValueChange={(val) => field.onChange(val === "null" ? null : val)}
                                        defaultValue={field.value?.toString() || ""}
                                        value={field.value?.toString() || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        {/* Force high z-index to ensure it appears above Dialog */}
                                        <SelectContent className="z-[200] max-h-[300px]">
                                            {categories.filter(c => c.isActive && c.isIncome).length > 0 ? (
                                                categories.filter(c => c.isActive && c.isIncome).map((c) => (
                                                    <SelectItem key={c.categoryId} value={c.categoryId.toString()}>
                                                        {c.categoryName}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>
                                                    No Income Categories
                                                </SelectItem>
                                            )}
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
                                        onValueChange={(val) => field.onChange(val === "null" ? null : val)}
                                        defaultValue={field.value?.toString() || ""}
                                        value={field.value?.toString() || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Project (Optional)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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

                        {/* Hide Payer selection for Employees */
                            (role !== "PEOPLE" && role !== "EMPLOYEE") && (
                                <FormField
                                    control={form.control}
                                    name="peopleId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payer</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value?.toString() || ""}
                                                value={field.value?.toString() || ""}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Payer" />
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
                                            folder="incomes/attachments"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="col-span-2 flex justify-end">
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save Income"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
