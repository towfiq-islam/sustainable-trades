"use client";
import { use, useEffect } from "react";
import Container from "@/Components/Common/Container";
import { useForm, FormProvider } from "react-hook-form";
import EditFormTwo from "@/Components/PageComponents/EditForm/EditFormTwo";
import EditFormFour from "@/Components/PageComponents/EditForm/EditFormFour";
import EditFormThree from "@/Components/PageComponents/EditForm/EditFormThree";
import { PuffLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import useAuth from "@/Hooks/useAuth";
import { useGetShopDetailsQuery } from "@/redux/api/shopApi";
import { useEditShopMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

type ProfileFormValues = {
  first_name: string;
  last_name: string;
  company_name?: string;
  phone?: string;

  shop_image?: File | null;
  shop_banner?: File | null;
  shop_name?: string;
  email?: string;

  tagline: string;
  statement: string;
  our_story: string;

  shipping_information: string;
  return_policy: string;
  payment_methods: any;

  website_url: string;
  facebook_url: string;
  instagram_url: string;
  pinterest_url: string;

  city?: string;
  state?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  address_line_1: string;
};

interface Props {
  params: Promise<{ id: number }>;
}

const Page = ({ params }: Props) => {
  // Hook
  const { user } = useAuth();
  const { id } = use(params);
  const router = useRouter();
  const { data: shopDetailsData, isLoading } = useGetShopDetailsQuery(id);
  const methods = useForm<ProfileFormValues>();
  const [editShopMutation, { isLoading: isPending }] = useEditShopMutation();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (shopDetailsData?.data) {
      reset({
        first_name: shopDetailsData.data.first_name || "",
        last_name: shopDetailsData.data.last_name || "",
        company_name: shopDetailsData.data.company_name || "",
        phone: shopDetailsData.data.phone || "",
        email: shopDetailsData.data.email || "",
        shop_name: shopDetailsData.data.shop_info?.shop_name || "",
        tagline: shopDetailsData?.data?.shop_info?.about?.tagline || "",
        statement: shopDetailsData?.data?.shop_info?.about?.statement || "",
        our_story: shopDetailsData?.data?.shop_info?.about?.our_story || "",
        shipping_information:
          shopDetailsData?.data?.shop_info?.policies?.shipping_information ||
          "",
        return_policy:
          shopDetailsData?.data?.shop_info?.policies?.return_policy || "",
        website_url:
          shopDetailsData?.data?.shop_info?.social_links?.website_url || "",
        facebook_url:
          shopDetailsData?.data?.shop_info?.social_links?.facebook_url || "",
        instagram_url:
          shopDetailsData?.data?.shop_info?.social_links?.instagram_url || "",
        pinterest_url:
          shopDetailsData?.data?.shop_info?.social_links?.pinterest_url || "",
        payment_methods:
          shopDetailsData?.data?.shop_info?.policies?.payment_methods || [],
        city: shopDetailsData?.data?.shop_info?.address?.city || "",
        state: shopDetailsData?.data?.shop_info?.address?.state || "",
        postal_code:
          shopDetailsData?.data?.shop_info?.address?.postal_code || "",
      });
    }
  }, [shopDetailsData, reset]);

  const getCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address,
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].geometry.location;
      }
      return null;
    } catch (err) {
      console.error("Geocoding failed:", err);
      return null;
    }
  };

  const onSubmit = async (formData: ProfileFormValues) => {
    const previousAddress = shopDetailsData?.data?.shop_info?.address;

    const newAddressString = `${formData.address_line_1 || ""}, ${
      formData.city || ""
    }, ${formData.state || ""}, ${formData.postal_code || ""}`;
    const oldAddressString = `${previousAddress?.address_line_1 || ""}, ${
      previousAddress?.city || ""
    }, ${previousAddress?.state || ""}, ${previousAddress?.postal_code || ""}`;

    let finalLat = previousAddress?.latitude;
    let finalLng = previousAddress?.longitude;

    if (newAddressString.trim() && newAddressString !== oldAddressString) {
      const location = await getCoordinates(newAddressString);
      if (location) {
        finalLat = String(location.lat);
        finalLng = String(location.lng);
      }
    }

    const fd = new FormData();

    // Profile info
    fd.append("first_name", formData.first_name || "");
    fd.append("last_name", formData.last_name || "");
    fd.append("company_name", formData.company_name || "");
    fd.append("phone", formData.phone || "");
    fd.append("email", formData.email || "");

    // Shop
    fd.append("shop_name", formData.shop_name || "");
    if (formData.shop_image instanceof File) {
      fd.append("shop_image", formData.shop_image);
    }
    if (formData.shop_banner instanceof File) {
      fd.append("shop_banner", formData.shop_banner);
    }

    // About
    fd.append("tagline", formData.tagline || "");
    fd.append("statement", formData.statement || "");
    fd.append("our_story", formData.our_story || "");
    if ((formData as any).about_image instanceof File) {
      fd.append("about_image", (formData as any).about_image);
    }

    // Policies
    fd.append("shipping_information", formData.shipping_information || "");
    fd.append("return_policy", formData.return_policy || "");

    if (
      Array.isArray(formData.payment_methods) &&
      formData.payment_methods.length > 0
    ) {
      formData.payment_methods.forEach((method: string, index: number) => {
        fd.append(`payment_methods[${index}]`, method);
      });
    } else {
      fd.append("payment_methods", "");
    }

    // FAQs
    const faqs = (formData as any).faqs || [];
    faqs.forEach((faq: { question: string; answer: string }, index: number) => {
      fd.append(`faqs[${index}][question]`, faq.question || "");
      fd.append(`faqs[${index}][answer]`, faq.answer || "");
    });

    // Social links
    fd.append("website_url", formData.website_url || "");
    fd.append("facebook_url", formData.facebook_url || "");
    fd.append("instagram_url", formData.instagram_url || "");
    fd.append("pinterest_url", formData.pinterest_url || "");

    // Address / Geo-locator
    fd.append("address_line_1", formData.address_line_1 || "");
    fd.append("city", formData.city || "");
    fd.append("state", formData.state || "");
    fd.append("postal_code", formData.postal_code || "");
    fd.append("latitude", finalLat ? String(finalLat) : "");
    fd.append("longitude", finalLng ? String(finalLng) : "");
    fd.append(
      "display_my_address",
      String((formData as any).display_my_address ?? 0),
    );
    fd.append(
      "address_10_mile",
      String((formData as any).address_10_mile ?? 0),
    );
    fd.append("do_not_display", String((formData as any).do_not_display ?? 0));

    try {
      const res: any = await editShopMutation(fd).unwrap();
      if (res?.success) {
        toast.success(res?.message);
        router.push(
          `/shop-details?view=owner&id=${user?.shop_info?.user_id}&listing_id=${user?.shop_info?.id}`,
        );
      }
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PuffLoader color="#274F45" />
      </div>
    );
  }

  return (
    <section className="pt-[34px] lg:pb-[96px] pb-[40px]">
      <Container>
        <div className="2xl:px-[220px]">
          <h2 className="lg:text-[40px] text-[30px] lg:text-start text-center font-bold text-secondary-black">
            Comprehensive Edit
          </h2>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit as any)}>
              {/* Profile Info */}
              <div className="lg:mt-[45px] mt-[30px]">
                <h2 className="mt-5 text-primary-green text-[20px] font-semibold">
                  Profile Info
                </h2>
                <p className="text-[16px] text-secondary-gray font-normal font-lato">
                  <span className="text-primary-red">*</span>Indicates a
                  required field
                </p>

                <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-7 lg:gap-y-10 gap-y-5">
                  {/* First Name */}
                  <div>
                    <p className="form-label">First Name *</p>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="First Name"
                      {...register("first_name")}
                    />
                    {errors.first_name?.message && (
                      <p className="text-red-600">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <p className="form-label">Last Name *</p>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Last Name"
                      {...register("last_name")}
                    />
                    {errors.last_name?.message && (
                      <p className="text-red-600">{errors.last_name.message}</p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <p className="form-label">Company Name (optional)</p>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Company Name"
                      {...register("company_name")}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="form-label">Phone</p>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Phone Number"
                      {...register("phone")}
                    />
                  </div>
                </div>
              </div>

              {/* Child Forms */}
              <div className="my-12">
                <EditFormTwo data={shopDetailsData?.data} />
              </div>
              <div className="my-12">
                <EditFormThree data={shopDetailsData?.data} />
              </div>
              <div className="my-12">
                <EditFormFour data={shopDetailsData?.data} />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="auth-secondary-btn w-full md:w-fit"
                >
                  {isPending ? "Updating...." : " Update Profile"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </Container>
    </section>
  );
};

export default Page;
