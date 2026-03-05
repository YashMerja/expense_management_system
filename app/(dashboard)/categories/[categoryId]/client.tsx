"use client";

import { SubCategory } from "@/lib/prisma";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { SubCategoryDialog } from "./subcategory-dialog";
import { deleteSubCategory } from "@/actions/data-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubCategoryClientProps {
    data: SubCategory[];
    categoryId: number;
    role?: string;
}

export function SubCategoryClient({ data, categoryId, role }: SubCategoryClientProps) {
    const [open, setOpen] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
    const router = useRouter();

    const columns: ColumnDef<SubCategory>[] = [
        {
            accessorKey: "subCategoryName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <span
                    className={
                        row.original.isActive ? "text-green-600" : "text-red-600"
                    }
                >
                    {row.original.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        ...(role !== "PEOPLE" && role !== "EMPLOYEE" ? [{
            id: "actions",
            cell: ({ row }) => {
                const subCategory = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditingSubCategory(subCategory);
                                    setOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={async () => {
                                    await deleteSubCategory(subCategory.subCategoryId);
                                    toast.success("SubCategory deleted");
                                }}
                            >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        } as ColumnDef<SubCategory>] : []),
    ];

    return (
        <>
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.push("/categories")}
                >
                    Back to Categories
                </Button>
                {(role !== "PEOPLE" && role !== "EMPLOYEE") && (
                    <Button
                        onClick={() => {
                            setEditingSubCategory(null);
                            setOpen(true);
                        }}
                    >
                        Add New
                    </Button>
                )}
            </div>
            <DataTable columns={columns} data={data} searchKey="subCategoryName" />
            <SubCategoryDialog
                open={open}
                setOpen={setOpen}
                subCategory={editingSubCategory}
                categoryId={categoryId}
            />
        </>
    );
}
