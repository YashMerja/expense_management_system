"use client";

import { useState, useMemo } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    addWeeks,
    subWeeks,
    isWithinInterval,
    startOfDay,
    addDays,
    isToday,
    setHours,
    setMinutes,
    getHours,
    parseISO
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Layers, DollarSign, Plus, Clock, AlignJustify, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarEvent } from "@/actions/calendar-actions";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface FinancialCalendarProps {
    events: CalendarEvent[];
}

type ViewMode = "month" | "week" | "agenda";

export function FinancialCalendar({ events }: FinancialCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<ViewMode>("month");

    // Filters
    const [showProjects, setShowProjects] = useState(false);
    const [showExpenses, setShowExpenses] = useState(true);
    const [showIncomes, setShowIncomes] = useState(true);
    const [selectedProject, setSelectedProject] = useState<string>("all");

    // Drawer State
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Normalize events
    const normalizedEvents = useMemo(() => {
        return events.map(e => ({
            ...e,
            start: typeof e.start === 'string' ? new Date(e.start) : e.start,
            end: typeof e.end === 'string' ? new Date(e.end) : e.end,
        }));
    }, [events]);

    const filteredEvents = useMemo(() => {
        return normalizedEvents.filter(e => {
            if (e.type === "project" && !showProjects) return false;
            if (e.type === "expense" && !showExpenses) return false;
            if (e.type === "income" && !showIncomes) return false;

            // Project Filter
            if (selectedProject !== "all") {
                // If event is project type, match IDs
                if (e.type === "project" && e.meta?.projectId !== parseInt(selectedProject)) return false;
                // If event is expense/income, match linked project if any (assuming we have projectId in meta or similar)
                // Note: Our current meta update might not have projectId on expenses strictly linked for filtering yet, 
                // but let's assume if we want strict filtering we'd need it. 
                // For now, let's filter if it's a Project Event. Expenses often aren't linked to projects in this system.
            }

            return true;
        });
    }, [normalizedEvents, showProjects, showExpenses, showIncomes, selectedProject]);

    // Derived Financial Stats for Current Month
    const monthlyStats = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);

        const monthEvents = normalizedEvents.filter(e =>
            (e.type === "expense" || e.type === "income") &&
            isWithinInterval(e.start, { start, end })
        );

        const totalExpense = monthEvents
            .filter(e => e.type === "expense")
            .reduce((acc, e) => acc + (e.amount || 0), 0);

        const totalIncome = monthEvents
            .filter(e => e.type === "income")
            .reduce((acc, e) => acc + (e.amount || 0), 0);

        const activeProjectsCount = normalizedEvents.filter(e =>
            e.type === "project" &&
            e.status === "Active" &&
            (isWithinInterval(start, { start: e.start, end: e.end }) || isWithinInterval(end, { start: e.start, end: e.end }))
        ).length;

        return { totalExpense, totalIncome, net: totalIncome - totalExpense, activeProjectsCount };
    }, [normalizedEvents, currentDate]);

    // Navigation
    const next = () => {
        if (view === "month") setCurrentDate(addMonths(currentDate, 1));
        else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    };

    const prev = () => {
        if (view === "month") setCurrentDate(subMonths(currentDate, 1));
        else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    };

    const today = () => setCurrentDate(new Date());

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsDrawerOpen(true);
    };

    // Extract unique projects for filter
    const uniqueProjects = useMemo(() => {
        const projects = normalizedEvents.filter(e => e.type === "project");
        // Dedupe by ID just in case
        return Array.from(new Map(projects.map(p => [p.meta?.projectId, p])).values())
            .filter(p => p.meta?.projectId);
    }, [normalizedEvents]);

    // Grid Generation
    const days = useMemo(() => {
        const start = startOfWeek(view === "month" ? startOfMonth(currentDate) : currentDate);
        const end = endOfWeek(view === "month" ? endOfMonth(currentDate) : currentDate);
        return eachDayOfInterval({ start, end });
    }, [currentDate, view]);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-background">
            {/* Financial Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pb-2">
                <Card className="shadow-none border-none bg-muted/20">
                    <CardContent className="p-3 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Total Income</span>
                        <span className="text-xl font-bold text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" /> ${monthlyStats.totalIncome.toLocaleString()}
                        </span>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-none bg-muted/20">
                    <CardContent className="p-3 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Total Expense</span>
                        <span className="text-xl font-bold text-rose-600 flex items-center gap-1">
                            <TrendingDown className="h-4 w-4" /> ${monthlyStats.totalExpense.toLocaleString()}
                        </span>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-none bg-muted/20">
                    <CardContent className="p-3 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Net Profit</span>
                        <span className={cn("text-xl font-bold flex items-center gap-1", monthlyStats.net >= 0 ? "text-emerald-600" : "text-rose-600")}>
                            {monthlyStats.net >= 0 ? '+' : ''}${monthlyStats.net.toLocaleString()}
                        </span>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-none bg-muted/20">
                    <CardContent className="p-3 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Active Projects</span>
                        <span className="text-xl font-bold text-blue-600 flex items-center gap-1">
                            <Layers className="h-4 w-4" /> {monthlyStats.activeProjectsCount}
                        </span>
                    </CardContent>
                </Card>
            </div>

            {/* Header Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between py-2 px-4 gap-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={today} className="h-8">Today</Button>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={prev} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">
                        {format(currentDate, view === "week" ? "MMM yyyy" : "MMMM yyyy")}
                    </h2>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">

                    {/* Project Filter */}
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger className="w-[160px] h-8 text-xs">
                            <SelectValue placeholder="All Projects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {uniqueProjects.map(p => (
                                <SelectItem key={p.id} value={String(p.meta?.projectId)}>{p.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Separator orientation="vertical" className="h-6 mx-1" />

                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                        <Toggle pressed={showProjects} onPressedChange={setShowProjects} size="sm" className="h-6 text-xs data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700">Projects</Toggle>
                        <Toggle pressed={showExpenses} onPressedChange={setShowExpenses} size="sm" className="h-6 text-xs data-[state=on]:bg-rose-100 data-[state=on]:text-rose-700">Expenses</Toggle>
                        <Toggle pressed={showIncomes} onPressedChange={setShowIncomes} size="sm" className="h-6 text-xs data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-700">Incomes</Toggle>
                    </div>

                    <Select value={view} onValueChange={(v) => setView(v as ViewMode)}>
                        <SelectTrigger className="w-[100px] h-8 text-xs">
                            <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="agenda">Agenda</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" className="h-8 text-xs">
                        Export Report
                    </Button>
                </div>
            </div>

            {/* View Content */}
            <div className="flex-1 overflow-auto bg-card">
                {view === "month" && (
                    <MonthView days={days} currentDate={currentDate} events={filteredEvents} onDateClick={handleDateClick} />
                )}
                {view === "week" && (
                    <WeekView currentDate={currentDate} events={filteredEvents} />
                )}
                {view === "agenda" && (
                    <AgendaView events={filteredEvents} currentDate={currentDate} />
                )}
            </div>

            {/* Financial Detail Drawer */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedDate && <FinancialDayDetails date={selectedDate} events={normalizedEvents} />}
                </SheetContent>
            </Sheet>
        </div>
    );
}

// --- Month View ---
function MonthView({ days, currentDate, events, onDateClick }: { days: Date[], currentDate: Date, events: CalendarEvent[], onDateClick: (date: Date) => void }) {
    const getEvents = (day: Date) => {
        return events.filter(e => {
            if (e.type === "project") return isWithinInterval(day, { start: startOfDay(e.start), end: startOfDay(e.end) });
            return isSameDay(e.start, day);
        });
    };

    const getDailyStats = (dayEvents: CalendarEvent[]) => {
        const income = dayEvents.filter(e => e.type === "income").reduce((acc, e) => acc + (e.amount || 0), 0);
        const expense = dayEvents.filter(e => e.type === "expense").reduce((acc, e) => acc + (e.amount || 0), 0);
        return { income, expense, net: income - expense };
    };

    return (
        <div className="grid grid-cols-7 h-full grid-rows-[auto_1fr]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="py-2 text-center text-xs font-semibold uppercase text-muted-foreground border-b border-r last:border-r-0 bg-muted/5">
                    {day}
                </div>
            ))}
            {days.map((day, idx) => {
                const dayEvents = getEvents(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const stats = getDailyStats(dayEvents);

                return (
                    <div
                        key={day.toISOString()}
                        onClick={() => onDateClick(day)}
                        className={cn(
                            "min-h-[140px] p-2 border-b border-r last:border-r-0 transition-all hover:bg-accent/5 cursor-pointer flex flex-col group relative",
                            !isCurrentMonth && "bg-muted/10 text-muted-foreground opacity-60 grayscale",
                            (idx + 1) % 7 === 0 && "border-r-0",
                            isToday(day) && "bg-blue-50/30 dark:bg-blue-900/10"
                        )}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={cn(
                                "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full transition-transform group-hover:scale-110",
                                isToday(day) ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {format(day, "d")}
                            </span>

                            {/* Daily Net Badge */}
                            {(stats.income > 0 || stats.expense > 0) && (
                                <div className={cn(
                                    "flex flex-col items-end text-[10px] font-bold leading-tight px-1.5 py-0.5 rounded",
                                    stats.net > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                        stats.net < 0 ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                                            "bg-gray-100 text-gray-600"
                                )}>
                                    <span>{stats.net >= 0 ? '+' : ''}{stats.net}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 mt-1 flex-1">
                            {dayEvents.slice(0, 3).map(e => (
                                <div
                                    key={e.id}
                                    className={cn(
                                        "px-2 py-1 rounded-[4px] text-[10px] font-medium truncate border shadow-sm transition-all hover:brightness-95 flex items-center gap-1",
                                        e.type === "project" ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:border-blue-800" :
                                            e.type === "expense" ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-200 dark:border-rose-900" :
                                                "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900"
                                    )}
                                >
                                    {e.type === "project" && <Layers className="w-3 h-3 opacity-70" />}
                                    <span className="truncate">{e.title}</span>
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-[10px] text-muted-foreground pl-1 font-medium mt-auto group-hover:text-primary transition-colors">+{dayEvents.length - 3} more</div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// --- Week View ---
// (Kept largely the same but could connect interactivity later if needed)
function WeekView({ currentDate, events }: { currentDate: Date, events: CalendarEvent[] }) {
    const start = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    const hours = Array.from({ length: 24 }).map((_, i) => i);

    const getAllDayEvents = (day: Date) => {
        return events.filter(e => {
            if (e.type === "project") return isWithinInterval(day, { start: startOfDay(e.start), end: startOfDay(e.end) });
            return isSameDay(e.start, day);
        });
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header Row */}
            <div className="flex border-b bg-muted/5 shrink-0">
                <div className="w-14 border-r shrink-0 bg-muted/10"></div>
                {weekDays.map(day => (
                    <div key={day.toISOString()} className="flex-1 text-center py-3 border-r last:border-r-0">
                        <div className="text-xs text-muted-foreground uppercase mb-1">{format(day, "EEE")}</div>
                        <div className={cn(
                            "text-xl font-medium w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors",
                            isToday(day) && "bg-primary text-primary-foreground shadow-sm"
                        )}>
                            {format(day, "d")}
                        </div>
                    </div>
                ))}
            </div>

            {/* All Day Row */}
            <div className="flex border-b shrink-0 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="w-14 border-r shrink-0 flex items-center justify-center text-[10px] text-muted-foreground p-1 font-medium tracking-tight">
                    ALL DAY
                </div>
                {weekDays.map(day => {
                    const allDayEvents = getAllDayEvents(day);
                    return (
                        <div key={day.toISOString()} className="flex-1 border-r last:border-r-0 p-1 min-h-[40px] bg-background">
                            <div className="flex flex-col gap-1">
                                {allDayEvents.map((e, i) => (
                                    <div
                                        key={e.id}
                                        className={cn(
                                            "px-2 py-1 rounded text-[10px] border shadow-sm truncate cursor-pointer hover:opacity-80 transition-opacity",
                                            e.type === "project" ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800" :
                                                e.type === "expense" ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800" :
                                                    "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800"
                                        )}
                                        title={`${e.title} ${e.amount ? `($${e.amount})` : ''}`}
                                    >
                                        <span className="font-medium">{e.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <ScrollArea className="flex-1">
                <div className="flex relative min-h-[1440px]">
                    {/* Time Axis */}
                    <div className="w-14 border-r flex flex-col shrink-0 bg-card z-10 sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        {hours.map((h) => (
                            <div key={h} className="h-[60px] relative border-b border-border/50">
                                <span className="absolute -top-2.5 right-2 text-[10px] text-muted-foreground bg-card px-1">
                                    {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="flex flex-1 relative bg-white dark:bg-neutral-950/50">
                        {hours.map((h) => (
                            <div key={`line-${h}`} className="absolute w-full border-b border-border/30 h-[1px]" style={{ top: `${h * 60}px` }} />
                        ))}

                        {weekDays.map(day => (
                            <div key={day.toISOString()} className="flex-1 border-r border-border/40 last:border-r-0 relative pointer-events-none">
                            </div>
                        ))}

                        {isWithinInterval(new Date(), { start: weekDays[0], end: weekDays[6] }) && (
                            <div
                                className="absolute w-full border-t-2 border-red-500 z-20 pointer-events-none flex items-center"
                                style={{
                                    top: `${(getHours(new Date()) * 60) + new Date().getMinutes()}px`
                                }}
                            >
                                <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

// --- Agenda View ---
function AgendaView({ events, currentDate }: { events: CalendarEvent[], currentDate: Date }) {
    const monthEvents = useMemo(() => {
        return events
            .filter(e => isSameMonth(e.start, currentDate) || (e.type === "project" && isWithinInterval(currentDate, { start: startOfMonth(e.start), end: endOfMonth(e.end) })))
            .sort((a, b) => a.start.getTime() - b.start.getTime());
    }, [events, currentDate]);

    // Running Balance Logic could be here, but needs "Previous Balance" context which is hard.
    // We will show Daily Balance.

    if (monthEvents.length === 0) return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
            <CalendarIcon className="h-12 w-12 mb-4" />
            <p>No events scheduled for {format(currentDate, "MMMM yyyy")}</p>
        </div>
    );

    const grouped = monthEvents.reduce((acc, event) => {
        const dateKey = format(event.start, "yyyy-MM-dd");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    return (
        <ScrollArea className="h-full bg-muted/5 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {Object.entries(grouped).map(([date, dayEvents]) => (
                    <div key={date} className="relative">
                        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 mb-4 border-b flex items-center gap-2">
                            <div className={cn("text-lg font-bold w-12 h-12 rounded-xl flex flex-col items-center justify-center border shadow-sm bg-card transition-colors",
                                isToday(parseISO(date)) ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground"
                            )}>
                                <span>{format(parseISO(date), "dd")}</span>
                                <span className="text-[10px] font-normal uppercase">{format(parseISO(date), "EEE")}</span>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-foreground/80">{format(parseISO(date), "MMMM yyyy")}</span>
                                {/* Daily Summary */}
                                <div className="flex items-center gap-3 text-xs mt-0.5">
                                    <span className="text-emerald-600 font-medium flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +${dayEvents.filter(e => e.type === "income").reduce((a, b) => a + (b.amount || 0), 0)}</span>
                                    <span className="text-rose-600 font-medium flex items-center gap-0.5"><TrendingDown className="h-3 w-3 " /> -${dayEvents.filter(e => e.type === "expense").reduce((a, b) => a + (b.amount || 0), 0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 pl-4 border-l-2 border-muted ml-6">
                            {dayEvents.map(e => (
                                <div key={e.id} className={cn(
                                    "group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all",
                                    e.type === "project" && "border-l-4 border-l-blue-500",
                                    e.type === "expense" && "border-l-4 border-l-rose-500",
                                    e.type === "income" && "border-l-4 border-l-emerald-500",
                                )}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-base">{e.title}</h4>
                                            {e.type === "project" && e.status === "Active" && <Badge className="text-[10px] h-5" variant="secondary">Active</Badge>}
                                        </div>
                                        {e.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.description}</p>}

                                        {/* Meta Data Display */}
                                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                                            {e.meta?.categoryName && <span className="bg-muted px-2 py-0.5 rounded flex items-center gap-1">📁 {e.meta.categoryName}</span>}
                                            {e.meta?.personName && <span className="bg-muted px-2 py-0.5 rounded flex items-center gap-1">👤 {e.meta.personName}</span>}
                                        </div>
                                    </div>

                                    {e.amount !== undefined && (
                                        <div className="ml-auto flex items-center">
                                            <Badge variant="secondary" className={cn(
                                                "text-base px-3 py-1 font-bold",
                                                e.type === "income" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-50 border-rose-100"
                                            )}>
                                                {e.type === "income" ? "+" : "-"}${e.amount}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

// --- Detail Drawer Component ---
function FinancialDayDetails({ date, events }: { date: Date, events: CalendarEvent[] }) {
    // Filter events for this day
    const dayEvents = useMemo(() => {
        return events.filter(e => {
            if (e.type === "project") return isWithinInterval(date, { start: startOfDay(e.start), end: startOfDay(e.end) });
            return isSameDay(e.start, date);
        });
    }, [date, events]);

    const stats = useMemo(() => {
        const income = dayEvents.filter(e => e.type === "income").reduce((acc, e) => acc + (e.amount || 0), 0);
        const expense = dayEvents.filter(e => e.type === "expense").reduce((acc, e) => acc + (e.amount || 0), 0);
        return { income, expense, net: income - expense };
    }, [dayEvents]);

    return (
        <div className="h-full flex flex-col">
            <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl flex items-center gap-2">
                    <span className="bg-muted p-2 rounded-lg text-lg text-muted-foreground font-bold border">
                        {format(date, "dd")}
                    </span>
                    {format(date, "MMMM yyyy")}
                </SheetTitle>
                <SheetDescription>
                    {format(date, "EEEE")} • Financial Summary
                </SheetDescription>
            </SheetHeader>

            {/* Daily Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800 text-center">
                    <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Income</div>
                    <div className="text-lg font-bold text-emerald-600">+${stats.income}</div>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-100 dark:border-rose-800 text-center">
                    <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Expense</div>
                    <div className="text-lg font-bold text-rose-600">-${stats.expense}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/20 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xs text-muted-foreground uppercase font-semibold mb-1">Net</div>
                    <div className={cn("text-lg font-bold", stats.net >= 0 ? "text-emerald-600" : "text-rose-600")}>
                        {stats.net >= 0 ? '+' : ''}${stats.net}
                    </div>
                </div>
            </div>

            <Separator className="mb-6" />

            {/* Lists */}
            <ScrollArea className="flex-1 -mx-6 px-6">
                {dayEvents.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        No financial activity for this date.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Projects Active */}
                        {dayEvents.some(e => e.type === "project") && (
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                                    <Layers className="h-4 w-4" /> Active Projects
                                </h4>
                                {dayEvents.filter(e => e.type === "project").map(e => (
                                    <div key={e.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                                        <div className="font-semibold text-blue-900 dark:text-blue-100">{e.title}</div>
                                        <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">{e.description}</div>
                                        {/* Mock Deadline Indicator */}
                                        <div className="flex items-center gap-2 mt-2 text-[10px] uppercase font-bold text-blue-500">
                                            <Clock className="h-3 w-3" /> Ends: {format(e.end, "MMM d")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Transaction List */}
                        {(dayEvents.some(e => e.type === "expense") || dayEvents.some(e => e.type === "income")) && (
                            <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                                    <AlignJustify className="h-4 w-4" /> Transactions
                                </h4>
                                <div className="space-y-2">
                                    {dayEvents.filter(e => e.type !== "project").map(e => (
                                        <div key={e.id} className="flex flex-col p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium text-sm">{e.meta?.categoryName || "Uncategorized"}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{e.description || "No description"}</div>
                                                    <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                                        👤 {e.meta?.personName}
                                                        {e.meta?.projectName && <span className="text-blue-500">• 📁 {e.meta.projectName}</span>}
                                                    </div>
                                                </div>
                                                <div className={cn("font-bold text-sm", e.type === "income" ? "text-emerald-600" : "text-rose-600")}>
                                                    {e.type === "income" ? "+" : "-"}${e.amount}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
