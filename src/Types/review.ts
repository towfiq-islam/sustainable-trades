export type ReviewFormValues = {
  title: string;
  message: string;
  images: FileList;
};

export type ReviewItem = {
  id: number;
  message: string;
  rating: number;
  product: {
    product_name: string;
    images: ImageItem[];
  };
};

export type ImageItem = {
  image: string;
};
