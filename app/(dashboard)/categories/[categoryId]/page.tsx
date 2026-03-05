import { getSubCategories, getCategory } from "@/actions/data-actions";
import { SubCategoryClient } from "./client";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function SubCategoriesPage({ params }: { params: { categoryId: string } }) {
    const session = await auth();
    const subCategories = await getSubCategories(parseInt(params.categoryId));
    const category = await getCategory(parseInt(params.categoryId));

    if (!category) {
        return <div>Category not found</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={category.logoPath || ""} />
                    <AvatarFallback className="text-xl">{category.categoryName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-between space-y-2 flex-1">
                    <h2 className="text-3xl font-bold tracking-tight">
                        {category.categoryName} - Sub Categories
                    </h2>
                </div>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <SubCategoryClient
                    data={subCategories}
                    categoryId={parseInt(params.categoryId)}
                    role={session?.user?.accountType}
                />
            </div>
        </div>
    );
}
