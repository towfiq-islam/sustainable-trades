import Container from "@/Components/Common/Container";

// Single Product Skeleton
export const ProductSkeleton = () => {
  return (
    <div className="rounded-t-lg relative animate-pulse w-full">
      <div className="w-full h-[200px] md:h-[270px] rounded-lg bg-gray-200 border border-gray-100" />
      <div className="flex justify-between items-center mt-3 sm:mt-4 gap-2">
        <div className="h-4 sm:h-5 w-2/3 bg-gray-200 rounded" />
        <div className="size-5 sm:size-6 rounded-full bg-gray-200 shrink-0" />
      </div>
      <div className="flex justify-between mt-2 sm:mt-3 items-center">
        <div className="h-8 sm:h-9 w-24 sm:w-32 bg-gray-200 rounded-[5px]" />
      </div>
    </div>
  );
};

// All Listing Filtering Skeleton
export const FilteringSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:justify-between lg:items-end mb-6 sm:mb-8 animate-pulse w-full">
      {/* Left - Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-7 items-center w-full lg:w-auto">
        {/* Category */}
        <div className="w-full">
          <div className="h-10 w-full sm:w-[160px] lg:w-[192px] bg-gray-200 rounded-lg"></div>
        </div>

        {/* Sub Category */}
        <div className="w-full">
          <div className="h-10 w-full sm:w-[160px] lg:w-[192px] bg-gray-200 rounded-lg"></div>
        </div>

        {/* Sort By */}
        <div className="w-full">
          <div className="h-10 w-full sm:w-[160px] lg:w-[192px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Right - Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center mt-3 lg:mt-0 w-full lg:w-auto">
        {/* Search bar */}
        <div className="h-10 w-full sm:w-[220px] lg:w-[280px] bg-gray-200 rounded-[6px]"></div>

        {/* Reset button */}
        <div className="h-10 w-full sm:w-28 bg-gray-300 rounded-lg shrink-0"></div>
      </div>
    </div>
  );
};

// Product Details Skeleton
export const ProductDetailsSkeleton = () => {
  return (
    <section className="py-5 sm:py-10 animate-pulse w-full">
      <Container>
        <div className="mx-auto w-full">
          {/* Breadcrumb skeleton */}
          <div className="flex gap-2 items-center mb-5 flex-wrap">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded-full" />
            <div className="h-4 w-28 sm:w-32 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 2xl:gap-12 mb-10 lg:mb-16">
            {/* Left Side Skeleton */}
            <div className="space-y-6 sm:space-y-10 lg:space-y-16">
              {/* Product Gallery */}
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-2 sm:gap-3 order-2 md:order-1 overflow-x-auto pb-1 md:pb-0">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[75px] sm:w-[90px] md:w-[110px] xl:w-[120px] h-[65px] sm:h-[80px] md:h-[95px] xl:h-[100px] shrink-0 bg-gray-200 rounded-lg"
                    />
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 h-[260px] sm:h-[350px] md:h-[400px] xl:h-[445px] bg-gray-200 rounded-xl order-1 md:order-2" />
              </div>

              {/* Reviews Skeleton */}
              <div className="space-y-4 sm:space-y-5">
                <div className="h-7 sm:h-8 w-36 sm:w-40 bg-gray-200 rounded" />
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-5/6 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Skeleton */}
            <div className="space-y-6 sm:space-y-10">
              {/* Product Description Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-6 sm:h-7 w-3/4 bg-gray-200 rounded" />
                <div className="h-16 sm:h-20 w-full bg-gray-200 rounded" />
              </div>

              {/* Price & Quantity */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="h-7 sm:h-8 w-24 bg-gray-200 rounded" />
                <div className="h-10 sm:h-12 w-28 sm:w-32 bg-gray-200 rounded" />
              </div>

              {/* Buttons */}
              <div className="space-y-3 sm:space-y-4">
                <div className="h-11 sm:h-12 w-full bg-gray-200 rounded-lg" />
                <div className="h-11 sm:h-12 w-full bg-gray-200 rounded-lg" />
                <div className="h-11 sm:h-12 w-full bg-gray-200 rounded-lg" />
              </div>

              {/* Shop Info */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="size-12 sm:size-14 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-40 max-w-full bg-gray-200 rounded" />
                </div>
              </div>

              <div className="h-9 sm:h-10 w-36 sm:w-40 bg-gray-200 rounded" />
            </div>
          </div>

          {/* More Products & Subscribe Skeleton */}
          <div className="h-7 sm:h-8 w-44 sm:w-48 bg-gray-200 rounded mb-4 sm:mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

// Pricing Card Skeleton
export const PricingSkeletonCard = () => (
  <div className="border border-gray-200 shadow rounded-2xl p-4 sm:p-6 w-full md:w-[400px] flex flex-col justify-between animate-pulse">
    <div>
      <div className="size-10 sm:size-12 rounded-full bg-gray-300 mb-4" />

      <div className="h-6 bg-gray-300 rounded w-1/2 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />

      <div className="flex gap-2 items-end mb-5">
        <div className="h-8 bg-gray-300 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-10" />
      </div>

      <hr className="my-5 text-gray-300" />

      <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="size-8 sm:size-10 rounded-full bg-gray-300 shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-4 bg-gray-300 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="h-11 sm:h-12 bg-gray-300 rounded-lg w-full" />
  </div>
);

// Shop List Skeleton
export const ShopListSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 sm:items-center border-b last:border-b-0 border-gray-200 py-3 animate-pulse w-full">
      {/* shop Image skeleton */}
      <div className="size-20 sm:size-22 shrink-0 rounded-lg bg-gray-200"></div>

      {/* Shop Description skeleton */}
      <div className="flex flex-col gap-2.5 grow w-full min-w-0">
        <div className="h-4 w-3/4 sm:w-1/2 bg-gray-200 rounded"></div>

        {/* Review stars */}
        <div className="flex gap-1 items-center py-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="size-3.5 sm:size-4 bg-gray-300 rounded"></div>
          ))}
        </div>

        {/* Address line */}
        <div className="h-3.5 sm:h-4 w-5/6 sm:w-2/3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Single Shop Skeleton
export const SingleShopSkeleton = () => {
  return (
    <div className="text-center animate-pulse w-full px-1">
      {/* Circle Image Skeleton */}
      <figure className="size-28 sm:size-36 md:size-44 mx-auto rounded-full overflow-hidden bg-gray-200 aspect-square max-w-full"></figure>

      {/* Shop Name Skeleton */}
      <div className="mt-3 sm:mt-4 h-4 w-28 sm:w-32 max-w-[80%] mx-auto bg-gray-200 rounded"></div>

      {/* Address Skeleton */}
      <div className="mt-2 h-3 w-36 sm:w-48 max-w-[90%] mx-auto bg-gray-200 rounded"></div>
    </div>
  );
};

// Conversation Card Skeleton
export const ConversationCardSkeleton = () => {
  return (
    <div className="border-b last:border-b-0 border-gray-200 py-3.5 sm:py-4 px-2.5 sm:px-3 flex justify-between items-center animate-pulse w-full gap-2">
      <div className="flex gap-2.5 sm:gap-3 items-center min-w-0 flex-1">
        <div className="size-11 sm:size-13 rounded-full bg-gray-200 shrink-0" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-4 sm:h-5 w-28 sm:w-32 bg-gray-200 rounded" />
          <div className="h-3.5 sm:h-4 w-40 sm:w-48 max-w-full bg-gray-200 rounded" />
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-1.5 sm:gap-2">
        <div className="h-3.5 sm:h-4 w-12 sm:w-16 bg-gray-200 rounded" />
        <div className="h-4 sm:h-5 w-5 sm:w-6 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

// Trade Offer Skeleton
export const TradeOfferSkeleton = () => {
  return (
    <div className="animate-pulse space-y-5 sm:space-y-6 w-full">
      <div className="h-6 bg-gray-200 rounded w-1/2 sm:w-1/3"></div>
      <div className="h-5 bg-gray-200 rounded w-1/3 sm:w-1/4"></div>

      <div className="space-y-2.5">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      <div className="h-20 sm:h-24 bg-gray-200 rounded"></div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

// Shop Card Skeleton
export const ShopCardSkeleton = () => {
  return (
    <div className="text-center space-y-2.5 sm:space-y-3 animate-pulse w-full">
      <div className="size-28 sm:size-36 md:size-44 xl:size-52 2xl:size-64 mx-auto rounded-full bg-gray-300 border border-gray-100 max-w-full aspect-square" />
      <div className="h-4 sm:h-5 w-28 sm:w-40 max-w-[80%] mx-auto bg-gray-300 rounded" />
      <div className="flex gap-1.5 sm:gap-2 items-center justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="size-3 sm:size-4 bg-gray-300 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export const CustomerOrderTableSkeleton = () => {
  return (
    <div className="border border-light-gray rounded-[12px] overflow-hidden mt-6 sm:mt-10 w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[620px] text-left border-collapse">
          <thead>
            <tr className="bg-table-header text-[14px] sm:text-[15px] text-muted-gray font-semibold">
              <th className="px-4 sm:px-6 py-3.5 sm:py-4">Order</th>
              <th className="px-4 sm:px-6 py-3.5 sm:py-4">Items</th>
              <th className="px-4 sm:px-6 py-3.5 sm:py-4">Total</th>
              <th className="px-4 sm:px-6 py-3.5 sm:py-4">Status</th>
              <th className="px-4 sm:px-6 py-3.5 sm:py-4">Date</th>
              <th className="px-4 sm:px-6 py-3.5 sm:py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 4 }).map((_, index) => (
              <tr
                key={index}
                className="border-t border-light-gray animate-pulse"
              >
                {/* Order */}
                <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                  <div className="h-4 sm:h-5 w-24 sm:w-32 rounded bg-gray-200 mb-1.5" />
                  <div className="h-3.5 w-16 sm:w-20 rounded bg-gray-200" />
                </td>

                {/* Items */}
                <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                  <div className="flex items-center gap-2">
                    <div className="size-4 sm:size-5 rounded bg-gray-200 shrink-0" />
                    <div className="h-4 w-16 sm:w-20 rounded bg-gray-200" />
                  </div>
                </td>

                {/* Total */}
                <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                  <div className="h-4 sm:h-5 w-16 sm:w-20 rounded bg-gray-200" />
                </td>

                {/* Status */}
                <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                  <div className="h-6 sm:h-7 w-20 rounded-full bg-gray-200" />
                </td>

                {/* Date */}
                <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                  <div className="h-4 w-24 sm:w-28 rounded bg-gray-200" />
                </td>

                {/* Action */}
                <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                  <div className="ml-auto h-8 sm:h-9 w-24 sm:w-28 rounded-[8px] bg-gray-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CustomerReviewCardSkeleton = () => {
  return (
    <div className="border border-gray-300 rounded-xl p-4 sm:p-6 shadow-md bg-white flex flex-col items-center text-center animate-pulse w-full">
      <div className="size-14 sm:size-16 rounded-full mb-3 sm:mb-4 bg-gray-200" />
      <div className="h-4 sm:h-5 w-32 sm:w-40 bg-gray-200 rounded mb-2" />
      <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-gray-200 rounded mb-3 sm:mb-4" />
      <div className="space-y-2 w-full">
        <div className="h-3.5 sm:h-4 w-full bg-gray-200 rounded" />
        <div className="h-3.5 sm:h-4 w-5/6 bg-gray-200 rounded mx-auto" />
      </div>
      <div className="flex gap-1 mt-3 sm:mt-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="size-3.5 sm:size-4 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
};

export const NotificationSkeleton = () => {
  return (
    <div className="border-b border-divider-gray flex justify-between p-2.5 sm:p-4 md:p-5 items-center animate-pulse w-full gap-2 sm:gap-4">
      <div className="flex gap-2.5 sm:gap-4 md:gap-x-5 items-center flex-1 min-w-0">
        <div className="rounded-full size-11 sm:size-14 md:size-[65px] bg-gray-300 shrink-0" />
        <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
          <div className="h-4 w-28 sm:w-40 bg-gray-300 rounded" />
          <div className="h-3.5 sm:h-4 w-40 sm:w-64 max-w-full bg-gray-200 rounded" />
        </div>
      </div>

      <div className="h-3 w-12 sm:w-16 bg-gray-200 rounded shrink-0" />
    </div>
  );
};

export const OrderRowSkeleton = () => {
  return (
    <tr className="border-b border-gray-300 animate-pulse last:border-b-0">
      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-20 sm:w-24 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="h-4 w-24 sm:w-28 bg-gray-200 rounded" />
          <div className="h-3 w-28 sm:w-36 bg-gray-200 rounded" />
        </div>
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-10 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-14 sm:w-16 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-6 w-20 sm:w-24 bg-gray-200 rounded-full" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-12 sm:w-14 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-12 sm:w-14 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-12 sm:w-14 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-12 bg-gray-200 rounded" />
      </td>

      <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
        <div className="size-5 mx-auto bg-gray-200 rounded-full" />
      </td>
    </tr>
  );
};

export const PaymentRowSkeleton = () => {
  return (
    <tr className="border-b border-gray-300 animate-pulse">
      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-24 sm:w-28 bg-gray-200 rounded" />
      </td>
      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-20 sm:w-24 bg-gray-200 rounded" />
      </td>
      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-28 sm:w-36 bg-gray-200 rounded" />
      </td>
      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded" />
      </td>
      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="h-4 w-20 sm:w-24 bg-gray-200 rounded capitalize" />
      </td>
      <td className="py-3 sm:py-4 px-3 sm:px-4">
        <div className="min-w-[25px] h-6 sm:h-7 bg-gray-200 rounded-full" />
      </td>
    </tr>
  );
};

export const DiscountSkeleton = () => {
  return (
    <div className="py-4 sm:py-6 flex flex-col sm:flex-row sm:items-start sm:justify-between animate-pulse border-b border-gray-300 gap-3">
      <div className="flex gap-3 items-start flex-1 min-w-0">
        <div className="mt-1 size-4 rounded bg-gray-300 shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="h-4 sm:h-5 w-40 sm:w-64 max-w-full bg-gray-300 rounded" />
          <div className="h-3.5 sm:h-4 w-52 sm:w-80 max-w-full bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex items-start sm:items-end w-full sm:w-fit sm:justify-end flex-col space-y-1.5 pl-7 sm:pl-0">
        <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-gray-300 rounded" />
        <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export const TradeRequestSkeleton = () => {
  return (
    <div className="border border-border-gray p-3 sm:p-4 md:p-6 rounded-[8px] flex flex-col gap-4 animate-pulse mt-6 sm:mt-10 w-full">
      <div className="flex flex-col sm:flex-row justify-between gap-3 pb-4 border-b border-border-gray">
        <div className="flex flex-wrap gap-2.5 sm:gap-x-5 items-center">
          <div className="h-4 w-28 sm:w-32 bg-gray-300 rounded" />
          <div className="h-4 w-36 sm:w-44 bg-gray-300 rounded" />
          <div className="h-4 w-24 sm:w-28 bg-gray-300 rounded" />
        </div>
        <div className="h-8 w-24 sm:w-[100px] bg-gray-300 rounded shrink-0" />
      </div>

      {[...Array(2)].map((_, idx) => (
        <div key={idx}>
          {idx === 1 && (
            <div className="flex gap-x-3 sm:gap-x-5 items-center my-3 sm:my-4">
              <div className="bg-gray-300 w-full h-[1px]" />
              <div className="size-5 sm:size-6 bg-gray-300 rounded-full shrink-0" />
              <div className="bg-gray-300 w-full h-[1px]" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-x-6 md:gap-x-10">
              <div className="size-[85px] sm:size-[100px] bg-gray-300 rounded-md shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="h-4 sm:h-5 w-44 sm:w-64 max-w-full bg-gray-300 rounded" />
                <div className="h-3.5 sm:h-4 w-36 sm:w-48 max-w-full bg-gray-300 rounded" />
                <div className="h-3.5 sm:h-4 w-20 bg-gray-300 rounded" />
                <div className="h-3.5 sm:h-4 w-28 sm:w-32 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="h-4 sm:h-5 w-32 sm:w-40 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
      <div className="flex flex-wrap justify-between items-center border-t border-border-gray pt-3 gap-3">
        <div className="flex flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="h-9 sm:h-10 w-20 sm:w-24 bg-gray-300 rounded-md" />
            ))}
        </div>
      </div>
    </div>
  );
};

export const LocationRowSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.6fr_0.8fr_0.8fr] gap-2 md:gap-4 px-3 sm:px-5 py-3.5 sm:py-4 items-start md:items-center animate-pulse w-full">
    {/* location_name */}
    <div className="h-4 w-2/3 bg-gray-200 rounded" />

    {/* address block: line1 + line2 + country */}
    <div className="space-y-1.5 sm:space-y-2">
      <div className="h-3.5 w-5/6 bg-gray-200 rounded" />
      <div className="h-3.5 w-3/5 bg-gray-200 rounded" />
      <div className="h-3.5 w-2/5 bg-gray-200 rounded" />
    </div>

    {/* status dot + label */}
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-gray-200" />
      <span className="h-3.5 w-14 bg-gray-200 rounded" />
    </div>

    {/* action icons */}
    <div className="flex items-center gap-4 sm:gap-5">
      <span className="size-4 bg-gray-200 rounded" />
      <span className="size-4 bg-gray-200 rounded" />
    </div>
  </div>
);

// Review Card Skeleton
export const ReviewCardSkeleton = () => {
  return (
    <div className="border-b last:border-b-0 border-gray-200 py-4 sm:py-6 animate-pulse w-full">
      <div className="flex flex-wrap gap-3 sm:gap-5 items-center">
        <div className="h-4 sm:h-5 w-36 sm:w-48 bg-gray-200 rounded"></div>
        <div className="flex gap-1 items-center py-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="size-3 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="mt-2 space-y-2">
        <div className="h-3.5 sm:h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-3.5 sm:h-4 w-4/6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

const VendorCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-5 w-full">
    <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
      <div className="flex items-center gap-2.5">
        <div className="size-8 sm:size-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="space-y-1.5">
          <Bar className="h-3.5 w-28 sm:w-32" />
          <Bar className="h-3 w-16 sm:w-20" />
        </div>
      </div>
      <Bar className="h-3 w-24 sm:w-28" />
    </div>

    <Bar className="h-3 w-3/5 mb-3" />

    <div className="space-y-2 mb-3">
      <div className="flex justify-between">
        <Bar className="h-3 w-32 sm:w-40" />
        <Bar className="h-3 w-10" />
      </div>
      <div className="flex justify-between">
        <Bar className="h-3 w-28 sm:w-32" />
        <Bar className="h-3 w-10" />
      </div>
    </div>

    <div className="space-y-2 pt-2 border-t border-gray-100">
      <div className="flex justify-between">
        <Bar className="h-3 w-16" />
        <Bar className="h-3 w-10" />
      </div>
      <div className="flex justify-between">
        <Bar className="h-3 w-10" />
        <Bar className="h-3 w-10" />
      </div>
    </div>

    <div className="flex justify-between items-center border-t border-gray-100 pt-2.5 mt-2">
      <Bar className="h-3.5 w-20" />
      <Bar className="h-4 w-14" />
    </div>
  </div>
);

// Shop Banner Skeleton
export const ShopBannerSkeleton = () => {
  return (
    <section className="min-h-[380px] md:h-[600px] bg-gray-200 bg-no-repeat bg-center bg-cover bg-blend-overlay py-6 sm:py-10 mb-8 sm:mb-10 animate-pulse w-full">
      <Container>
        <div className="flex flex-col md:flex-row justify-between w-full">
          <div className="space-y-3 sm:space-y-4 w-full">
            <div className="flex md:justify-start justify-center items-center">
              <div className="size-20 sm:size-28 md:size-[153px] rounded-full bg-gray-300"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-6 md:items-center">
              <div className="h-7 sm:h-8 w-40 sm:w-48 bg-gray-300 rounded"></div>
              <div className="flex gap-2.5 sm:gap-3 items-center">
                <div className="size-7 sm:size-8 md:size-10 bg-gray-300 rounded-full"></div>
                <div className="size-7 sm:size-8 md:size-10 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            <div className="h-4 sm:h-5 bg-gray-300 rounded w-full max-w-xs sm:w-72"></div>
            <div className="h-4 sm:h-5 bg-gray-300 rounded w-full max-w-[260px] sm:w-64"></div>
            <div className="flex gap-2.5 sm:gap-3 items-center md:pt-3">
              <div className="size-4 sm:size-5 bg-gray-300 rounded shrink-0"></div>
              <div className="h-4 sm:h-5 w-36 sm:w-40 bg-gray-300 rounded"></div>
            </div>
            <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="size-7 sm:size-9 shrink-0 shadow border border-gray-300 rounded-full bg-gray-300"
                ></div>
              ))}
              <div className="h-4 sm:h-5 w-8 bg-gray-300 rounded"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-5 items-stretch sm:items-center md:pt-5 w-full sm:w-auto">
              <div className="h-10 w-full sm:w-40 bg-gray-300 rounded"></div>
              <div className="h-10 w-full sm:w-40 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

// About Shop Skeleton
export const AboutShopSkeleton = () => {
  return (
    <section id="About" className="mt-4 md:mt-8 lg:mt-16 animate-pulse w-full">
      <Container>
        <div className="h-6 w-32 bg-gray-200 rounded mb-4 sm:mb-6"></div>
        <div className="flex flex-col lg:flex-row gap-5 md:gap-10 lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 grow w-full">
            <div className="w-full h-[200px] sm:size-[240px] md:size-[280px] lg:size-[350px] shrink-0 bg-gray-200 rounded-xl"></div>
            <div className="flex flex-col gap-3 sm:gap-4 w-full">
              <div className="h-5 w-44 sm:w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-36 sm:w-40 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

// Shop Policies Skeleton
export const ShopPoliciesSkeleton = () => {
  return (
    <section id="Shop_policies" className="mt-4 md:mt-8 lg:mt-16 animate-pulse w-full">
      <Container>
        <div className="h-6 w-36 sm:w-40 bg-gray-200 rounded mb-4 sm:mb-5"></div>
        <div className="h-5 w-48 sm:w-56 bg-gray-200 rounded mb-2"></div>
        <div className="flex flex-col gap-2 mb-5 sm:mb-6">
          <div className="h-4 w-28 sm:w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-36 sm:w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 sm:w-28 bg-gray-200 rounded"></div>
        </div>
        <div className="h-5 w-44 sm:w-48 bg-gray-200 rounded mt-4 sm:mt-5 mb-2"></div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
        </div>
      </Container>
    </section>
  );
};

// Shop FAQ Skeleton
export const ShopFAQSkeleton = () => {
  return (
    <section className="pt-3 md:pt-6 lg:pt-12 pb-5 md:pb-10 lg:pb-20 animate-pulse w-full">
      <Container>
        <div className="h-6 w-24 bg-gray-200 rounded mb-3 sm:mb-4 md:mb-6"></div>
        <div className="border-b-2 border-gray-200 py-3 md:py-5">
          <div className="flex justify-between items-center gap-3">
            <div className="h-5 w-2/3 bg-gray-200 rounded"></div>
            <div className="size-5 sm:size-6 bg-gray-200 rounded-full shrink-0"></div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Container>
    </section>
  );
};

// Edit Shop Banner Skeleton
export const EditShopBannerSkeleton = () => {
  return (
    <section className="mb-8 sm:mb-12 animate-pulse w-full">
      <div className="h-[220px] sm:h-[280px] md:h-[350px] bg-gray-200 relative">
        <Container>
          <div className="flex h-[220px] sm:h-[280px] md:h-[350px] items-end relative">
            <figure className="size-24 sm:size-32 md:size-[180px] -mb-6 sm:-mb-8 md:-mb-10 relative bg-gray-300 rounded-full border-4 sm:border-[5px] border-white shrink-0" />
          </div>
        </Container>
      </div>
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 sm:mt-12 md:mt-14 gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <div className="h-7 sm:h-8 w-48 sm:w-60 bg-gray-300 rounded mb-3 sm:mb-4" />
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
              <div className="size-5 sm:size-6 bg-gray-300 rounded-full shrink-0" />
              <div className="h-4 sm:h-5 w-40 sm:w-48 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 items-center">
            <div>
              <div className="h-4 sm:h-5 w-32 sm:w-40 bg-gray-300 rounded mb-1.5 sm:mb-2" />
              <div className="h-3.5 sm:h-4 w-24 sm:w-32 bg-gray-200 rounded" />
            </div>
            <div className="size-11 sm:size-14 bg-gray-300 rounded-full shrink-0" />
          </div>
        </div>
      </Container>
    </section>
  );
};

// Shop Review Skeleton
export const ShopReviewSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-10 lg:items-center border-b last:border-b-0 border-gray-200 py-4 md:py-6 animate-pulse w-full">
      <div className="grow flex flex-col sm:flex-row gap-3.5 sm:gap-5 items-start">
        <figure className="shrink-0 size-12 sm:size-16 rounded-full bg-gray-200" />
        <div className="flex gap-4 sm:gap-10 w-full min-w-0">
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="h-4 w-28 sm:w-32 bg-gray-200 rounded" />
            <div className="flex gap-1 items-center py-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="size-3 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-5/6 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-auto xl:w-[300px] shrink-0 pt-2 lg:pt-0">
        <div className="flex items-center gap-3 sm:gap-5">
          <figure className="size-14 sm:size-16 rounded-lg bg-gray-200 shrink-0" />
          <div className="h-4 w-28 sm:w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const ProductRowSkeleton = () => {
  return (
    <tr className="border-b border-gray-300 animate-pulse">
      <td className="py-3 px-3">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="h-[60px] sm:h-[80px] w-[75px] sm:w-[100px] rounded-lg bg-gray-200 shrink-0" />
          <div className="h-4 w-28 sm:w-40 bg-gray-200 rounded" />
        </div>
      </td>
      <td className="px-3">
        <div className="h-7 sm:h-8 w-20 sm:w-24 bg-gray-200 rounded-full" />
      </td>
      <td className="px-3">
        <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded" />
      </td>
      <td className="px-3">
        <div className="h-4 w-12 bg-gray-200 rounded" />
      </td>
      <td className="px-3">
        <div className="h-4 w-14 sm:w-16 bg-gray-200 rounded" />
      </td>
      <td className="px-3">
        <div className="h-4 w-14 sm:w-16 bg-gray-200 rounded" />
      </td>
      <td className="px-3">
        <div className="h-7 sm:h-8 w-20 sm:w-24 bg-gray-200 rounded-full" />
      </td>
      <td className="px-3">
        <div className="size-5 bg-gray-200 rounded-full mx-auto" />
      </td>
    </tr>
  );
};

export function InventoryItemSkeleton() {
  return (
    <div className="py-3.5 sm:py-4 flex gap-3 items-center border-b last:border-b-0 border-gray-300 animate-pulse w-full">
      <div className="size-16 sm:size-20 bg-gray-300 rounded-lg shrink-0" />
      <div className="w-full min-w-0 space-y-1.5 sm:space-y-2">
        <div className="flex w-full justify-between items-center gap-2">
          <div className="h-3.5 w-1/2 bg-gray-300 rounded" />
          <div className="h-3.5 w-1/4 bg-gray-300 rounded" />
        </div>
        <div className="h-3 w-3/5 bg-gray-300 rounded" />
        <div className="h-3 w-1/4 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

export const OrderSuccessSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto w-full px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-6 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <Bar className="h-4 sm:h-5 w-44 sm:w-56" />
            <Bar className="h-3 w-32 sm:w-40" />
          </div>
        </div>
        <Bar className="h-9 sm:h-10 w-full sm:w-36 rounded-lg" />
      </div>

      {/* Info banner */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 space-y-2">
        <Bar className="h-3 w-full" />
        <Bar className="h-3 w-4/5" />
      </div>

      {/* Vendor cards */}
      <div className="mb-4 sm:mb-6">
        <VendorCardSkeleton />
      </div>

      {/* Overall totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2.5">
        <div className="flex justify-between">
          <Bar className="h-3.5 w-16" />
          <Bar className="h-3.5 w-12" />
        </div>
        <div className="flex justify-between">
          <Bar className="h-3.5 w-10" />
          <Bar className="h-3.5 w-12" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <Bar className="h-4 w-20" />
          <Bar className="h-6 sm:h-7 w-20 sm:w-24" />
        </div>
      </div>
    </div>
  );
};
