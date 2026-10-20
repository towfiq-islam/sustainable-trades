import { useCallback } from "react";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useFollowShopMutation } from "@/redux/api/shopApi";

export function useFollowShop() {
  const { user, requireAuth } = useAuth();
  const [followShopMutation, { isLoading }] = useFollowShopMutation();

  const handleFollowShop = useCallback(
    (shopId: number, ownerId?: number) => {
      if (!requireAuth()) return;
      if (ownerId && user?.shop_info?.user_id === ownerId) {
        toast.error("You can't follow your own shop");
        return;
      }
      followShopMutation(shopId).unwrap();
    },
    [user, requireAuth, followShopMutation],
  );

  return { handleFollowShop, isLoading };
}
