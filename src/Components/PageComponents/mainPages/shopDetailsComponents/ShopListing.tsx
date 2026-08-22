import { useMemo } from "react";
import Product from "@/Components/Common/Product";
import Container from "@/Components/Common/Container";
import { SearchSvg } from "@/Components/Svg/SvgContainer";
import { GrPowerReset } from "react-icons/gr";
import { FiStar, FiSearch } from "react-icons/fi";
import { FilteringSkeleton, ProductSkeleton } from "@/Components/Loader/Loader";
import PaginationControl from "@/Components/Common/PaginationControl";
import { EmptyState } from "@/Components/Common/EmptyState";

type SubCategoryItem = {
  id: number;
  category_id: number;
  sub_category_name: string;
  taxability_code: string;
};

type CategoryItem = {
  id: number;
  name: string;
  image: string;
  icon: string;
  subcategories: SubCategoryItem[];
};

const ShopListing = ({
  featuredListings,
  allListings,
  category,
  subCategory,
  setSearch,
  setCategory,
  setSubCategory,
  setSortBy,
  setPage,
  listingsLoading,
  featuredLoading,
  categoriesLoading,
  categoriesWithSubCategories,
}: any) => {
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setSubCategory("");
    setSortBy("");
  };

  // Only relevant once a category is picked - subcategories that belong to it.
  const subCategoryOptions: SubCategoryItem[] = useMemo(() => {
    if (!category || !categoriesWithSubCategories?.length) return [];

    const selectedCategory = categoriesWithSubCategories.find(
      (cat: CategoryItem) => String(cat.id) === String(category),
    );

    return selectedCategory?.subcategories ?? [];
  }, [categoriesWithSubCategories, category]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    // Previously selected sub-category won't belong to the new category
    // (or to "All Categories"), so clear it to avoid a stale filter.
    setSubCategory("");
  };

  return (
    <section id="Listings" className="mt-10">
      <Container>
        {/* Title */}
        <h2 className="section_sub_title">Featured Listings</h2>

        {featuredLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-5 lg:mb-10">
            {Array.from({ length: 3 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : featuredListings?.length === 0 ? (
          <div className="mb-5 lg:mb-10">
            <EmptyState
              icon={<FiStar />}
              title="No featured listings right now"
              description="Vendors haven't been featured yet. Check back soon, or browse everything in All Listings below."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 mb-5 lg:mb-10">
            {featuredListings?.slice(0, 3)?.map((product: any) => (
              <Product
                key={product?.id}
                product={product}
                is_feathered={true}
              />
            ))}
          </div>
        )}

        {/* All Listings */}
        <h2 className="section_sub_title">All Listings</h2>

        {/* Filtering */}
        {categoriesLoading ? (
          <FilteringSkeleton />
        ) : (
          <div className="flex flex-col gap-3 flex-wrap lg:flex-row lg:justify-between lg:items-end mb-8">
            {/* Left - Filter */}
            <div className="flex flex-col md:flex-row gap-4 xl:gap-7 md:items-center">
              <div className="w-full">
                <h3 className="text-secondary-gray md:text-base text-xs font-semibold mb-1.5">
                  Product Category
                </h3>

                <select
                  value={category || ""}
                  onChange={e => handleCategoryChange(e.target.value)}
                  className="border w-full md:w-[192px] md:text-base text-xs rounded-lg px-3 py-1.5 md:py-3 border-gray-400 outline-none text-secondary-gray"
                >
                  <option value="">All Categories</option>
                  {categoriesWithSubCategories?.map(
                    ({ id, name }: CategoryItem) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Sub Category - only shown once a category is picked,
                  and only if that category actually has subcategories */}
              {category && subCategoryOptions.length > 0 && (
                <div className="w-full">
                  <h3 className="text-secondary-gray md:text-base text-xs font-semibold mb-1.5">
                    Product Sub Category
                  </h3>

                  <select
                    value={subCategory || ""}
                    onChange={e => setSubCategory(e.target.value)}
                    className="border w-full md:w-[192px] md:text-base text-xs rounded-lg px-3 py-1.5 md:py-3 border-gray-400 outline-none text-secondary-gray"
                  >
                    <option value="">All Sub Categories</option>
                    {subCategoryOptions.map(
                      ({ id, sub_category_name }: SubCategoryItem) => (
                        <option key={id} value={id}>
                          {sub_category_name}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}

              <div className="w-full">
                <h3 className="text-secondary-gray md:text-base text-xs font-semibold mb-1.5">
                  Sort By
                </h3>
                <select
                  onChange={e => setSortBy(e.target.value)}
                  className="border w-full md:w-[192px] md:text-base text-xs rounded-lg px-3 py-1.5 md:py-3 border-gray-400 outline-none text-secondary-gray"
                >
                  <option value="recently_added">Recently added</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </div>

            {/* Right - Search */}
            <div className="flex gap-3 items-center">
              {/* Search bar */}
              <div className="flex justify-end gap-1 items-center border border-gray-400 px-2 py-1.5 md:py-3 rounded-[6px] w-full md:w-[280px]">
                <SearchSvg />
                <input
                  type="text"
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search all listings..."
                  className="w-full border-none outline-none md:text-base text-xs"
                />
              </div>

              {/* Reset */}
              <button
                onClick={resetFilters}
                className="flex gap-2 items-center cursor-pointer px-4 py-2 md:py-3 rounded-lg border-gray-200 relative duration-300 transition-all hover:bg-secondary-blue hover:text-white border hover:border-transparent text-white bg-primary-green"
              >
                <GrPowerReset />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Map */}
        {listingsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : allListings?.length === 0 ? (
          <EmptyState
            icon={<FiSearch />}
            title="No listings match your filters"
            description="We couldn't find any products for this search and filter combination. Try adjusting your filters or resetting them to see everything."
            actionLabel="Reset filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {allListings?.data?.map((product: any) => (
              <Product key={product?.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!listingsLoading && allListings?.data && (
          <div className="py-8">
            <PaginationControl
              currentPage={allListings.current_page}
              lastPage={allListings.last_page}
              onPageChange={setPage}
            />
          </div>
        )}
      </Container>
    </section>
  );
};

export default ShopListing;
