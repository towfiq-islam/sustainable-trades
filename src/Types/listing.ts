export type ListingFormData = {
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

export interface ProductData {
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

export type StepProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  formData: Partial<ListingFormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ListingFormData>>>;
};
