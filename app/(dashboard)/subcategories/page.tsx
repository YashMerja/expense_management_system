import { getCategories, getSubCategories } from "@/actions/data-actions";
import { SubCategoryClient } from "./client";

export default async function SubCategoriesPage() {
    const subCategories = await getSubCategories();
    const categories = await getCategories();

    return (
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <SubCategoryClient
                data={subCategories as any} // Cast to any to avoid minor type mismatch if 'category' include isn't perfectly typed in Action return vs Client Prop
                categories={categories}
            />
        </div>
    );
}
