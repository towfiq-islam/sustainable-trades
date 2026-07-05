"use client";
import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { FaAngleRight, FaPlay, FaPlus } from "react-icons/fa";
import { MdArrowOutward, MdDelete, MdInfo } from "react-icons/md";
import Preview from "@/Assets/fallbackimage.png";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/Hooks/useAuth";
import { PuffLoader } from "react-spinners";
import toast from "react-hot-toast";
import {
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useGetProductCategoriesQuery,
  useGetProductSubCategoriesQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProductData {
  id: number;
  shop_info_id: number;
  product_name: string;
  product_price: string;
  product_quantity: string | null;
  length: string;
  width: string;
  height: string;
  dimension_unit: "mm" | "cm" | "in";
  cost: string;
  weight: string;
  unlimited_stock: boolean;
  out_of_stock: boolean;
  video: string | null;
  description: string;
  category_id: string;
  sub_category_id: string;
  fulfillment: string;
  selling_option: string;
  status: string;
  is_featured: boolean;
  images: Array<{ id: number; product_id: number; image: string }>;
  meta_tags: Array<{ id: number; product_id: number; tag: string }>;
}

interface KeptImage {
  id: number;
  relativePath: string;
  fullPath: string;
}

export type UpdateFormData = {
  product_name: string;
  product_price: string;
  product_quantity: string;
  length: string;
  width: string;
  weight: string;
  height: string;
  dimension_unit: "mm" | "cm" | "in";
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

// ── Variant config ─────────────────────────────────────────────────────────────

const VARIANT_CONFIG = {
  basic: {
    listingHref: "/dashboard/basic/listing",
    successRedirect: "/dashboard/basic/listing",
    fulfillmentLocked: true,
    proFeaturesEnabled: false,
    shippingGuard: false,
  },
  pro: {
    listingHref: "/dashboard/pro/view-listing",
    successRedirect: "/dashboard/pro/view-listing",
    fulfillmentLocked: false,
    proFeaturesEnabled: true,
    shippingGuard: true,
  },
} as const;

interface UpdateListingProps {
  variant: "basic" | "pro";
  params: Promise<{ id: string }>;
}

// ── Component ──────────────────────────────────────────────────────────────────

const UpdateListing = ({ variant }: UpdateListingProps) => {
  const config = VARIANT_CONFIG[variant];
  const params = useParams();
  const id = Number(params?.id);
  const { user } = useAuth();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const proOnly = config.proFeaturesEnabled;

  const hasPaymentProcessor = !!user?.onboarded;
  const hasShippingCalculator =
    user?.shop_info?.shipping_setting !== null &&
    user?.shop_info?.shipping_setting !== undefined;

  const { data: listing, isLoading } = useGetSingleProductQuery(id, {
    skip: !id,
  });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [deleteProductImage, { isLoading: isDeletingImage }] =
    useDeleteProductImageMutation();
  const { data: categoriesData } = useGetProductCategoriesQuery({});
  const { data: subcategoriesData } = useGetProductSubCategoriesQuery({});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [keptImages, setKeptImages] = useState<KeptImage[]>([]);
  const [keptImagePaths, setKeptImagePaths] = useState<string[]>([]);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [hasExistingVideo, setHasExistingVideo] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [metaTags, setMetaTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateFormData>({
    defaultValues: {
      product_name: "",
      product_price: "",
      product_quantity: "",
      length: "",
      weight: "",
      width: "",
      height: "",
      dimension_unit: "in",
      cost: "",
      description: "",
      category_id: "",
      sub_category_id: "",
      fulfillment: config.fulfillmentLocked ? "arrange_local_pickup" : "",
      selling_option: "",
      unlimited_stock: false,
      out_of_stock: false,
      is_featured: false,
      tags: [],
      images: [],
      video: null,
    },
  });

  const categoryId = watch("category_id");
  const subCategoryId = watch("sub_category_id");
  const unlimitedStock = watch("unlimited_stock");
  const fulfillment = watch("fulfillment");
  const categories = categoriesData?.data ?? [];
  const subcategories = subcategoriesData?.data ?? [];

  const hydrate = (productData: ProductData) => {
    reset({
      product_name: productData.product_name || "",
      product_price: productData.product_price || "",
      product_quantity: productData.product_quantity?.toString() || "",
      length: productData.length || "",
      width: productData.width || "",
      height: productData.height || "",
      dimension_unit: productData.dimension_unit || "in",
      cost: productData.cost || "",
      weight: productData.weight || "",
      description: productData.description || "",
      category_id: productData.category_id?.toString() || "",
      sub_category_id: productData.sub_category_id?.toString() || "",
      fulfillment: config.fulfillmentLocked
        ? "arrange_local_pickup"
        : productData.fulfillment || "",
      selling_option: productData.selling_option || "",
      unlimited_stock: productData.unlimited_stock || false,
      out_of_stock: productData.out_of_stock || false,
      is_featured: productData.is_featured || false,
      tags: productData.meta_tags?.map(t => t.tag) || [],
      images: [],
      video: null,
    });

    const tags = productData.meta_tags?.map(t => t.tag) || [];
    setMetaTags(tags);

    // Images
    const kept: KeptImage[] = (productData.images || []).map(img => {
      const rel = img.image.startsWith("http")
        ? img.image.replace(`${baseUrl}/`, "")
        : img.image;
      const full = rel.startsWith("http") ? rel : `${baseUrl}/${rel}`;
      return { id: img.id, relativePath: rel, fullPath: full };
    });
    setKeptImages(kept);
    setKeptImagePaths(kept.map(i => i.fullPath));
    setAllImages(kept.map(i => i.fullPath));
    if (kept.length > 0) setMainImage(kept[0].fullPath);

    // Video
    const vid = productData.video ? `${baseUrl}/${productData.video}` : null;
    setVideoUrl(vid);
    setHasExistingVideo(!!productData.video);
    setShowPlayButton(!vid);
    setVideoFile(null);
    setImageFiles([]);
  };

  useEffect(() => {
    if (listing?.data) hydrate(listing.data);
  }, [listing]);

  // ── Auto meta-tags when category / subcategory changes ────────────────────

  useEffect(() => {
    if (!categories.length) return;

    const autoTags: string[] = [];

    if (user?.shop_info?.shop_name) autoTags.push(user.shop_info.shop_name);

    const selectedCat = categories.find(
      (c: any) => String(c.id) === String(categoryId),
    );
    if (selectedCat) autoTags.push(selectedCat.name);

    const selectedSub = subcategories.find(
      (s: any) => String(s.id) === String(subCategoryId),
    );
    if (selectedSub) autoTags.push(selectedSub.sub_category_name);

    const unique = [...new Set(autoTags)];
    setMetaTags(unique);
    setValue("tags", unique);
  }, [categoryId, subCategoryId, categories, subcategories]);

  // ── Shipping guard (pro only) ──────────────────────────────────────────────
  useEffect(() => {
    if (!config.shippingGuard) return;
    const requiresShipping =
      fulfillment === "shipping" ||
      fulfillment === "arrange_local_pickup_and_shipping";
    if (!requiresShipping) return;

    if (!hasPaymentProcessor) {
      toast("Please connect a payment processor before enabling shipping.", {
        icon: <MdInfo className="text-4xl text-primary-red" />,
      });
      setValue("fulfillment", "");
      return;
    }
    if (!hasShippingCalculator) {
      toast(
        "Please configure a shipping calculator before enabling shipping.",
        {
          icon: <MdInfo className="text-4xl text-primary-red" />,
        },
      );
      setValue("fulfillment", "");
    }
  }, [fulfillment, config.shippingGuard]);

  // ── Image handlers ─────────────────────────────────────────────────────────

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const previews = files.map(f => URL.createObjectURL(f));
    setImageFiles(prev => [...prev, ...files]);
    setAllImages(prev => [...prev, ...previews]);
    if (!mainImage && previews.length > 0) setMainImage(previews[0]);
  };

  const handleRemoveImage = (imageUrl: string, isNew: boolean) => {
    if (isNew) {
      setImageFiles(prev => {
        const idx = prev.findIndex(f => URL.createObjectURL(f) === imageUrl);
        if (idx > -1) {
          URL.revokeObjectURL(imageUrl);
          return prev.filter((_, i) => i !== idx);
        }
        return prev;
      });
      const updated = allImages.filter(u => u !== imageUrl);
      setAllImages(updated);
      if (mainImage === imageUrl) setMainImage(updated[0] || null);
      return;
    }

    const img = keptImages.find(i => i.fullPath === imageUrl);
    if (!img) return;
    setDeletingIds(prev => new Set([...prev, img.id]));

    try {
      const res: any = deleteProductImage(img?.id).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        const updatedKept = keptImages.filter(i => i.id !== img.id);
        setKeptImages(updatedKept);
        setKeptImagePaths(updatedKept.map(i => i.fullPath));
        const updated = allImages.filter(u => u !== imageUrl);
        setAllImages(updated);
        if (mainImage === imageUrl) setMainImage(updated[0] || null);

        setDeletingIds(prev => {
          const s = new Set(prev);
          s.delete(img.id);
          return s;
        });
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
      setDeletingIds(prev => {
        const s = new Set(prev);
        s.delete(img.id);
        return s;
      });
    }
  };

  // ── Video handlers ─────────────────────────────────────────────────────────

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setHasExistingVideo(false);
    setShowPlayButton(true);
    setTimeout(() => videoRef.current?.load(), 0);
  };

  const handleRemoveVideo = () => {
    if (videoRef.current?.src.startsWith("blob:"))
      URL.revokeObjectURL(videoRef.current.src);
    setVideoUrl(null);
    setVideoFile(null);
    setHasExistingVideo(false);
    setShowPlayButton(true);
  };

  const handlePlay = () =>
    videoRef.current
      ?.play()
      .then(() => setShowPlayButton(false))
      .catch(console.error);

  const handlePause = () => {
    videoRef.current?.pause();
    setShowPlayButton(true);
  };

  // ── Tag handlers ───────────────────────────────────────────────────────────

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const updated = [...metaTags, newTag.trim()];
    setMetaTags(updated);
    setValue("tags", updated);
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    const updated = metaTags.filter(t => t !== tag);
    setMetaTags(updated);
    setValue("tags", updated);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit = async (data: UpdateFormData) => {
    if (keptImages.length === 0 && imageFiles.length === 0) {
      if (!confirm("This will remove all images. Continue?")) return;
    }

    const fd = new FormData();
    fd.append("product_name", data.product_name);
    fd.append("product_price", data.product_price);
    fd.append("cost", data.cost);
    fd.append("weight", data.weight);
    fd.append("length", data.length);
    fd.append("width", data.width);
    fd.append("height", data.height);
    fd.append("dimension_unit", data.dimension_unit);
    fd.append("weight_unit", "lb");
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
    if (data.product_quantity)
      fd.append("product_quantity", data.product_quantity);

    metaTags.forEach(tag => fd.append("tags[]", tag));
    keptImages.forEach(img => fd.append("keep_image_ids[]", img.id.toString()));
    imageFiles.forEach(file => fd.append("product_image[]", file));

    if (videoFile) fd.append("video", videoFile);
    else if (hasExistingVideo) fd.append("video", "");

    try {
      const res = await updateProduct({ id, data: fd }).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        hydrate(res.data);
        router.push(config.successRedirect);
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const confirmDelete = () => {
    setShowDeleteModal(false);

    deleteProduct(id)
      .unwrap()
      .then(res => {
        toast.success(res.message);
        router.push(config.listingHref);
      })
      .catch(err => {
        toast.error(err?.data?.message || "Failed to delete product");
      });
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <PuffLoader color="#274F45" />
      </div>
    );
  }

  const statusBadge =
    listing?.data?.status === "listing"
      ? "Active"
      : listing?.data?.status || "Pending";

  const previewImages = [
    ...keptImagePaths,
    ...allImages.filter(u => !keptImagePaths.includes(u)),
  ];

  const filteredSubcategories = subcategories.filter(
    (s: any) =>
      String(s.category_id) === String(categoryId) ||
      String(s.id) === String(watch("sub_category_id")),
  );

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center gap-3">
        <div>
          <h3 className="text-[30px] md:text-[40px] font-semibold text-secondary-black">
            {watch("product_name") || "Edit Listing"}
          </h3>
          <div className="flex gap-x-2 items-center pt-2">
            <span className="text-[16px] text-secondary-black">Listings</span>
            <FaAngleRight className="mt-1" />
            <span className="text-[16px] text-secondary-black">
              Edit Listing
            </span>
          </div>
        </div>
        <Link href={config.listingHref} className="shrink-0">
          <button className="text-secondary-black font-semibold flex gap-x-1 items-center border-2 border-secondary-black rounded-lg py-1.5 md:py-3 px-6 hover:bg-accent-red hover:text-white duration-300 cursor-pointer">
            <MdArrowOutward />
            View Listings
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 md:gap-8 mt-8">
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
                    {...field}
                    type="text"
                    className="w-full border text-[18px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2 outline-none"
                  />
                )}
              />
              {errors.product_name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.product_name.message}
                </p>
              )}
            </div>

            {/* Main image preview */}
            <div>
              <div className="w-full relative h-[400px] md:h-[500px]">
                <Image
                  src={mainImage || Preview}
                  alt="Main product preview"
                  fill
                  unoptimized
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 flex-wrap mt-3">
                {previewImages.map((src, idx) => {
                  const isNew = !keptImagePaths.includes(src);
                  const kept = isNew
                    ? null
                    : keptImages.find(i => i.fullPath === src);
                  const isDeleting = !!kept && deletingIds.has(kept.id);
                  return (
                    <div key={idx} className="relative">
                      <img
                        src={src}
                        alt={`Product image ${idx + 1}`}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                        onClick={() => setMainImage(src)}
                      />
                      <button
                        type="button"
                        disabled={isDeletingImage}
                        onClick={() =>
                          !isDeletingImage && handleRemoveImage(src, isNew)
                        }
                        className={`absolute top-0 right-0 bg-primary-red text-white cursor-pointer rounded-full w-5 h-5 flex items-center justify-center text-xs ${isDeletingImage ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {isDeletingImage ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                        ) : (
                          "×"
                        )}
                      </button>
                    </div>
                  );
                })}
                <label className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-[#F5F5F5] rounded-lg cursor-pointer hover:bg-gray-100">
                  <FaPlus />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-[17px] md:text-[20px] font-semibold text-secondary-black">
                Quantity
              </h3>
              <Controller
                name="product_quantity"
                control={control}
                rules={{
                  validate: value => {
                    if (unlimitedStock) return true;
                    if (!value) return "Quantity is required";
                    if (!/^\d+$/.test(value))
                      return "Quantity must be a number";
                    return true;
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      type="number"
                      className={`w-full md:w-[350px] border border-accent-gray rounded-lg p-2 md:p-4 mt-2 text-[20px] text-secondary-black font-normal outline-0`}
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />

              <div className="flex flex-col gap-4 mt-2">
                {/* Unlimited Stock */}
                <label
                  className={`flex items-center gap-2 text-[17px] md:text-[20px] font-semibold ${!proOnly ? "text-gray-400" : "text-secondary-black"}`}
                >
                  Unlimited Stock
                  <Controller
                    name="unlimited_stock"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        disabled={!proOnly}
                        onChange={e => field.onChange(e.target.checked)}
                        className={`mt-1 accent-primary-green ${!proOnly ? "cursor-not-allowed" : ""}`}
                      />
                    )}
                  />
                </label>

                {/* Feature */}
                <label className="flex items-center gap-2 text-[17px] md:text-[20px] font-semibold text-secondary-black">
                  Feature
                  <Controller
                    name="is_featured"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        className="mt-1 accent-primary-green"
                      />
                    )}
                  />
                </label>

                {/* Out of Stock */}
                <label
                  className={`flex items-center gap-2 text-[17px] md:text-[20px] font-semibold ${!proOnly ? "text-gray-400" : "text-secondary-black"}`}
                >
                  Out of Stock
                  <Controller
                    name="out_of_stock"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        disabled={!proOnly}
                        onChange={e => field.onChange(e.target.checked)}
                        className={`mt-1 accent-primary-green ${!proOnly ? "cursor-not-allowed" : ""}`}
                      />
                    )}
                  />
                </label>

                <p className="text-[16px] text-secondary-black font-normal max-w-[400px]">
                  Status automatically changes to "Out of Inventory" when zero
                  inventory is reached
                </p>
              </div>
            </div>

            {/* Video upload */}
            <div>
              <h3 className="text-[17px] md:text-[20px] text-secondary-black font-semibold">
                Listing Approval Process
              </h3>
              <p className="text-[16px] text-[#67645F] mt-2 max-w-[400px]">
                In the video, share details about how and where your product was
                made, how your food was grown, and how it aligns with our
                sustainability guidelines.
              </p>
              <div className="flex gap-4 mt-3">
                <label className="px-4 md:px-8 py-2.5 md:py-5 bg-[#F0EEE9] rounded-lg cursor-pointer text-[16px] text-secondary-black hover:bg-gray-100">
                  Upload video
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </label>
                {videoUrl && (
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    onClick={handleRemoveVideo}
                  >
                    Remove video
                  </button>
                )}
              </div>
              {videoUrl && (
                <div className="mt-4 w-[300px] relative">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="h-[250px] w-full rounded-lg object-cover"
                    onClick={() =>
                      videoRef.current?.paused ? handlePlay() : handlePause()
                    }
                  />
                  {showPlayButton && (
                    <button
                      type="button"
                      className="h-24 w-24 bg-[#626161] text-white rounded-full absolute cursor-pointer top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center items-center"
                      onClick={e => {
                        e.stopPropagation();
                        handlePlay();
                      }}
                    >
                      <FaPlay className="size-10" />
                    </button>
                  )}
                  {!showPlayButton && (
                    <button
                      type="button"
                      className="absolute top-2 right-2 px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                      onClick={handlePause}
                    >
                      Pause
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Status */}
            <p className="font-semibold text-[20px] md:text-[24px] text-secondary-black">
              Listing Status:{" "}
              <span className="px-3 py-2 text-white text-sm rounded-full bg-[#757575] capitalize">
                {statusBadge}
              </span>
            </p>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-4 md:gap-8">
            {/* Price */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
                Price
              </h3>
              <Controller
                name="product_price"
                control={control}
                rules={{
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Enter a valid price",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 outline-0"
                  />
                )}
              />
              {errors.product_price && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.product_price.message}
                </p>
              )}
            </div>

            {/* Cost */}
            <div>
              <h3
                className={`text-[20px] md:text-[24px] font-semibold ${!proOnly ? "text-gray-400" : "text-secondary-black"}`}
              >
                Cost
              </h3>
              <Controller
                name="cost"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    disabled={!proOnly}
                    className={`w-full border text-[16px] md:text-[20px] border-accent-gray rounded-lg p-2 md:p-4 outline-0 ${!proOnly ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-secondary-black"}`}
                  />
                )}
              />
            </div>

            {/* Weight */}
            <div className="mt-4">
              <h3
                className={`text-[20px] md:text-[24px] font-semibold ${
                  !proOnly ? "text-gray-400" : "text-secondary-black"
                }`}
              >
                Weight
              </h3>

              <Controller
                name="weight"
                control={control}
                rules={{
                  required: "Weight is required",
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    disabled={!proOnly}
                    className={`w-full border text-[16px] md:text-[20px] border-accent-gray rounded-lg p-2 md:p-4 mt-2 outline-0 ${
                      !proOnly
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "text-secondary-black"
                    }`}
                  />
                )}
              />
              {errors.weight && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.weight.message}
                </p>
              )}
            </div>

            {/* Dimensions — L × W × H */}
            <div>
              <h3
                className={`text-[20px] md:text-[24px] font-semibold ${!proOnly ? "text-gray-400" : "text-secondary-black"}`}
              >
                Dimensions
              </h3>

              <div className="flex items-center gap-2 mt-2">
                {(["length", "width", "height"] as const).map((dim, i) => (
                  <React.Fragment key={dim}>
                    <Controller
                      name={dim}
                      control={control}
                      rules={{
                        required: !proOnly
                          ? false
                          : `${dim.charAt(0).toUpperCase() + dim.slice(1)} is required`,
                        pattern: {
                          value: /^\d+(\.\d+)?$/,
                          message: `Invalid ${dim}`,
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          placeholder={dim.charAt(0).toUpperCase()}
                          disabled={!proOnly}
                          className={`w-full border border-accent-gray rounded-lg p-2 md:p-4 text-secondary-black outline-none ${!proOnly ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                        />
                      )}
                    />
                    {i < 2 && (
                      <span className="text-secondary-black font-semibold shrink-0">
                        X
                      </span>
                    )}
                  </React.Fragment>
                ))}

                {/* Unit dropdown */}
                <Controller
                  name="dimension_unit"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={!proOnly}
                      className={`border border-accent-gray rounded-lg p-2 md:p-4 text-secondary-black outline-0 shrink-0 ${!proOnly ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                    >
                      <option value="in">in</option>
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                    </select>
                  )}
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Enter dimensions of package
              </p>
              <div className="flex flex-col gap-0.5 mt-1">
                {errors.length && (
                  <p className="text-red-600 text-sm">
                    {errors.length.message}
                  </p>
                )}
                {errors.width && (
                  <p className="text-red-600 text-sm">{errors.width.message}</p>
                )}
                {errors.height && (
                  <p className="text-red-600 text-sm">
                    {errors.height.message}
                  </p>
                )}
              </div>
            </div>

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
                    className="w-full border text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 outline-0"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
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
                    onChange={e => {
                      field.onChange(e);
                      setValue("sub_category_id", "");
                    }}
                    className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name || cat.category_name}
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
            </div>

            {/* Subcategory */}
            {filteredSubcategories.length > 0 && (
              <div>
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
                      className="w-full border text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2"
                    >
                      <option value="">Select Subcategory</option>
                      {filteredSubcategories.map((sub: any) => (
                        <option key={sub.id} value={String(sub.id)}>
                          {sub.name || sub.sub_category_name}
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

            {/* Fulfillment */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
                Fulfillment
              </h3>

              {config.fulfillmentLocked ? (
                <Controller
                  name="fulfillment"
                  control={control}
                  rules={{ required: "Fulfillment is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={config?.fulfillmentLocked}
                      className="w-full border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg p-2 md:p-4 mt-2 opacity-60 cursor-not-allowed"
                    >
                      <option value="arrange_local_pickup">
                        Arrange Local Pickup
                      </option>
                    </select>
                  )}
                />
              ) : (
                <>
                  <Controller
                    name="fulfillment"
                    control={control}
                    rules={{ required: "Fulfillment is required" }}
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

            {/* Meta Tags */}
            <div>
              <h3 className="text-[20px] md:text-[24px] font-semibold text-secondary-black">
                Meta Tags
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {metaTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-2 relative">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  className="flex-1 border text-[16px] md:text-[20px] text-secondary-black border-accent-gray rounded-lg py-4 pl-10"
                  placeholder="Enter a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="absolute top-1/2 left-5 -translate-y-1/2 cursor-pointer text-xl font-bold text-secondary-black"
                >
                  +
                </button>
              </div>
            </div>

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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between mt-5 md:mt-10 items-center">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
            className="text-red-600 w-full sm:w-fit flex items-center justify-center gap-1 mt-4 cursor-pointer disabled:opacity-50 hover:text-red-700"
          >
            <MdDelete />
            {isDeleting ? "Deleting..." : "Delete Listing"}
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-accent-red w-full sm:w-fit text-white py-2.5 md:py-5 px-12 cursor-pointer rounded-lg font-semibold hover:bg-[#a34739] mt-3 md:mt-6 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Listing"}
          </button>
        </div>
      </form>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-secondary-black mb-4">
              Delete Listing
            </h3>
            <p className="text-[#67645F] mb-6">
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-accent-gray rounded-lg text-secondary-black hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateListing;
