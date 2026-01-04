"use client";
import {
  getallListings,
  useCreateDiscount,
  useDiscountGetById,
  useDiscountUpdate,
} from "@/Hooks/api/dashboard_api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";

interface Product {
  id: number;
  product_name: string;
}

interface ListingsResponse {
  data: Product[];
}

interface DiscountData {
  id: number;
  name: string;
  discount_type: "discount_code" | "automatic_discount";
  code?: string;
  promotion_type: "percentage" | "fixed";
  amount: number;
  applies: "any_order" | "single_product";
  product_id?: number;
  limit_one_per_shopper: boolean;
  discount_limits?: number;
  start_date: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  never_expires: boolean;
  status?: "active" | "inactive";
}

const CreateDiscount = () => {
  // Hook
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const isEditMode = !!id;

  // Mutation & Query
  const { mutate: createMutate, isPending: isCreating } = useCreateDiscount();
  const { mutate: updateMutate, isPending: isUpdating } = useDiscountUpdate(id);
  const { data: discountData, isLoading: isFetching } = useDiscountGetById(id);
  const { data: productlist }: { data: ListingsResponse | undefined } =
    getallListings();

  // States
  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState("code");
  const [appliesTo, setAppliesTo] = useState("Any Order");
  const [code, setCode] = useState("");
  const [promoType, setPromoType] = useState("Percent Off");
  const [amount, setAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [limitPerCustomer, setLimitPerCustomer] = useState(false);
  const [totalUsesLimit, setTotalUsesLimit] = useState(false);
  const [totalUses, setTotalUses] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [neverExpires, setNeverExpires] = useState(false);

  // Error State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (isEditMode && discountData?.data) {
      const item: DiscountData = discountData.data;
      setName(item.name || "");
      setDiscountType(item.discount_type === "discount_code" ? "code" : "auto");
      setCode(item.code || "");
      setPromoType(
        item.promotion_type === "percentage" ? "Percent Off" : "Fixed Amount"
      );
      setAmount(item.amount?.toString() || "");
      setAppliesTo(
        item.applies === "any_order" ? "Any Order" : "Single Product"
      );
      setSelectedProduct(item.product_id?.toString() || "");
      setLimitPerCustomer(item.limit_one_per_shopper || false);
      setTotalUsesLimit(!!item.discount_limits);
      setTotalUses(item.discount_limits?.toString() || "");
      setStartDate(item.start_date || "");
      setStartTime(item.start_time ? item.start_time.substring(0, 5) : "");
      setEndDate(item.end_date || "");
      setEndTime(item.end_time ? item.end_time.substring(0, 5) : "");
      setNeverExpires(item.never_expires || false);
    }
  }, [isEditMode, discountData]);

  const generateRandomCode = () => {
    return (
      Math.random().toString(36).substring(2, 7).toUpperCase() +
      Math.floor(Math.random() * 100)
    );
  };

  const handleGenerateCode = () => {
    setCode(generateRandomCode());
    setErrors(prev => ({ ...prev, code: "" }));
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Discount name is required.";
    if (!amount.trim()) newErrors.amount = "Discount amount is required.";
    if (!startDate) newErrors.startDate = "Start date is required.";

    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!startTime) newErrors.startTime = "Start time is required.";

    if (!neverExpires) {
      if (!endDate) newErrors.endDate = "End date is required.";
      if (!endTime) newErrors.endTime = "End time is required.";
    }

    if (discountType === "code" && !code.trim()) {
      newErrors.code = "Discount code is required.";
    }

    if (appliesTo === "Single Product" && !selectedProduct) {
      newErrors.selectedProduct = "Please select a product.";
    }
    if (totalUsesLimit && !totalUses.trim()) {
      newErrors.totalUses = "Please enter total usage limit.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors

    const finalCode =
      discountType === "code"
        ? code.trim() || generateRandomCode()
        : generateRandomCode();

    const payload = {
      name: name.trim(),
      discount_type:
        discountType === "code" ? "discount_code" : "automatic_discount",
      code: finalCode,
      promotion_type: promoType === "Percent Off" ? "percentage" : "fixed",
      amount: amount.trim(),
      applies: appliesTo === "Any Order" ? "any_order" : "single_product",
      ...(appliesTo === "Single Product" && {
        product_id: parseInt(selectedProduct),
      }),
      limit_one_per_shopper: limitPerCustomer,
      ...(totalUsesLimit &&
        totalUses.trim() && { discount_limits: parseInt(totalUses.trim()) }),
      start_date: startDate,
      start_time: startTime || null,
      never_expires: neverExpires,
      ...(neverExpires
        ? { end_date: null, end_time: null }
        : { end_date: endDate || null, end_time: endTime || null }),
      ...(isEditMode && { id: parseInt(id!) }),
    };

    if (isEditMode) {
      updateMutate(payload, {
        onSuccess: (data: any) => {
          if (data?.success) {
            router.push("/dashboard/pro/discounts");
          }
        },
      });
    } else {
      createMutate(payload, {
        onSuccess: (data: any) => {
          if (data?.success) {
            router.push("/dashboard/pro/discounts");
          }
        },
      });
    }
  };

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard?")) {
      router.back();
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleNeverExpiresChange = (e: any) => {
    const checked = e.target.checked;
    setNeverExpires(checked);
    if (checked) {
      setEndDate("");
      setEndTime("");
    }
  };

  if (isFetching && isEditMode) {
    return (
      <div className="p-4 lg:p-8 flex justify-center items-center h-64">
        <div className="text-[#13141D]">Loading discount...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Title */}
      <h2 className="text-[30px] md:text-[40px] font-semibold text-[#13141D]">
        {isEditMode ? "Edit Discount" : "Create Discount"}
      </h2>

      {/* Back */}
      <div className="border-b border-gray-300">
        <h4
          onClick={handleBack}
          className="flex gap-x-1 items-center text-[#13141D] font-normal py-4 cursor-pointer"
        >
          <FaAngleLeft />
          Back
        </h4>
      </div>

      {/* Name */}
      <div className="pt-4 md:pt-8 pb-6 md:pb-12">
        <h4 className="text-[16px] md:text-[20px] font-normal text-[#13141D]">
          Name
        </h4>

        <input
          type="text"
          placeholder="Example: 15% Off Order"
          value={name}
          onChange={e => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
          className={`px-4 py-2.5 md:py-5 border-2 rounded-[8px] text-[16px] font-bold text-[#67645F] mt-3 w-full lg:w-[750px] ${
            errors.name ? "border-red-500" : "border-[#67645F]"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 mb-2">{errors.name}</p>
        )}
        <p className="text-[13px] md:text-[16px] font-bold text-[#13141D] mt-1">
          The name that shoppers will see at checkout.
        </p>
      </div>

      {/* Discount Type */}
      <div className="pb-4 md:pb-8">
        <h4 className="text-[16px] md:text-[20px] font-normal text-[#13141D]">
          Discount Type
        </h4>
        <div className="flex mt-3 ">
          <button
            onClick={() => setDiscountType("code")}
            className={`px-4 py-[9px] md:py-[18px] rounded-l-md cursor-pointer text-[16px] md:text-[20px] text-[#274F45] font-semibold ${
              discountType === "code"
                ? "bg-[#D4E2CB] border-2 border-[#274F45] "
                : "bg-white border-2 border-[#67645F]"
            }`}
          >
            Discount Code
          </button>
          <button
            onClick={() => setDiscountType("auto")}
            className={`px-6 py-2 rounded-r-md cursor-pointer  text-[16px] md:text-[20px] text-[#274F45] font-semibold ${
              discountType === "auto"
                ? "bg-[#D4E2CB] border-2 border-[#274F45] "
                : "bg-white border-2 border-[#67645F]"
            }`}
          >
            Automatic Discount
          </button>
        </div>
      </div>

      {/* Discount Code */}
      {discountType === "code" && (
        <div className="pb-4 md:pb-8">
          <h4 className="text-[16px] md:text-[20px] font-normal text-[#13141D]">
            Discount Code
          </h4>
          <div className="flex gap-2 mt-3 w-full lg:w-[750px] relative">
            <input
              type="text"
              placeholder="Discount Code (Ex. SALE15)"
              value={code}
              onChange={e => {
                setCode(e.target.value);
                if (errors.code) setErrors({ ...errors, code: "" });
              }}
              className={`px-4 py-2.5 md:py-5 border-2 rounded-[8px] text-[13px] md:text-[16px] font-bold text-[#67645F] my-3 w-full md:w-[750px] ${
                errors.code ? "border-red-500" : "border-[#67645F]"
              }`}
            />
            <button
              onClick={handleGenerateCode}
              className="absolute top-[50%] -translate-y-[50%] right-5 cursor-pointer text-[#5C7F60] font-bold text-[13px] md:text-[16px]"
            >
              Generate Code
            </button>
          </div>
          {/* Error message display */}
          {errors.code && (
            <p className="text-red-500 text-sm mb-2">{errors.code}</p>
          )}
          <p className="text-[13px] md:text-[16px] font-bold text-[#13141D]">
            Shoppers enter this code at checkout.
          </p>
        </div>
      )}

      {/* Promotion */}
      <div className="pb-4 md:pb-8">
        <h4 className="text-[16px] md:text-[20px] font-normal text-[#13141D]">
          Promotion
        </h4>
        <div
          className={`flex mt-3 w-full lg:w-[750px] border rounded-md ${
            errors.amount ? "border-red-500" : "border-[#67645F]"
          }`}
        >
          <select
            className="px-4 py-2.5 md:py-5 w-full bg-[#D4E2CB] rounded-l-md text-[#5C7F60] font-bold text-[13px] md:text-[16px] outline-0"
            value={promoType}
            onChange={e => setPromoType(e.target.value)}
          >
            <option>Percent Off</option>
            <option>Fixed Amount</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder={promoType === "Percent Off" ? "0%" : "0"}
            value={amount}
            onChange={e => {
              setAmount(e.target.value);
              if (errors.amount) setErrors({ ...errors, amount: "" });
            }}
            className="rounded-r-md px-4 py-2 flex-1 text-[#13141D] font-bold text-[13px] md:text-[16px] outline-0"
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Applies To */}
      <div className="pb-4 md:pb-8">
        <h4 className="text-[16px] md:text-[20px] font-normal text-[#13141D]">
          Applies To
        </h4>
        <select
          className="mt-3 border border-[#3D3D3D] rounded-md px-4 py-2.5 md:py-5  w-full lg:w-[750px] bg-[#D4E2CB] text-[13px] md:text-[16px] font-bold text-[#274F45]"
          value={appliesTo}
          onChange={e => {
            setAppliesTo(e.target.value);
            setErrors({ ...errors, selectedProduct: "" });
          }}
        >
          <option value="Any Order">Any Order</option>
          <option value="Single Product">Single Product</option>
        </select>

        {/* Show product selection dropdown if Single Product is selected */}
        {appliesTo === "Single Product" && (
          <div className="mt-4  w-full lg:w-[750px]">
            <h5 className="text-[13px] md:text-[16px] font-semibold text-[#13141D] mb-2">
              Select Product
            </h5>
            <select
              value={selectedProduct}
              onChange={e => {
                setSelectedProduct(e.target.value);
                if (errors.selectedProduct)
                  setErrors({ ...errors, selectedProduct: "" });
              }}
              className={`w-full border rounded-md px-4 py-5 text-[16px] font-bold text-[#13141D] ${
                errors.selectedProduct ? "border-red-500" : "border-[#67645F]"
              }`}
            >
              <option value="">Select a product</option>
              {productlist?.data?.map(product => (
                <option key={product.id} value={product.id}>
                  {product?.product_name}
                </option>
              ))}
            </select>
            {errors.selectedProduct && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selectedProduct}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Discount Limits */}
      <div className="pb-4 md:pb-8">
        <h4 className="text-[16px] md:text-[20px] font-normal text-[#13141D]">
          Discount Limits
        </h4>
        <div className="mt-3 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-[13px] md:text-[16px] font-semibold text-[#13141D]">
            <input
              type="checkbox"
              className="w-3 h-3 md:w-4 md:h-4 "
              checked={limitPerCustomer}
              onChange={e => setLimitPerCustomer(e.target.checked)}
            />
            Limit One Per Shopper
          </label>
          <label className="flex items-center gap-2 text-[13px] md:text-[16px]  font-semibold text-[#13141D]">
            <input
              type="checkbox"
              className="w-3 h-3 md:w-4 md:h-4 "
              checked={totalUsesLimit}
              onChange={e => {
                setTotalUsesLimit(e.target.checked);
                if (!e.target.checked) setErrors({ ...errors, totalUses: "" });
              }}
            />
            Limit number of times this discount can be used in total
          </label>
          <input
            type="number"
            min="1"
            placeholder="Enter usage limit (ex: 5)"
            value={totalUses}
            onChange={e => {
              setTotalUses(e.target.value);
              if (errors.totalUses) setErrors({ ...errors, totalUses: "" });
            }}
            disabled={!totalUsesLimit}
            className={`px-4 py-2.5 md:py-5 border rounded-[8px] text-[16px] font-bold text-[#67645F] my-1  w-full lg:w-[750px] ${
              errors.totalUses ? "border-red-500" : "border-[#3D3D3D]"
            }`}
          />
          {errors.totalUses && (
            <p className="text-red-500 text-sm">{errors.totalUses}</p>
          )}
        </div>
      </div>

      {/* Active Dates */}
      <div className="pb-4 md:pb-8">
        <h4 className="text-[16px] md:text-[20px] font-normal text-[#13141D]">
          Active Dates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mt-3 w-full lg:w-[750px]">
          {/* Start Date */}
          <div>
            <label className="block text-[14px] md:text-[16px] font-normal text-[#13141D] mb-1 md:mb-2">
              Start Date
            </label>
            <div
              className={`flex items-center border rounded-md px-4 py-2.5 md:py-5 gap-2 bg-[#E6F5F4] ${
                errors.startDate ? "border-red-500" : "border-[#67645F]"
              }`}
            >
              <FiCalendar />
              <input
                type="date"
                value={startDate}
                onChange={e => {
                  setStartDate(e.target.value);
                  if (errors.startDate)
                    setErrors(prev => ({ ...prev, startDate: "" }));
                }}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-[14px] md:text-[16px] font-normal text-[#13141D] mb-2">
              Start Time (PDT)
            </label>
            <div
              className={`flex items-center border rounded-md px-4 py-2.5 md:py-5 gap-2 bg-[#E6F5F4] ${
                errors.startTime ? "border-red-500" : "border-[#67645F]"
              }`}
            >
              <FiClock />
              <input
                type="time"
                value={startTime}
                onChange={e => {
                  setStartTime(e.target.value);
                  if (errors.startTime)
                    setErrors(prev => ({ ...prev, startTime: "" }));
                }}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[14px] md:text-[16px] font-normal text-[#13141D] mb-2">
              End Date
            </label>
            <div
              className={`flex items-center border rounded-md px-4 py-2.5 md:py-5 gap-2 bg-[#E6F5F4] ${
                !neverExpires && errors.endDate
                  ? "border-red-500"
                  : "border-[#67645F]"
              } ${neverExpires ? "opacity-50" : ""}`}
            >
              <FiCalendar />
              <input
                type="date"
                value={endDate}
                onChange={e => {
                  setEndDate(e.target.value);
                  if (errors.endDate)
                    setErrors(prev => ({ ...prev, endDate: "" }));
                }}
                disabled={neverExpires}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            {!neverExpires && errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className="block text-[14px] md:text-[16px] font-normal text-[#13141D] mb-2">
              End Time (PDT)
            </label>
            <div
              className={`flex items-center border rounded-md px-4 py-2.5 md:py-5 gap-2 bg-[#E6F5F4] ${
                !neverExpires && errors.endTime
                  ? "border-red-500"
                  : "border-[#67645F]"
              } ${neverExpires ? "opacity-50" : ""}`}
            >
              <FiClock />
              <input
                type="time"
                value={endTime}
                onChange={e => {
                  setEndTime(e.target.value);
                  if (errors.endTime)
                    setErrors(prev => ({ ...prev, endTime: "" }));
                }}
                disabled={neverExpires}
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            {!neverExpires && errors.endTime && (
              <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>
        <label className="flex items-center text-[13px] md:text-base  gap-2 mt-1.5 md:mt-3">
          <input
            type="checkbox"
            className="w-3 h-3 md:w-4 md:h-4"
            checked={neverExpires}
            onChange={handleNeverExpiresChange}
          />
          Never Expires
        </label>
      </div>
      <div className="flex flex-col md:flex-row justify-end mt-3 md:mt-12 gap-3.5 md:gap-x-10">
        <button
          onClick={handleDiscard}
          disabled={isPending}
          className="text-[#274F45] border-[#274F45] border rounded-[8px] px-16 py-2 md:py-4 text-base  md:text-[20px] font-semibold cursor-pointer hover:bg-[#D4E2CB] duration-500 ease-in-out disabled:opacity-50"
        >
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="hover:border-[#D4E2CB] hover:border border hover:bg-transparent rounded-[8px] px-16 py-2 md:py-4 text-base md:text-[20px] font-semibold cursor-pointer bg-[#D4E2CB] w-full md:w-fit text-[#274F45] duration-500 ease-in-out disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : isEditMode
            ? "Update Discount"
            : "Save Discount"}
        </button>
      </div>
    </div>
  );
};

export default CreateDiscount;
