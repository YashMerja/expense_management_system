import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BudgetsLoading() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-9 w-[150px]" />
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <TableSkeleton />
            </div>
        </div>
    );
}
