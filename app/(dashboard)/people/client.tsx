"use client";

import { People } from "@/lib/prisma";
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
import { PeopleDialog } from "./people-dialog";
import { deletePeople } from "@/actions/data-actions";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

interface PeopleClientProps {
    data: People[];
}

export function PeopleClient({ data }: PeopleClientProps) {
    const [open, setOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<People | null>(null);

    const columns: ColumnDef<People>[] = [
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
            accessorKey: "profileImage",
            header: "Image",
            cell: ({ row }) => {
                return (
                    <Avatar>
                        <AvatarImage src={row.original.profileImage || ""} />
                        <AvatarFallback>{row.original.peopleName.charAt(0)}</AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: "peopleName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => row.original.email || "-",
        },
        {
            accessorKey: "mobileNo",
            header: "Mobile",
            cell: ({ row }) => row.original.mobileNo || "-",
        },
        {
            accessorKey: "peopleCode",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Code" />
            ),
            cell: ({ row }) => row.original.peopleCode || "-",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const person = row.original;

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
                                    setEditingPerson(person);
                                    setOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={async () => {
                                    await deletePeople(person.peopleId);
                                    toast.success("Person deleted");
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

    return (
        <>
            <div className="flex items-center justify-between">
                <div />
                <Button
                    onClick={() => {
                        setEditingPerson(null);
                        setOpen(true);
                    }}
                >
                    Add New
                </Button>
            </div>
            <DataTable columns={columns} data={data} searchKey="peopleName" />
            <PeopleDialog
                open={open}
                setOpen={setOpen}
                person={editingPerson}
            />
        </>
    );
}
