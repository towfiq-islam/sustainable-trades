import { useCallback } from "react";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useAddFavoriteMutation } from "@/redux/api/productApi";

export function useAddFavorite() {
  const { requireAuth } = useAuth();
  const [addFavoriteMutation, { isLoading }] = useAddFavoriteMutation();

  const handleAddFavorite = useCallback(
    (productId: number) => {
      if (!requireAuth()) return;
      addFavoriteMutation(productId)
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
        })
        .catch((err) => {
          toast.error(err?.data?.message);
        });
    },
    [requireAuth, addFavoriteMutation],
  );

  return { handleAddFavorite, isLoading };
}
