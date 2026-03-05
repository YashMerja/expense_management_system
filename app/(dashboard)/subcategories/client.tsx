"use client";

import { Category, SubCategory } from "@/lib/prisma";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

interface SubCategoryClientProps {
    data: (SubCategory & { category: Category })[];
    categories: Category[];
}

export function SubCategoryClient({ data, categories }: SubCategoryClientProps) {
    const [open, setOpen] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);

    const columns: ColumnDef<SubCategory & { category: Category }>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "logoPath",
            header: "Icon",
            cell: ({ row }) => {
                return (
                    <Avatar>
                        <AvatarImage src={row.original.logoPath || ""} />
                        <AvatarFallback>{row.original.subCategoryName.charAt(0)}</AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: "subCategoryName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
        },
        {
            accessorKey: "category.categoryName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Parent Category" />
            ),
        },
        {
            accessorKey: "isActive",
            id: "status",
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
            filterFn: (row, id, value) => {
                const status = row.original.isActive ? "Active" : "Inactive";
                return value.includes(status);
            }
        },
        {
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
        },
    ];

    const statusOptions = [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
    ];

    return (
        <>
            <div className="flex items-center justify-between">
                <div />
                <Button
                    onClick={() => {
                        setEditingSubCategory(null);
                        setOpen(true);
                    }}
                >
                    Add New
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={data}
                searchKey="subCategoryName"
                toolbarContent={(table) => (
                    <>
                        {table.getColumn("status") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("status")}
                                title="Status"
                                options={statusOptions}
                            />
                        )}
                    </>
                )}
            />
            <SubCategoryDialog
                open={open}
                setOpen={setOpen}
                subCategory={editingSubCategory}
                categories={categories}
            />
        </>
    );
}
