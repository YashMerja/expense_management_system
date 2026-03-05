import { Skeleton } from "@/components/ui/skeleton";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export function ProjectCardSkeleton() {
    return (
        <CardSpotlight className="h-full flex flex-col justify-between p-6 [--spotlight-color:#e5e7eb] dark:[--spotlight-color:#262626]">
            <div className="relative z-20 w-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>

                {/* Project Info */}
                <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <Skeleton className="h-7 w-[70%]" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Skeleton className="h-10 w-full z-20 rounded-md" />
        </CardSpotlight>
    );
}
