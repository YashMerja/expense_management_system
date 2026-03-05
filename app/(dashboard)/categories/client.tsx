"use client";

import { Category } from "@/lib/prisma";
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
import { CategoryDialog } from "./category-dialog";
import { deleteCategory } from "@/actions/data-actions";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

interface CategoryClientProps {
    data: Category[];
    role?: string;
}

export function CategoryClient({ data, role }: CategoryClientProps) {
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const columns: ColumnDef<Category>[] = [
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
                        <AvatarFallback>{row.original.categoryName.charAt(0)}</AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: "categoryName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
        },
        {
            accessorKey: "isExpense",
            id: "type",
            header: "Type",
            cell: ({ row }) => {
                const isExpense = row.original.isExpense;
                const isIncome = row.original.isIncome;
                if (isExpense && isIncome) return "Both";
                if (isExpense) return "Expense";
                if (isIncome) return "Income";
                return "-";
            },
            filterFn: (row, id, value) => {
                const isExpense = row.original.isExpense;
                const isIncome = row.original.isIncome;
                let type = "Both";
                if (isExpense && !isIncome) type = "Expense";
                if (!isExpense && isIncome) type = "Income";
                return value.includes(type);
            }
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
        ...(role !== "PEOPLE" && role !== "EMPLOYEE" ? [{
            id: "actions",
            cell: ({ row }) => {
                const category = row.original;

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
                                    setEditingCategory(category);
                                    setOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={async () => {
                                    await deleteCategory(category.categoryId);
                                    toast.success("Category deleted");
                                }}
                            >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    window.location.href = `/categories/${category.categoryId}`;
                                }}
                            >
                                <ArrowUpDown className="mr-2 h-4 w-4" /> SubCategories
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        } as ColumnDef<Category>] : [{
            id: "view",
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = `/categories/${category.categoryId}`}>
                        SubCategories
                    </Button>
                )
            }
        } as ColumnDef<Category>]),
    ];

    const typeOptions = [
        { label: "Expense", value: "Expense" },
        { label: "Income", value: "Income" },
        { label: "Both", value: "Both" },
    ];

    const statusOptions = [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
    ];

    return (
        <>
            <div className="flex items-center justify-between">
                <div />
                {(role !== "PEOPLE" && role !== "EMPLOYEE") && (
                    <Button
                        onClick={() => {
                            setEditingCategory(null);
                            setOpen(true);
                        }}
                    >
                        Add New
                    </Button>
                )}
            </div>
            <DataTable
                columns={columns}
                data={data}
                searchKey="categoryName"
                toolbarContent={(table) => (
                    <>
                        {table.getColumn("type") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("type")}
                                title="Type"
                                options={typeOptions}
                            />
                        )}
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
            <CategoryDialog
                open={open}
                setOpen={setOpen}
                category={editingCategory}
            />
        </>
    );
}
