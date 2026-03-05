import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function CalendarSkeleton() {
    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-background">
            {/* Financial Summary Bar Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="shadow-none border-none bg-muted/20">
                        <CardContent className="p-3 flex flex-col gap-1">
                            <Skeleton className="h-3 w-20 mb-1" />
                            <Skeleton className="h-6 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Header Controls Skeleton */}
            <div className="flex flex-col md:flex-row items-center justify-between py-2 px-4 gap-4 border-b">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-16" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-40" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-[160px]" />
                    <Skeleton className="h-6 w-[180px] rounded-lg" />
                    <Skeleton className="h-8 w-[100px]" />
                </div>
            </div>

            {/* Month View Grid Skeleton */}
            <div className="flex-1 overflow-auto bg-card grid grid-cols-7 grid-rows-[auto_1fr]">
                {/* Days Header */}
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="py-2 text-center border-b border-r last:border-r-0 bg-muted/5">
                        <Skeleton className="h-4 w-8 mx-auto" />
                    </div>
                ))}

                {/* Grid Cells */}
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="min-h-[140px] p-2 border-b border-r last:border-r-0 relative flex flex-col gap-2">
                        <div className="flex justify-between items-start mb-1">
                            <Skeleton className="h-7 w-7 rounded-full" />
                        </div>
                        <div className="flex flex-col gap-1 mt-1 flex-1">
                            <Skeleton className="h-5 w-full rounded-[4px]" />
                            <Skeleton className="h-5 w-[80%] rounded-[4px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
