  // ── payment guard + shipping guard (pro only) ─────────────────────────
  useEffect(() => {
    if (!config.shippingGuard || !fulfillment) return;

    // 1) payment guard — any fulfillment choice requires a connected processor
    if (!user?.onboarded) {
      toast(
        "Please connect a payment processor before selecting a fulfillment option.",
        {
          icon: <MdInfo className="text-4xl text-primary-red" />,
        },
      );
      setValue("fulfillment", "");
      return;
    }

    // 2) shipping guard — only when the selected option requires shipping
    const requiresShipping =
      fulfillment === "shipping" ||
      fulfillment === "pickup_and_shipping" ||
      fulfillment === "delivery_and_shipping" ||
      fulfillment === "pickup_and_delivery_and_shipping";

    if (requiresShipping && !user?.shop_info?.shipping_setting) {
      toast(
        "Please configure a shipping calculator (Flat Rate, By Weight, or Shippo) before enabling shipping.",
        { icon: <MdInfo className="text-4xl text-primary-red" /> },
      );
      setValue("fulfillment", "");
    }
  }, [fulfillment, user, setValue, config.shippingGuard]);