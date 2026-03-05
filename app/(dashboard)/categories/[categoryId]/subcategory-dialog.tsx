"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubCategory } from "@/lib/prisma";
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

interface SubCategoryDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    subCategory: SubCategory | null;
    categoryId: number;
}

export function SubCategoryDialog({
    open,
    setOpen,
    subCategory,
    categoryId,
}: SubCategoryDialogProps) {
    const form = useForm<z.infer<typeof subCategorySchema>>({
        resolver: zodResolver(subCategorySchema) as any,
        defaultValues: {
            subCategoryName: "",
            categoryId: categoryId,
            isActive: true,
        },
    });

    useEffect(() => {
        if (subCategory) {
            form.reset({
                subCategoryName: subCategory.subCategoryName,
                categoryId: subCategory.categoryId,
                isActive: subCategory.isActive,
            });
        } else {
            form.reset({
                subCategoryName: "",
                categoryId: categoryId,
                isActive: true,
            });
        }
    }, [subCategory, form, open, categoryId]);

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
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
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
