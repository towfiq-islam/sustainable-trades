import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useRouter } from "next/navigation";
import { useAddFavoriteMutation } from "@/redux/api/productApi";

export function useAddFavorite() {
  const { user } = useAuth();
  const router = useRouter();
  const [addFavoriteMutation, { isLoading }] = useAddFavoriteMutation();

  const handleAddFavorite = (productId: number) => {
    if (!user) {
      toast.error("Please login first to proceed");
      router.push("/auth/login");
      return;
    }
    addFavoriteMutation(productId)
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  return { handleAddFavorite, isLoading };
}
