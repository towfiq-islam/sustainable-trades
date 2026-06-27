import { FormData } from "./CreateListing";
import { Controller, UseFormReturn, UseFormWatch } from "react-hook-form";

type Category = {
  id: number | string;
  name: string;
};

type SubCategory = {
  id: number;
  category_id: number | string;
  sub_category_name: string;
};

interface CategorySectionProps {
  control: UseFormReturn<FormData>["control"];
  errors: UseFormReturn<FormData>["formState"]["errors"];
  categories: Category[];
  subcategories: SubCategory[];
  watch: UseFormWatch<FormData>;
}

const CategorySection = ({
  control,
  errors,
  categories,
  subcategories,
  watch,
}: CategorySectionProps) => {
  const category = watch("category_id");
  const filteredSubcategories = category
    ? subcategories.filter(sc => sc.category_id?.toString() === category)
    : [];

  return (
    <div>
      <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
        Category
      </h3>
      <Controller
        name="category_id"
        control={control}
        rules={{ required: "Category is required" }}
        render={({ field }) => (
          <select
            {...field}
            className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      />
      {errors.category_id && (
        <p className="text-red-600 text-sm mt-1">
          {errors.category_id.message as string}
        </p>
      )}

      {filteredSubcategories.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
            Subcategory
          </h3>
          <Controller
            name="sub_category_id"
            control={control}
            rules={{ required: "Subcategory is required" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2"
              >
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.sub_category_name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.sub_category_id && (
            <p className="text-red-600 text-sm mt-1">
              {errors.sub_category_id.message as string}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
