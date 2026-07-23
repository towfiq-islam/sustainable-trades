"use client";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MdInfo } from "react-icons/md";
import useAuth from "@/Hooks/useAuth";
import Header from "@/Components/PageComponents/dashboardPages/createListingComponents/Header";
import ImageUpload from "@/Components/PageComponents/dashboardPages/createListingComponents/ImageUpload";
import QuantitySection from "@/Components/PageComponents/dashboardPages/createListingComponents/QuantitySection";
import VideoUpload from "@/Components/PageComponents/dashboardPages/createListingComponents/VideoUpload";
import PriceSection from "@/Components/PageComponents/dashboardPages/createListingComponents/PriceSection";
import CategorySection from "@/Components/PageComponents/dashboardPages/createListingComponents/CategorySection";
import MetaTags from "@/Components/PageComponents/dashboardPages/createListingComponents/MetaTags";
import DimensionsSection from "./DimensionsSection";
import {
  useAddProductMutation,
  useGetProductCategoriesQuery,
  useGetProductSubCategoriesQuery,
} from "@/redux/api/productApi";

export type FormData = {
  shop_info_id: string | number;
  product_name: string;
  product_price: string;
  product_quantity: string;
  weight: string;
  cost: string;
  description: string;
  category_id: string;
  sub_category_id: string;
  fulfillment: string;
  selling_option: string;
  unlimited_stock: boolean;
  out_of_stock: boolean;
  is_featured: boolean;
  tags: string[];
  images: File[];
  video?: File | null;
  length: string;
  width: string;
  height: string;
  dimension_unit: "mm" | "cm" | "in";
};

type Category = { id: number | string; name: string };

type SubCategory = {
  id: number;
  category_id: number | string;
  sub_category_name: string;
};

interface CreateListingProps {
  variant: "basic" | "pro";
  membershipType?: string;
}

// ─── variant config ───────────────────────────────────────────────────────────
const VARIANT_CONFIG = {
  basic: {
    successRedirect: "/dashboard/basic/listing",
    fulfillmentLocked: true,
    shippingGuard: false,
    membershipSource: "prop" as const,
  },
  pro: {
    successRedirect: "/dashboard/pro/listing",
    fulfillmentLocked: false,
    shippingGuard: true,
    membershipSource: "user" as const,
  },
} as const;

const EMPTY_FORM: Omit<FormData, "shop_info_id"> = {
  product_name: "",
  product_price: "",
  product_quantity: "",
  weight: "",
  cost: "",
  description: "",
  category_id: "",
  sub_category_id: "",
  fulfillment: "",
  selling_option: "",
  unlimited_stock: false,
  out_of_stock: false,
  is_featured: false,
  tags: [],
  images: [],
  video: null,
  length: "",
  width: "",
  height: "",
  dimension_unit: "in" as const,
};

const CreateListing = ({
  variant,
  membershipType: membershipTypeProp = "basic",
}: CreateListingProps) => {
  const config = VARIANT_CONFIG[variant];
  const router = useRouter();
  const { user } = useAuth();
  const membershipType =
    config.membershipSource === "user"
      ? (user?.membership?.membership_type ?? "basic")
      : membershipTypeProp;
  const isBasicMember = membershipType.toLowerCase() === "basic";

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [metaTags, setMetaTags] = useState<string[]>([]);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const { data: categoriess } = useGetProductCategoriesQuery({});
  const { data: subcategoriess } = useGetProductSubCategoriesQuery({});

  const {
    control,
    handleSubmit,
    watch,
    register,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ defaultValues: EMPTY_FORM });

  const fulfillment = watch("fulfillment");
  const categoryId = watch("category_id");
  const subCategoryId = watch("sub_category_id");
  const categories: Category[] = categoriess?.data ?? [];
  const subcategories: SubCategory[] = subcategoriess?.data ?? [];

  const { ref: _imageRef, ...imageFieldProps } = register("images", {
    validate: value =>
      (value && value.length > 0) || "At least one image is required",
  });

  // ── submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    const fd = new FormData();

    if (user?.shop_info?.id)
      fd.append("shop_info_id", String(user.shop_info.id));

    fd.append("product_name", data.product_name);
    fd.append("product_price", data.product_price);
    fd.append("product_quantity", data.product_quantity);
    fd.append("cost", data.cost);
    fd.append("description", data.description);
    fd.append("category_id", data.category_id);
    fd.append("sub_category_id", data.sub_category_id);
    fd.append(
      "fulfillment",
      config.fulfillmentLocked ? "arrange_local_pickup" : data.fulfillment,
    );
    fd.append("selling_option", data.selling_option);
    fd.append("unlimited_stock", data.unlimited_stock ? "1" : "0");
    fd.append("out_of_stock", data.out_of_stock ? "1" : "0");
    fd.append("is_featured", data.is_featured ? "1" : "0");
    data.tags.forEach(tag => fd.append("tags[]", tag));
    imageFiles.forEach(file => fd.append("product_image[]", file));
    if (video) fd.append("video", video);

    fd.append("length", data.length);
    fd.append("weight", data.weight);
    fd.append("cost", data.cost);
    fd.append("width", data.width);
    fd.append("height", data.height);
    fd.append("dimension_unit", data.dimension_unit);
    fd.append("weight_unit", "lb");

    try {
      const res = await addProduct(fd).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        reset(EMPTY_FORM);
        setImageFiles([]);
        setPreviewImages([]);
        setVideo(null);
        setMetaTags([]);
        router.push(config.successRedirect);
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  // ── auto-tags from category / subcategory selection ───────────────────────
  useEffect(() => {
    const autoTags: string[] = [];

    if (user?.shop_info?.shop_name) autoTags.push(user.shop_info.shop_name);

    const selectedCat = categories.find(
      c => String(c.id) === String(categoryId),
    );
    if (selectedCat) autoTags.push(selectedCat.name);

    const selectedSub = subcategories.find(
      s => String(s.id) === String(subCategoryId),
    );
    if (selectedSub) autoTags.push(selectedSub.sub_category_name);

    const uniqueTags = [...new Set(autoTags)];
    setMetaTags(uniqueTags);
    setValue("tags", uniqueTags);
  }, [categoryId, subCategoryId, categories, subcategories, setValue]);

  // ── reset sub-category when category changes ──────────────────────────────
  useEffect(() => {
    setValue("sub_category_id", "");
  }, [categoryId, setValue]);

  // ── shipping guard (pro only) ─────────────────────────────────────────────
  useEffect(() => {
    if (!config.shippingGuard) return;

    const requiresShipping =
      fulfillment === "shipping" ||
      fulfillment === "arrange_local_pickup_and_shipping";

    if (!requiresShipping) return;

    if (!user?.onboarded) {
      toast("Please connect a payment processor before enabling shipping.", {
        icon: <MdInfo className="text-4xl text-primary-red" />,
      });
      setValue("fulfillment", "");
      return;
    }

    if (!user?.shop_info?.shipping_setting) {
      toast(
        "Please configure a shipping calculator (Flat Rate, By Weight, or Shippo) before enabling shipping.",
        { icon: <MdInfo className="text-4xl text-primary-red" /> },
      );
      setValue("fulfillment", "");
    }
  }, [fulfillment, user, setValue, config.shippingGuard]);

  return (
    <>
      <Header isBasicMember={isBasicMember} />

      {isBasicMember && (
        <div className="border mt-5 border-off-green/40 bg-off-green/20 rounded-lg p-5">
          <div className="flex gap-3">
            <div className="size-8 shrink-0 rounded-full bg-primary-green text-white flex items-center justify-center">
              i
            </div>

            <p className="text-[#374151] leading-6">
              <span className="font-bold block mb-1">
                You're currently using a Basic Membership.
              </span>
              Some listing features are only available with a Pro Membership. To
              unlock all listing options, visit the Membership tab to upgrade
              your account.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-8">
          {/* ── LEFT ── */}
          <div className="flex flex-col gap-3 md:gap-6">
            {/* Product Name */}
            <div>
              <h3 className="text-[17px] md:text-[20px] font-semibold text-secondary-black">
                Product Name / Service
              </h3>
              <Controller
                name="product_name"
                control={control}
                rules={{ required: "Product name is required" }}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2 outline-none"
                  />
                )}
              />
              {errors.product_name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.product_name.message}
                </p>
              )}
            </div>

            <>
              <ImageUpload
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                previewImages={previewImages}
                setPreviewImages={setPreviewImages}
                setValue={setValue}
                watch={watch}
              />

              <input type="hidden" {...imageFieldProps} />
              {errors.images && (
                <p className="text-red-600 text-sm -mt-4">
                  {errors.images.message as string}
                </p>
              )}
            </>

            <QuantitySection
              control={control}
              errors={errors}
              isBasicMember={isBasicMember}
              watch={watch}
            />

            <VideoUpload
              video={video}
              setVideo={setVideo}
              setValue={setValue}
            />

            <div>
              <p className="font-semibold text-[20px] md:text-[24px] text-secondary-black">
                Listing Status:{" "}
                <span className="px-3 py-2 text-white text-sm rounded-full bg-[#757575]">
                  Pending
                </span>
              </p>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-4 md:gap-8">
            <PriceSection
              control={control}
              errors={errors}
              isBasicMember={isBasicMember}
            />

            <DimensionsSection
              control={control}
              errors={errors}
              isBasicMember={isBasicMember}
            />

            {/* Description */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
                Description
              </h3>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={5}
                    className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2 outline-0"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <CategorySection
              control={control}
              errors={errors}
              categories={categories}
              subcategories={subcategories}
              watch={watch}
            />

            {/* Fulfillment */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
                Fulfillment
              </h3>

              {config.fulfillmentLocked ? (
                <>
                  <input type="hidden" {...register("fulfillment")} />
                  <select
                    disabled
                    value="arrange_local_pickup"
                    className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2 opacity-60"
                  >
                    <option value="arrange_local_pickup">
                      Arrange Local Pickup
                    </option>
                  </select>
                </>
              ) : (
                <>
                  <Controller
                    name="fulfillment"
                    control={control}
                    rules={{ required: "Fulfillment option is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2"
                      >
                        <option value="">Select Fulfillment</option>
                        <option value="arrange_local_pickup">
                          Arrange Local Pickup
                        </option>
                        <option value="shipping">Shipping</option>
                        <option value="arrange_local_pickup_and_shipping">
                          Arrange Local Pickup and Shipping
                        </option>
                      </select>
                    )}
                  />
                  {errors.fulfillment && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.fulfillment.message}
                    </p>
                  )}
                </>
              )}
            </div>

            <MetaTags
              metaTags={metaTags}
              setMetaTags={setMetaTags}
              setValue={setValue}
            />

            {/* Selling Option */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
                Selling Option
              </h3>
              <Controller
                name="selling_option"
                control={control}
                rules={{ required: "Selling option is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2"
                  >
                    <option value="">Choose Below</option>
                    <option value="trade/barter">Trade/Barter</option>
                    <option value="for_sale_or_trade_barter">
                      For Sale or Trade Barter
                    </option>
                    <option value="for_sale">For Sale</option>
                  </select>
                )}
              />
              {errors.selling_option && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.selling_option.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-5 md:mt-10 items-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-accent-red duration-500 ease-in-out text-white py-2.5 md:py-5 px-6 md:px-12 flex items-center justify-center gap-2 cursor-pointer rounded-lg font-semibold hover:bg-[#a34739] mt-6 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {isLoading ? "Request Approval..." : "Request Approval"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateListing;
