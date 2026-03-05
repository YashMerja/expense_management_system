import { auth } from "@/auth";
import { getFinancialEvents } from "@/actions/calendar-actions";
import { FinancialCalendar } from "@/components/calendar/financial-calendar";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const events = await getFinancialEvents();

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Financial Calendar</h1>
                <p className="text-muted-foreground">
                    Visualize projects, expenses, and transaction timelines.
                </p>
            </div>

            <FinancialCalendar events={events} />
        </div>
    );
}
