"use client";

import { Project } from "@/lib/prisma";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, InfoIcon, FileTextIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectDetailsDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    project: Project | null;
}

export function ProjectDetailsDialog({
    open,
    setOpen,
    project,
}: ProjectDetailsDialogProps) {
    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-border">
                            <AvatarImage src={project.projectLogo || ""} alt={project.projectName} />
                            <AvatarFallback className="text-xl">
                                {project.projectName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                {project.projectName}
                            </DialogTitle>
                            <div className="mt-1 flex items-center gap-2">
                                <Badge
                                    variant={project.isActive ? "default" : "destructive"}
                                    className="capitalize"
                                >
                                    {project.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-6 py-4">
                        {/* Project Details Section */}
                        {(project.projectDetail || project.description) && (
                            <div className="space-y-3">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <InfoIcon className="h-5 w-5 text-muted-foreground" />
                                    About Project
                                </h3>
                                <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                                    {project.projectDetail && (
                                        <div className="mb-4">
                                            <h4 className="font-medium text-muted-foreground mb-1">Details</h4>
                                            <p className="text-sm leading-relaxed">{project.projectDetail}</p>
                                        </div>
                                    )}
                                    {project.description && (
                                        <div>
                                            <h4 className="font-medium text-muted-foreground mb-1">Description</h4>
                                            <p className="text-sm leading-relaxed">{project.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timeline Section */}
                        <div className="space-y-3">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                                Timeline
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                                    <span className="text-xs font-medium uppercase text-muted-foreground">
                                        Start Date
                                    </span>
                                    <p className="mt-1 text-lg font-semibold">
                                        {project.projectStartDate
                                            ? format(new Date(project.projectStartDate), "PPP")
                                            : "Not set"}
                                    </p>
                                </div>
                                <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                                    <span className="text-xs font-medium uppercase text-muted-foreground">
                                        End Date
                                    </span>
                                    <p className="mt-1 text-lg font-semibold">
                                        {project.projectEndDate
                                            ? format(new Date(project.projectEndDate), "PPP")
                                            : "Not set"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info / ID */}
                        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground text-center">
                            Project ID: {project.projectId} • Last Updated:{" "}
                            {format(new Date(project.modified), "PPP p")}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
