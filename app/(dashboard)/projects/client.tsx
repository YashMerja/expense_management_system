"use client";

import { Project } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { ProjectDialog } from "./project-dialog";
import { ProjectCard } from "./project-card";
import { ProjectDetailsDialog } from "./project-details-dialog";
import { Input } from "@/components/ui/input";

interface ProjectClientProps {
    data: Project[];
    role?: string;
}

export function ProjectClient({ data, role }: ProjectClientProps) {
    const [open, setOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [viewingProject, setViewingProject] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = data.filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setOpen(true);
    };

    const handleViewDetails = (project: Project) => {
        setViewingProject(project);
        setDetailsOpen(true);
    };

    return (
        <>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 text-neutral-900 dark:text-white">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-8 w-full md:w-[300px] bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:ring-neutral-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {(role !== "PEOPLE" && role !== "EMPLOYEE") && (
                    <Button
                        onClick={() => {
                            setEditingProject(null);
                            setOpen(true);
                        }}
                        className="bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.projectId}
                        project={project}
                        role={role}
                        onEdit={handleEdit}
                        onViewDetails={handleViewDetails}
                    />
                ))}
                {filteredProjects.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No projects found.
                    </div>
                )}
            </div>

            <ProjectDialog
                open={open}
                setOpen={setOpen}
                project={editingProject}
            />

            <ProjectDetailsDialog
                open={detailsOpen}
                setOpen={setDetailsOpen}
                project={viewingProject}
            />
        </>
    );
}
