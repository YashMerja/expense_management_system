import { getProjects } from "@/actions/data-actions";
import { ProjectClient } from "./client";
import { auth } from "@/auth";

export default async function ProjectsPage() {
    const session = await auth();
    const projects = await getProjects();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <ProjectClient data={projects} role={session?.user?.accountType} />
            </div>
        </div>
    );
}
