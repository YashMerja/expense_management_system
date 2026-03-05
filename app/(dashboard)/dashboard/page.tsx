import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getDashboardStats } from "@/actions/data-actions";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const stats = await getDashboardStats();

    return <DashboardClient stats={stats} role={session.user.accountType} />;
}
