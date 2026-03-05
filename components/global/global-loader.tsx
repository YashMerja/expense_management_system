import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface GlobalLoaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export function GlobalLoader({ className, ...props }: GlobalLoaderProps) {
    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
                className
            )}
            {...props}
        >
            <Spinner className="size-12" />
        </div>
    );
}
