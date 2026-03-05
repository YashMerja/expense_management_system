"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { People } from "@/lib/prisma";
import { createPeople, updatePeople } from "@/actions/data-actions";
import { peopleSchema } from "@/lib/schemas";
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

interface PeopleDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    person: People | null;
}

export function PeopleDialog({
    open,
    setOpen,
    person,
}: PeopleDialogProps) {
    const form = useForm<z.infer<typeof peopleSchema>>({
        resolver: zodResolver(peopleSchema) as any,
        defaultValues: {
            peopleName: "",
            email: "",
            password: "",
            mobileNo: "",
            description: "",
            isActive: true,
            profileImage: "",
        },
    });

    useEffect(() => {
        if (person) {
            form.reset({
                peopleName: person.peopleName,
                email: person.email || "",
                password: "", // User can leave empty on edit to keep same password, or we need logic to handle "if empty, don't update"
                mobileNo: person.mobileNo || "",
                description: person.description || "",
                isActive: person.isActive,
                profileImage: person.profileImage || "",
            });
        } else {
            form.reset({
                peopleName: "",
                email: "",
                password: "",
                mobileNo: "",
                description: "",
                isActive: true,
                profileImage: "",
            });
        }
    }, [person, form, open]);

    async function onSubmit(values: z.infer<typeof peopleSchema>) {
        try {
            if (person) {
                // If checking password updates, the API needs to handle "if empty do not update" or handle it here.
                // peopleSchema keeps password optional.
                // We'll pass it. Backend should update if present? 
                // data-actions.ts updatePeople simply calls db.people.update with "validated".
                // If we pass empty string, it might update to empty string?
                // We should probably filter it out if empty on edit.

                // For simplicity now, we assume if they type it, we update it.
                // If empty, we might accidentally clear it if we don't handle logic.
                // But schema says optional.
                const updateData = { ...values };
                if (!updateData.password) delete updateData.password;

                await updatePeople(person.peopleId, updateData);
                toast.success("Person updated");
            } else {
                await createPeople(values);
                toast.success("Person created");
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
                        {person ? "Edit Person" : "Add Person"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="peopleName"
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

                        <FormField
                            control={form.control}
                            name="profileImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Image</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            onRemove={() => field.onChange("")}
                                            folder="people/profile"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password {person ? "(Leave empty to keep current)" : "(Recommended)"}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mobileNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mobile" {...field} />
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
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save Person"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
