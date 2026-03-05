import { getCategories } from "@/actions/data-actions";
import { CategoryClient } from "./client";
import { auth } from "@/auth";

export default async function CategoriesPage() {
    const session = await auth();
    const categories = await getCategories();
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <CategoryClient data={categories} role={session?.user?.accountType} />
            </div>
        </div>
    );
}
