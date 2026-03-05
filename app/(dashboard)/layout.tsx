import { auth } from "@/auth"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user) {
        // middleware handles redirect mostly
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background dark:from-slate-950/50 dark:via-background dark:to-background lg:flex-row">
            <Sidebar session={session} />
            <div className="flex flex-col sm:gap-4 sm:py-4 lg:pl-64 flex-1">
                <Header />
                <main className="flex-1 p-4 sm:px-6 sm:py-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
