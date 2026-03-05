"use client";

import { Budget, Category } from "@/lib/prisma";
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
import { BudgetDialog } from "./budget-dialog";
import { deleteBudget } from "@/actions/data-actions";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";

// Month names helper
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

type BudgetWithCategory = Budget & {
    category: Category | null;
};

interface BudgetClientProps {
    data: BudgetWithCategory[];
    categories: Category[];
}

export function BudgetClient({ data, categories }: BudgetClientProps) {
    const [open, setOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<BudgetWithCategory | null>(null);

    const columns: ColumnDef<BudgetWithCategory>[] = [
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
            accessorKey: "year",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Year" />
            ),
        },
        {
            accessorKey: "month",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Month" />
            ),
            cell: ({ row }) => MONTHS[row.original.month - 1] || row.original.month,
        },
        {
            accessorKey: "category.categoryName",
            id: "category",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Category" />
            ),
            cell: ({ row }) => row.original.category?.categoryName || "Uncategorized",
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Budget Amount" />
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.original.amount.toString());
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(amount);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const budget = row.original;

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
                                    setEditingBudget(budget);
                                    setOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={async () => {
                                    await deleteBudget(budget.budgetId);
                                    toast.success("Budget deleted");
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

    const categoryOptions = categories.map(c => ({
        label: c.categoryName,
        value: c.categoryName
    }));

    return (
        <>
            <div className="flex items-center justify-between">
                <div />
                <Button
                    onClick={() => {
                        setEditingBudget(null);
                        setOpen(true);
                    }}
                >
                    Add New
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={data}
                searchKey="category"
                toolbarContent={(table) => (
                    <>
                        {table.getColumn("category") && (
                            <DataTableFacetedFilter
                                column={table.getColumn("category")}
                                title="Category"
                                options={categoryOptions}
                            />
                        )}
                    </>
                )}
            />
            <BudgetDialog
                open={open}
                setOpen={setOpen}
                budget={editingBudget}
                categories={categories}
            />
        </>
    );
}
