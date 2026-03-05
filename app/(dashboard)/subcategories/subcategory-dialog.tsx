"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, SubCategory } from "@/lib/prisma";
import { createSubCategory, updateSubCategory } from "@/actions/data-actions";
import { subCategorySchema } from "@/lib/schemas";
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
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";

interface SubCategoryDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    subCategory: SubCategory | null;
    categories: Category[];
}

export function SubCategoryDialog({
    open,
    setOpen,
    subCategory,
    categories,
}: SubCategoryDialogProps) {
    const form = useForm<z.infer<typeof subCategorySchema>>({
        resolver: zodResolver(subCategorySchema) as any,
        defaultValues: {
            subCategoryName: "",
            categoryId: 0,
            isActive: true,
            logoPath: "",
        },
    });

    useEffect(() => {
        if (subCategory) {
            form.reset({
                subCategoryName: subCategory.subCategoryName,
                categoryId: subCategory.categoryId,
                isActive: subCategory.isActive,
                logoPath: subCategory.logoPath || "",
            });
        } else {
            form.reset({
                subCategoryName: "",
                categoryId: 0,
                isActive: true,
                logoPath: "",
            });
        }
    }, [subCategory, form, open]);

    async function onSubmit(values: z.infer<typeof subCategorySchema>) {
        try {
            if (subCategory) {
                await updateSubCategory(subCategory.subCategoryId, values);
                toast.success("SubCategory updated");
            } else {
                await createSubCategory(values);
                toast.success("SubCategory created");
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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {subCategory ? "Edit SubCategory" : "Add SubCategory"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subCategoryName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SubCategory Name" {...field} />
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
                                            folder="subcategories/logo"
                                        />
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
                                    <FormLabel>Parent Category</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        defaultValue={field.value?.toString() || ""}
                                        value={field.value?.toString() || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.filter(c => c.isActive).map((c) => (
                                                <SelectItem key={c.categoryId} value={c.categoryId.toString()}>
                                                    {c.categoryName} ({c.isExpense ? "Expense" : c.isIncome ? "Income" : "Other"})
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

                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save SubCategory"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
