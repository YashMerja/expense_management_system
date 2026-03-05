"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/lib/prisma";
import { createCategory, updateCategory } from "@/actions/data-actions";
import { categorySchema } from "@/lib/schemas";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { useEffect } from "react";

interface CategoryDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    category: Category | null;
}

export function CategoryDialog({
    open,
    setOpen,
    category,
}: CategoryDialogProps) {
    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema) as any,
        defaultValues: {
            categoryName: "",
            isExpense: false,
            isIncome: false,
            description: "",
            isActive: true,
            logoPath: "",
        },
    });

    useEffect(() => {
        if (category) {
            form.reset({
                categoryName: category.categoryName,
                isExpense: category.isExpense,
                isIncome: category.isIncome,
                description: category.description || "",
                isActive: category.isActive,
                logoPath: category.logoPath || "",
            });
        } else {
            form.reset({
                categoryName: "",
                isExpense: false,
                isIncome: false,
                description: "",
                isActive: true,
                logoPath: "",
            });
        }
    }, [category, form, open]);

    async function onSubmit(values: z.infer<typeof categorySchema>) {
        try {
            if (category) {
                await updateCategory(category.categoryId, values);
                toast.success("Category updated");
            } else {
                await createCategory(values);
                toast.success("Category created");
            }
            setOpen(false);
            form.reset();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {category ? "Edit Category" : "Add Category"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="categoryName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logoPath"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon / Logo</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            onRemove={() => field.onChange("")}
                                            folder="categories/logo"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex space-x-4">
                            <FormField
                                control={form.control}
                                name="isExpense"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Expense</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isIncome"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Income</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Active</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
