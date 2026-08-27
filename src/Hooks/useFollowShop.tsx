import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useFollowShopMutation } from "@/redux/api/shopApi";

export function useFollowShop() {
  const { user } = useAuth();
  const [followShopMutation, { isLoading }] = useFollowShopMutation();

  const handleFollowShop = (shopId: number, ownerId?: number) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (ownerId && user?.shop_info?.user_id === ownerId) {
      toast.error("You can't follow your own shop");
      return;
    }
    followShopMutation(shopId).unwrap();
  };

  return { handleFollowShop, isLoading };
}
