"use client";

import { Project } from "@/lib/prisma";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProject } from "@/actions/data-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    project: Project;
    role?: string;
    onEdit: (project: Project) => void;
    onViewDetails: (project: Project) => void;
}

export function ProjectCard({
    project,
    role,
    onEdit,
    onViewDetails,
}: ProjectCardProps) {
    const handleDelete = async () => {
        try {
            await deleteProject(project.projectId);
            toast.success("Project deleted successfully");
        } catch (error) {
            toast.error("Failed to delete project");
        }
    };

    const isAdminOrManager = role !== "PEOPLE" && role !== "EMPLOYEE";

    return (
        <CardSpotlight
            className="h-full flex flex-col justify-between p-6 [--spotlight-color:#e5e7eb] dark:[--spotlight-color:#262626]"
            color="var(--spotlight-color)"
        >
            <div className="relative z-20">
                {/* Header with Logo and Actions */}
                <div className="flex justify-between items-start mb-4">
                    <Avatar className="h-12 w-12 border border-neutral-200 dark:border-neutral-700">
                        <AvatarImage src={project.projectLogo || ""} alt={project.projectName} />
                        <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white">
                            {project.projectName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    {isAdminOrManager && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-black dark:text-white">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-neutral-100 dark:focus:bg-neutral-800 focus:text-black dark:focus:text-white"
                                    onClick={() => onEdit(project)}
                                >
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-800" />
                                <DropdownMenuItem
                                    className="text-red-500 dark:text-red-500 cursor-pointer hover:bg-red-50 dark:hover:bg-neutral-800 focus:bg-red-50 dark:focus:bg-neutral-800 focus:text-red-600 dark:focus:text-red-500"
                                    onClick={handleDelete}
                                >
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Project Info */}
                <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-bold text-xl text-neutral-900 dark:text-white truncate flex-1" title={project.projectName}>
                            {project.projectName}
                        </h3>
                        <Badge
                            variant="outline"
                            className={cn(
                                "border-0 px-2 py-0.5 text-xs font-semibold shrink-0",
                                project.isActive
                                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
                                    : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500"
                            )}
                        >
                            {project.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm line-clamp-2 h-10">
                        {project.description || project.projectDetail || "No description provided."}
                    </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 dark:text-neutral-500 mb-6">
                    <div className="flex flex-col">
                        <span className="mb-1 flex items-center gap-1">
                            Start
                        </span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {project.projectStartDate
                                ? format(new Date(project.projectStartDate), "P")
                                : "-"}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="mb-1 flex items-center gap-1">
                            End
                        </span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {project.projectEndDate
                                ? format(new Date(project.projectEndDate), "P")
                                : "-"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <Button
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 z-20"
                onClick={() => onViewDetails(project)}
            >
                View Dashboard
            </Button>
        </CardSpotlight>
    );
}
