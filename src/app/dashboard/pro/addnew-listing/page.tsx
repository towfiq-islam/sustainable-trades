"use client";
import { useState } from "react";
import useAuth from "@/Hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { useAddProduct } from "@/Hooks/api/dashboard_api";
import Header from "@/Components/BasicDashboardComponents/Header";
import MetaTags from "@/Components/BasicDashboardComponents/MetaTags";
import VideoUpload from "@/Components/BasicDashboardComponents/VideoUpload";
import ImageUpload from "@/Components/BasicDashboardComponents/ImageUpload";
import FormActions from "@/Components/BasicDashboardComponents/FormActions";
import PriceSection from "@/Components/BasicDashboardComponents/PriceSection";
import QuantitySection from "@/Components/BasicDashboardComponents/QuantitySection";
import CategorySection from "@/Components/BasicDashboardComponents/CategorySection";
import MembershipNotice from "@/Components/BasicDashboardComponents/MembershipNotice";
import {
  getProductCategoriesClient,
  getProductSubCategoriesClient,
} from "@/Hooks/api/cms_api";
import { useRouter } from "next/navigation";

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
};

type Category = {
  id: number | string;
  name: string;
};

type SubCategory = {
  id: number;
  category_id: number | string;
  sub_category_name: string;
};

const CreateListing = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Determine membership dynamically
  const membershipType = user?.membership?.membership_type || "basic";
  const isBasicMember = membershipType.toLowerCase() === "basic";

  console.log("Current selected membershipType:", membershipType);
  console.log("User object:", user);

  // Separate states for files and previews
  const [video, setVideo] = useState<File | null>(null);
  const [metaTags, setMetaTags] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { mutate: addProduct, isPending } = useAddProduct();
  const { data: categoriess } = getProductCategoriesClient();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const { data: subcategoriess } = getProductSubCategoriesClient();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
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
    },
  });

  const categories: Category[] = categoriess?.data || [];
  const subcategories: SubCategory[] = subcategoriess?.data || [];

  const onSubmit = (data: FormData) => {
    const formData = new FormData();

    if (user?.shop_info?.id) {
      formData.append("shop_info_id", String(user.shop_info.id));
    }

    formData.append("product_name", data.product_name);
    formData.append("product_price", data.product_price);
    formData.append("product_quantity", data.product_quantity);
    formData.append("weight", data.weight);
    formData.append("cost", data.cost);
    formData.append("description", data.description);
    formData.append("category_id", data.category_id);
    formData.append("sub_category_id", data.sub_category_id);
    formData.append("fulfillment", data.fulfillment);
    formData.append("selling_option", data.selling_option);
    formData.append("unlimited_stock", data.unlimited_stock ? "1" : "0");
    formData.append("out_of_stock", data.out_of_stock ? "1" : "0");
    formData.append("is_featured", data.is_featured ? "1" : "0");

    data.tags.forEach(tag => formData.append("tags[]", tag));

    // Use actual File objects
    imageFiles.forEach(file => formData.append("product_image[]", file));
    if (video) formData.append("video", video);

    addProduct(formData, {
      onSuccess: (data: any) => {
        reset({
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
        });
        setImageFiles([]);
        setPreviewImages([]);
        setVideo(null);
        setMetaTags([]);
        if (data?.success) {
          router.push("/dashboard/pro/view-listing");
        }
      },
    });
  };

  return (
    <div>
      <Header />
      {/* Optional: Display membership banner */}
      <MembershipNotice isBasicMember={isBasicMember} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-8">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-3 md:gap-6">
            {/* Product Name */}
            <div>
              <h3 className="text-[17px] md:text-[20px] font-semibold text-[#13141D]">
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
                    className="w-full border text-[16px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2 outline-none"
                  />
                )}
              />
              {errors.product_name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.product_name.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <ImageUpload
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              previewImages={previewImages}
              setPreviewImages={setPreviewImages}
              setValue={setValue}
              watch={watch}
            />

            {/* Quantity */}
            <QuantitySection
              control={control}
              errors={errors}
              isBasicMember={isBasicMember}
            />

            {/* Video Upload */}
            <VideoUpload
              video={video}
              setVideo={setVideo}
              setValue={setValue}
            />

            {/* Listing Status */}
            <div>
              <p className="font-semibold text-[20px] md:text-[24px] text-[#13141D]">
                Listing Status:{" "}
                <span className="px-3 py-2 text-white text-sm rounded-full bg-[#757575]">
                  Pending
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-4 md:gap-8">
            <PriceSection
              control={control}
              errors={errors}
              isBasicMember={isBasicMember}
            />

            {/* Description */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
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
                    className="w-full border text-[16px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2 outline-0"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Categories */}
            <CategorySection
              control={control}
              errors={errors}
              categories={categories}
              subcategories={subcategories}
              watch={watch}
            />

            {/* Fulfillment */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
                Fulfillment
              </h3>
              <Controller
                name="fulfillment"
                control={control}
                rules={{ required: "Fulfillment option is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full border text-[16px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2"
                  >
                    <option value="">Select Fulfillment</option>
                    <option>Arrange Local Pickup</option>
                    <option>Shipping</option>
                    <option>Arrange Local Pickup and Shipping</option>
                  </select>
                )}
              />
              {errors.fulfillment && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.fulfillment.message}
                </p>
              )}
            </div>

            {/* Meta Tags */}
            <MetaTags
              metaTags={metaTags}
              setMetaTags={setMetaTags}
              setValue={setValue}
            />

            {/* Selling Option */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
                Selling Option
              </h3>
              <Controller
                name="selling_option"
                control={control}
                rules={{ required: "Selling option is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full border text-[16px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2"
                  >
                    <option value="">Choose Below</option>
                    <option>Trade/Barter</option>
                    <option>For Sale or Trade Barter</option>
                    <option>For Sale</option>
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

        {/* Submit / Cancel */}
        <FormActions isPending={isPending} />
      </form>
    </div>
  );
};

export default CreateListing;
