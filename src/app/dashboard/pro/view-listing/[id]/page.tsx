"use client";
import React, { useRef, useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FaAngleRight, FaPlay, FaPlus } from "react-icons/fa";
import { MdArrowOutward, MdDelete } from "react-icons/md";
import Preview from "../../../../../Assets/fallbackimage.png";
import Image from "next/image";
import Link from "next/link";
import {
  useDeleteProduct,
  useGetSingleListing,
  useupdateProduct,
} from "@/Hooks/api/dashboard_api";
import {
  getProductCategoriesClient,
  getProductSubCategoriesClient,
} from "@/Hooks/api/cms_api";
import useAuth from "@/Hooks/useAuth";
import { PuffLoader } from "react-spinners";
import toast from "react-hot-toast";
import useClientApi from "@/Hooks/useClientApi";

// Define types for the API response and error
interface UpdateProductResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    shop_info_id: number;
    product_name: string;
    product_price: string;
    product_quantity: string | null;
    weight: string;
    cost: string;
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
    images: Array<{
      id: number;
      product_id: number;
      image: string;
    }>;
    meta_tags: Array<{
      id: number;
      product_id: number;
      tag: string;
    }>;
  };
  code: number;
}

interface UpdateProductError {
  response?: {
    data?: {
      message: string;
    };
  };
}

interface DeleteProductError {
  response?: {
    data?: {
      message: string;
    };
  };
}

interface KeptImage {
  id: number;
  relativePath: string;
  fullPath: string;
}

const Details = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isPro = user?.membership?.membership_type === "pro";

  const { id } = use(params);
  const { data: listing, isLoading } = useGetSingleListing(id);

  const updateProduct = useupdateProduct(id);
  const deleteProduct = useDeleteProduct(id);

  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [unlimitedStock, setUnlimitedStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [Featured, setFeatured] = useState(false);
  const [metaTags, setMetaTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [fulfillment, setFulfillment] = useState("");
  const [sellingOption, setSellingOption] = useState("");
  const { data: categoriesData } = getProductCategoriesClient();
  const { data: subcategoriesData } = getProductSubCategoriesClient();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [keptImages, setKeptImages] = useState<KeptImage[]>([]);
  const [keptRelativePaths, setKeptRelativePaths] = useState<string[]>([]);
  const [keptImagePaths, setKeptImagePaths] = useState<string[]>([]);

  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Use the useClientApi hook for deleting image
  const deleteImageMutation = useClientApi({
    method: "delete",
    isPrivate: true,
    key: ["image-delete"],
    endpoint: "/api/image-delete",
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data?.message || "Image deleted successfully");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete image");
    },
  });

  const updateLocalStateWithProductData = (
    productData: UpdateProductResponse["data"]
  ) => {
    setProductName(productData.product_name || "");
    setPrice(`$${productData.product_price || 0}`);
    setCost(`$${productData.cost || 0}`);
    setWeight(productData.weight || "");
    setDescription(productData.description || "");
    setQuantity(productData.product_quantity?.toString() || "");
    setUnlimitedStock(productData.unlimited_stock || false);
    setOutOfStock(productData.out_of_stock || false);
    setFeatured(productData.is_featured || false);
    setMetaTags(
      productData.meta_tags?.map((tag: { tag: string }) => tag.tag) || []
    );

    const kept: KeptImage[] =
      productData.images?.map((img: { id: number; image: string }) => {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://melissabooth123.softvencefsd.xyz";
        const rel = img.image.startsWith("http")
          ? img.image.replace(`${baseUrl}/`, "")
          : img.image;
        const full = rel.startsWith("http") ? rel : `${baseUrl}/${rel}`;
        return { id: img.id, relativePath: rel, fullPath: full };
      }) || [];

    setKeptImages(kept);
    setKeptRelativePaths(kept.map(i => i.relativePath));
    setKeptImagePaths(kept.map(i => i.fullPath));
    setExistingImages(kept.map(i => i.fullPath));
    setImages(kept.map(i => i.fullPath));
    if (kept.length > 0) setMainImage(kept[0].fullPath);

    setVideoUrl(
      productData.video
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/${productData.video}`
        : null
    );
    setShowPlayButton(!productData.video);
    setVideoFile(null);
    setCategory(productData.category_id?.toString() || "");
    setSubcategory(productData.sub_category_id?.toString() || "");
    setFulfillment(productData.fulfillment || "");
    setSellingOption(productData.selling_option || "");
    setImageFiles([]);
  };

  useEffect(() => {
    if (listing?.data) {
      updateLocalStateWithProductData(listing.data);
    }
  }, [listing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...fileArray]);

      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      if (!mainImage && previewUrls.length > 0) {
        setMainImage(previewUrls[0]);
      }
      setImages(prev => [...prev, ...previewUrls]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      setShowPlayButton(true);

      setTimeout(() => {
        videoRef.current?.load();
      }, 0);
    }
  };

  const handleRemoveImage = (imageUrl: string, isNew: boolean) => {
    if (isNew) {
      // Remove from new files
      const fileIndex = imageFiles.findIndex(
        file => URL.createObjectURL(file) === imageUrl
      );
      if (fileIndex > -1) {
        const removedFile = imageFiles[fileIndex];
        setImageFiles(prev => prev.filter((_, idx) => idx !== fileIndex));
        URL.revokeObjectURL(imageUrl);
      }

      // Remove from images array
      const updatedImages = images.filter(url => url !== imageUrl);
      setImages(updatedImages);

      // Update mainImage
      if (mainImage === imageUrl) {
        setMainImage(updatedImages[0] || null);
      }
    } else {
      // For existing images
      const img = keptImages.find(i => i.fullPath === imageUrl);
      if (!img) {
        console.error("Image not found in keptImages");
        return;
      }

      console.log("Deleting image with ID:", img.id); // Debug log

      // Set deleting state
      setDeletingIds(prev => new Set([...prev, img.id]));

      // Now delete from server using the hook
      deleteImageMutation.mutate(
        { endpoint: `/api/image-delete/${img.id}` },
        {
          onSuccess: () => {
            // Remove from state on success
            const updatedKept = keptImages.filter(i => i.id !== img.id);
            setKeptImages(updatedKept);
            setKeptRelativePaths(updatedKept.map(i => i.relativePath));
            setKeptImagePaths(updatedKept.map(i => i.fullPath));

            const updatedImages = images.filter(url => url !== imageUrl);
            setImages(updatedImages);

            if (mainImage === imageUrl) {
              setMainImage(updatedImages[0] || null);
            }

            // Invalidate and refetch the listing query
            queryClient.invalidateQueries({ queryKey: ["singleListing", id] });

            // Remove from deleting state
            setDeletingIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(img.id);
              return newSet;
            });
          },
          onError: (error: any) => {
            console.error("Delete image failed:", error);
            // Remove from deleting state
            setDeletingIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(img.id);
              return newSet;
            });
          },
        }
      );
    }
  };

  const handlePlay = () => {
    if (!videoRef.current) return;
    videoRef.current
      .play()
      .then(() => setShowPlayButton(false))
      .catch(err => console.error("Playback failed:", err));
  };

  const handlePause = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setShowPlayButton(true);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      handlePlay();
    } else {
      handlePause();
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setMetaTags([...metaTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setMetaTags(metaTags.filter(t => t !== tag));
  };

  const handleUpdateListing = async () => {
    if (keptImages.length === 0 && imageFiles.length === 0) {
      if (!confirm("This will remove all images from the listing. Continue?")) {
        return;
      }
    }
    if (!productName.trim()) {
      alert("Product name is required.");
      return;
    }

    const formData = new FormData();

    // Append text fields
    formData.append("product_name", productName);
    formData.append("product_price", price.replace("$", "").trim());
    formData.append("cost", cost.replace("$", "").trim());
    formData.append("weight", weight);
    if (quantity.trim() !== "") {
      formData.append("product_quantity", quantity);
    }
    formData.append("unlimited_stock", unlimitedStock ? "1" : "0");
    formData.append("out_of_stock", outOfStock ? "1" : "0");
    formData.append("description", description);
    formData.append("category_id", category);
    formData.append("sub_category_id", subcategory);
    formData.append("fulfillment", fulfillment);
    formData.append("selling_option", sellingOption);
    formData.append("is_featured", Featured ? "1" : "0");

    // Meta tags
    metaTags.forEach((tag, index) => {
      formData.append(`tags[]`, tag);
    });

    // Keep existing images by ID (separate field to avoid mixing with new files)
    keptImages.forEach(img => {
      formData.append(`keep_image_ids[]`, img.id.toString());
    });

    // New image files only (as files)
    imageFiles.forEach(file => {
      formData.append(`product_image[]`, file);
    });

    // Video file if new
    if (videoFile) {
      formData.append("video", videoFile);
    }

    // Trigger the mutation with typed callbacks
    updateProduct.mutate(formData, {
      onSuccess: (data: UpdateProductResponse) => {
        if (data?.success) {
          router.push("/dashboard/pro/view-listing");
        }
        console.log("Update successful:", data);
        // Update local state with the new data
        updateLocalStateWithProductData(data.data);
        // Optionally show success toast: alert("Listing updated successfully!");
      },
      onError: (error: UpdateProductError) => {
        console.error("Update failed:", error);
        // Optionally show error toast: alert(error.response?.data?.message || "Update failed.");
      },
    });
  };

  // Handle delete listing
  const handleDeleteListing = () => {
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    setShowDeleteModal(false);
    deleteProduct.mutate(null, {
      onSuccess: () => {
        router.push("/dashboard/basic/view-listing");
      },
      onError: (error: DeleteProductError) => {
        console.error("Delete failed:", error);
        // Optionally show error toast
      },
    });
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

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

  // Combined images for preview (existing kept + new previews)
  const previewImages = [
    ...keptImagePaths,
    ...images.filter(url => !keptImagePaths.includes(url)),
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[30px] md:text-[40px] font-semibold text-[#13141D]">
            {productName}
          </h3>
          <div className="flex gap-x-2 items-center pt-2 cursor-pointer">
            <h4 className="text-[16px] text-[#13141D]">Listings</h4>
            <FaAngleRight className="mt-1" />
            <h5 className="text-[16px] text-[#13141D]">Edit Listing</h5>
          </div>
        </div>
        <Link href="/dashboard/pro/view-listing">
          <button className="text-[#000] text-[16px] font-semibold flex gap-x-1 items-center border-2 border-[#13141D] rounded-lg py-1.5 md:py-3 px-6 hover:bg-[#E48872] hover:text-white justify-center duration-300 cursor-pointer">
            <MdArrowOutward />
            View Listings
          </button>
        </Link>
      </div>

      {/* Form */}
      <div className="grid  grid-cols-1 xl:grid-cols-2 gap-2 md:gap-8 mt-8">
        {/* Left Column */}
        <div className="flex flex-col gap-3 md:gap-6">
          {/* Product Name */}
          <div>
            <h3 className="text-[17px] md:text-[20px] font-semibold text-[#13141D]">
              Product Name / Service
            </h3>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              className="w-full border text-[18px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2 outline-none"
              aria-label="Product Name"
            />
          </div>

          {/* Main Preview Image */}
          <div>
            {mainImage ? (
              <div className="w-full relative h-[400px] md:h-[500px] ">
                <Image
                  src={mainImage}
                  alt="Main product preview"
                  fill
                  unoptimized
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>
            ) : (
              <div className="w-full relative h-[400px] md:h-[500px] flex items-center justify-center  rounded-lg text-gray-400 outline-none border border-gray-200">
                <Image
                  src={Preview}
                  alt="No preview available"
                  fill
                  unoptimized
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Thumbnails */}
            <div className="flex gap-2 flex-wrap mt-3">
              {previewImages.map((src, idx) => {
                const isNewImage = !keptImagePaths.includes(src);
                const currentImg = isNewImage
                  ? null
                  : keptImages.find(i => i.fullPath === src);
                const isDeleting =
                  !!currentImg && deletingIds.has(currentImg.id);
                return (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`Product image ${idx + 1}`}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                      onClick={() => setMainImage(src)}
                    />
                    <button
                      onClick={() =>
                        !isDeleting && handleRemoveImage(src, isNewImage)
                      }
                      disabled={isDeleting}
                      className={`absolute top-0 right-0 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs  ${
                        isDeleting ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      aria-label="Remove image"
                    >
                      {isDeleting ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      ) : (
                        "x"
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
                  aria-label="Add images"
                />
              </label>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-[17px] md:text-[20px] font-semibold text-[#13141D]">
              Quantity
            </h3>
            <input
              type="text"
              value={quantity}
              disabled={!isPro}
              onChange={e => setQuantity(e.target.value)}
              className={`w-full md:w-[350px] border ${
                !isPro ? "cursor-not-allowed bg-gray-300" : ""
              } border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2 text-[20px] text-[#13141D] font-normal outline-0`}
              aria-label="Quantity"
            />
            <div className="flex flex-col gap-4 mt-2">
              <label className="flex items-center gap-2 text-[17px] md:text-[20px] text-[#13141D] font-semibold">
                Unlimited Stock
                <input
                  disabled={!isPro}
                  type="checkbox"
                  checked={unlimitedStock}
                  onChange={() => setUnlimitedStock(!unlimitedStock)}
                  className="mt-1 accent-[#274F45]"
                />
              </label>
              <label className="flex items-center gap-2 text-[17px] md:text-[20px] text-[#13141D] font-semibold">
                Feature
                <input
                  type="checkbox"
                  checked={Featured}
                  onChange={() => setFeatured(!Featured)}
                  className="mt-1 accent-[#274F45]"
                />
              </label>
              <label className="flex items-center gap-2 text-[17px] md:text-[20px] text-[#13141D] font-semibold">
                Out of Stock
                <input
                  disabled={!isPro}
                  type="checkbox"
                  checked={outOfStock}
                  onChange={() => setOutOfStock(!outOfStock)}
                  className="mt-1 accent-[#274F45]"
                />
              </label>
              <p className="text-[16px] text-[#13141D] font-normal max-w-[400px]">
                Status automatically changes to “Out of Inventory” when zero
                inventory is reached
              </p>
            </div>
          </div>

          {/* Listing Approval */}
          <div>
            <h3 className="text-[17px] md:text-[20px] text-[#13141D] font-semibold">
              Listing Approval Process
            </h3>
            <p className="text-[16px] text-[#67645F] mt-2 max-w-[400px]">
              In the video, share details about how and where your product was
              made, how your food was grown, and how it aligns with our
              sustainability guidelines. This helps us maintain the quality and
              integrity of our marketplace.
            </p>
            <div>
              <div className="flex gap-4 mt-3">
                <label className="px-4 md:px-8 py-2.5 md:py-5 bg-[#F0EEE9] rounded-lg cursor-pointer text-[16px] text-[#13141D] hover:bg-gray-100">
                  Upload video
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                    aria-label="Upload video"
                  />
                </label>

                {videoUrl && (
                  <button
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    onClick={() => {
                      setVideoUrl(null);
                      setVideoFile(null);
                      setShowPlayButton(true);
                      if (videoRef.current?.src.startsWith("blob:")) {
                        URL.revokeObjectURL(videoRef.current.src);
                      }
                    }}
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
                    onClick={handlePlayPause}
                  />

                  {/* Overlay play button */}
                  {showPlayButton && (
                    <button
                      className="h-24 w-24 bg-[#626161] text-white rounded-full absolute cursor-pointer top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center items-center"
                      onClick={e => {
                        e.stopPropagation();
                        handlePlay();
                      }}
                      aria-label="Play video"
                    >
                      <FaPlay className="size-10" />
                    </button>
                  )}

                  {/* Dedicated pause button */}
                  {!showPlayButton && (
                    <button
                      className="absolute top-2 right-2 px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                      onClick={handlePause}
                      aria-label="Pause video"
                    >
                      Pause
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Listing Status */}
          <div>
            <p className="font-semibold text-[20px] md:text-[24px] text-[#13141D]">
              Listing Status:{" "}
              <span className="px-3 py-2 text-white text-sm rounded-full bg-[#757575]">
                {statusBadge}
              </span>
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 md:gap-8">
          {/* Price */}
          <div>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
              Price
            </h3>
            <input
              type="text"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full border text-[16px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 outline-0"
              aria-label="Price"
            />
          </div>
          <div>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
              Cost
            </h3>
            <input
              type="text"
              disabled={!isPro}
              value={cost}
              onChange={e => setCost(e.target.value)}
              className={`w-full border text-[16px] ${
                !isPro ? "cursor-not-allowed bg-gray-300" : ""
              } md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 outline-0`}
              aria-label="Cost"
            />
          </div>
          <div>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
              Weight
            </h3>
            <input
              type="text"
              disabled={!isPro}
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className={`w-full border text-[16px] ${
                !isPro ? "cursor-not-allowed bg-gray-300" : ""
              } md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 outline-0`}
              aria-label="Weight"
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
              Description
            </h3>
            <textarea
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 outline-0"
              aria-label="Description"
            />
          </div>
          {/* Category Dropdown */}
          <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
            Category
          </h3>
          <select
            className="w-full border text-[16px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2"
            value={category}
            onChange={e => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
            aria-label="Category"
          >
            <option value="">Select Category</option>
            {categoriesData?.data?.map((cat: any) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name || cat.category_name}
              </option>
            ))}
          </select>

          {/* Subcategory Dropdown */}
          {subcategoriesData?.data && (
            <div className="mt-4">
              <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
                Subcategory
              </h3>
              <select
                className="w-full border text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                aria-label="Subcategory"
              >
                <option value="">Select Subcategory</option>
                {subcategoriesData.data
                  ?.filter(
                    (sub: any) =>
                      String(sub.category_id) === String(category) ||
                      String(sub.id) === String(subcategory)
                  )
                  .map((sub: any) => (
                    <option key={sub.id} value={String(sub.id)}>
                      {sub.name || sub.sub_category_name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
              Fulfillment
            </h3>
            <select
              className="w-full border text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2"
              value={fulfillment}
              onChange={e => setFulfillment(e.target.value)}
              aria-label="Fulfillment"
            >
              <option value="">Select Fulfillment</option>
              <option value="Arrange Local Pickup">Arrange Local Pickup</option>
              <option value="Shipping">Shipping</option>
              <option value="Arrange Local Pickup or Shipping">
                Arrange Local Pickup and Shipping
              </option>
            </select>
          </div>

          <div>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
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
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove tag ${tag}`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2 relative">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleAddTag()}
                className="flex-1 border text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 md:pl-10"
                placeholder="Add a meta tag"
                aria-label="New meta tag"
              />
              <button
                onClick={handleAddTag}
                className="absolute top-1/2 left-5 -translate-y-1/2 cursor-pointer text-[#274F45] hover:text-[#E48872]"
                aria-label="Add tag"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[20px] md:text-[24px] font-semibold text-[#13141D]">
              Selling Option
            </h3>
            <select
              className="w-full border text-[16px] md:text-[20px] text-[#13141D] border-[#A7A39C] rounded-lg p-2 md:p-4 mt-2"
              value={sellingOption}
              onChange={e => setSellingOption(e.target.value)}
              aria-label="Selling Option"
            >
              <option value="">Choose Below</option>
              <option value="Trade/Barter">Trade/Barter</option>
              <option value="For Sale or Trade Barter">
                For Sale or Trade Barter
              </option>
              <option value="For Sale">For Sale</option>
            </select>
          </div>

          {/* Save */}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-5 md:mt-10 items-center">
        <button
          onClick={handleDeleteListing}
          disabled={deleteProduct.isPending}
          className="text-red-600 w-full sm:w-fit flex items-center justify-center gap-1 mt-4 cursor-pointer disabled:opacity-50 hover:text-red-700"
          aria-label="Delete listing"
        >
          <MdDelete />{" "}
          {deleteProduct.isPending ? "Deleting..." : "Delete Listing"}
        </button>
        <button
          onClick={handleUpdateListing}
          disabled={updateProduct.isPending}
          className="bg-[#E48872] w-full sm:w-fit text-white py-2.5 md:py-5 px-12 cursor-pointer rounded-lg font-semibold hover:bg-[#a34739] mt-3 md:mt-6 disabled:opacity-50"
          aria-label="Update listing"
        >
          {updateProduct.isPending ? "Updating..." : "Update Listing"}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#13141D] mb-4">
              Delete Listing
            </h3>
            <p className="text-[#67645F] mb-6">
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-[#A7A39C] rounded-lg text-[#13141D] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteProduct.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 disabled:opacity-50"
              >
                {deleteProduct.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
