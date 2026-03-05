"use client";

import { Expense, Category, SubCategory, Project, People } from "@/lib/prisma";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { ExpenseDialog } from "./expense-dialog";
import { deleteExpense } from "@/actions/data-actions";
import { toast } from "sonner";
import { format, isWithinInterval } from "date-fns";
import { FileViewerModal } from "@/components/ui/file-viewer-modal";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

// Type with relations
type ExpenseWithRelations = Expense & {
    category: Category | null;
    subCategory: SubCategory | null;
    project: Project | null;
    people: People;
};

interface ExpenseClientProps {
    data: ExpenseWithRelations[];
    categories: Category[];
    projects: Project[];
    people: People[];
    role?: string;
    userId?: string;
}

export function ExpenseClient({ data, categories, projects, people, role, userId }: ExpenseClientProps) {
    const [open, setOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<ExpenseWithRelations | null>(null);
    const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);
    const [date, setDate] = useState<DateRange | undefined>();

    const columns: ColumnDef<ExpenseWithRelations>[] = [
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
            accessorKey: "expenseDate",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Date" />
            ),
            cell: ({ row }) => format(new Date(row.original.expenseDate), "PPP"),
            filterFn: (row, id, value: DateRange | undefined) => {
                if (!value?.from) return true;
                const rowDate = new Date(row.original.expenseDate);
                if (value.to) {
                    return isWithinInterval(rowDate, { start: value.from, end: value.to });
                }
                return rowDate.getTime() === value.from.getTime();
            },
        },
        {
            accessorKey: "amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Amount" />
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.original.amount.toString());
                return (
                    <div className="font-medium text-red-600 dark:text-red-400">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(amount)}
                    </div>
                );
            },
        },
        {
            accessorKey: "people.peopleName",
            id: "peopleName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Payee" />
            ),
            cell: ({ row }) => row.original.people?.peopleName || "-",
        },
        {
            accessorKey: "category.categoryName",
            id: "category",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Category" />
            ),
            cell: ({ row }) => row.original.category?.categoryName || "-",
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "subCategory.subCategoryName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Sub Category" />
            ),
            cell: ({ row }) => row.original.subCategory?.subCategoryName || "-",
        },
        {
            accessorKey: "project.projectName",
            id: "project",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Project" />
            ),
            cell: ({ row }) => row.original.project?.projectName || "-",
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "attachmentPath",
            header: "Attachment",
            cell: ({ row }) => {
                const path = row.original.attachmentPath;
                if (!path) return "-";
                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => setViewFileUrl(path)}
                        title="View Attachment"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const expense = row.original;

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
                                    setEditingExpense(expense);
                                    setOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={async () => {
                                    await deleteExpense(expense.expenseId);
                                    toast.success("Expense deleted");
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

    const projectOptions = projects.map(p => ({
        label: p.projectName,
        value: p.projectName
    }));

    return (
        <>
            <div className="flex items-center justify-between">
                <div />
                <Button
                    onClick={() => {
                        setEditingExpense(null);
                        setOpen(true);
                    }}
                >
                    Add New
                </Button>
            </div>
            <DataTable
                columns={columns}
                data={data}
                searchKey="peopleName"
                toolbarContent={(table) => {
                    // Sync date filter with table
                    useEffect(() => {
                        table.getColumn("expenseDate")?.setFilterValue(date);
                    }, [date, table]);

                    return (
                        <>
                            <DatePickerWithRange date={date} setDate={setDate} />
                            {table.getColumn("category") && (
                                <DataTableFacetedFilter
                                    column={table.getColumn("category")}
                                    title="Category"
                                    options={categoryOptions}
                                />
                            )}
                            {table.getColumn("project") && (
                                <DataTableFacetedFilter
                                    column={table.getColumn("project")}
                                    title="Project"
                                    options={projectOptions}
                                />
                            )}
                        </>
                    )
                }}
            />
            <ExpenseDialog
                open={open}
                setOpen={setOpen}
                expense={editingExpense}
                categories={categories}
                projects={projects}
                people={people}
                role={role}
                userId={userId}
            />
            <FileViewerModal
                isOpen={!!viewFileUrl}
                onClose={() => setViewFileUrl(null)}
                fileUrl={viewFileUrl}
            />
        </>
    );
}
