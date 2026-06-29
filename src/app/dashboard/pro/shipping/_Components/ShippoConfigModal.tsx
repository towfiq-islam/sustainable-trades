import Image from "next/image";
import Link from "next/link";
import shippoImg from "@/Assets/shippo.png";
import {
  useChangeLabelType,
  useConnectShippo,
  useDisconnectShippo,
  usePickCarrier,
  useSyncShippo,
} from "@/Hooks/api/dashboard_api";
import {
  MdCheckCircle,
  MdCreditCard,
  MdLabel,
  MdLocalShipping,
  MdSync,
} from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";

const THINGS_TO_KNOW = [
  "When you update your settings here, they automatically update in Shippo to match.",
  "If you update your settings in Shippo, click Sync now to update your settings in Sustainable Trades.",
];

const HOW_IT_WORKS_STEPS = [
  {
    icon: <MdLocalShipping />,
    text: (
      <>
        <strong>Enable</strong> or disable the carriers you want to offer for
        creating labels.
      </>
    ),
  },
  {
    icon: <MdLabel />,
    text: (
      <>
        <strong>Choose</strong> whether you prefer the quickest shipping time or
        the cheapest label.
      </>
    ),
  },
  {
    icon: <MdCreditCard />,
    text: (
      <>
        <strong>Based</strong> on your settings, Sustainable Trades will select
        that rate and add it to your customer's cart. This does not mean the
        label has been purchased—it simply means your customer is paying for
        this label. You will purchase the label in Shippo when managing your
        orders.
      </>
    ),
  },
];

const ShippoConfigModal = ({ user, setOpenConnectFlatModal }: any) => {
  const { mutate: syncShippo, isPending: isSyncing } = useSyncShippo();
  const { mutate: connectShippo, isPending: isConnecting } = useConnectShippo();
  const { mutate: disconnectShippo, isPending: isDisconnecting } =
    useDisconnectShippo();
  const { mutate: pickupCarrier, isPending: isPickingCarrier } =
    usePickCarrier();
  const { mutate: changeLabelType, isPending: isChangingLabelType } =
    useChangeLabelType();

  const handleCarrierToggle = (carrierAccount: any) => {
    if (!carrierAccount?.shippo_object_id) return;

    pickupCarrier({
      endpoint: `/api/shippo/carrier/${carrierAccount.id}`,
      active: !carrierAccount.active,
    });
  };

  const handleLabelTypeChange = (rate: any) => {
    changeLabelType({
      endpoint: `/api/shippo/rate-preference/${rate.id}`,
      active: !rate.active,
    });
  };

  return (
    <>
      {user?.shop_info?.shippo_connected ? (
        <div>
          {/* ── Header ── */}
          <div>
            <Image src={shippoImg} alt="shippo" className="w-2/7 mx-auto" />
            <h3 className="text-primary-green text-[18px] -mt-2 md:text-2xl font-bold text-center">
              Shippo Settings
            </h3>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Manage how Sustainable Trades selects shipping rates for your
              orders.
            </p>
          </div>

          {/* How it works */}
          <div className="mt-5 bg-off-green/10 border border-gray-200 rounded-xl p-5">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#0B3C32] flex items-center justify-center flex-shrink-0">
                <BsInfoLg className="text-white text-base" />
              </div>
              <span className="font-bold text-primary-green">How it works</span>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Your settings on this page determine how Sustainable Trades
              chooses the shipping rate applied to your customer's checkout.
            </p>

            <div className="grid grid-cols-5 gap-10">
              {/* Left: steps */}
              <div className="col-span-3 flex flex-col gap-4">
                {HOW_IT_WORKS_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="size-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg bg-off-green/50 text-primary-green mt-1.5">
                      {step.icon}
                    </div>
                    <p className="text-[13px] text-gray-700 leading-relaxed pt-1.5">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right: things to know */}
              <div className="col-span-2 bg-off-green/20 border border-gray-100 rounded-lg p-4">
                <p className="font-semibold text-primary-green mb-3">
                  A few things to know:
                </p>
                <div className="flex flex-col gap-3">
                  {THINGS_TO_KNOW.map((text, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <MdCheckCircle className="text-[#0B3C32] text-xl flex-shrink-0 mt-0.5" />
                      <p className="text-[13px] text-gray-700 leading-relaxed">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Shipping Settings + Return Address ── */}
          <div className="grid grid-cols-2 gap-4 mt-4 mb-5">
            {/* Shipping Settings */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-primary-green">
                Shipping settings
              </p>
              <p className="text-[13px] text-gray-500 mt-0.5 mb-4">
                Choose which carriers to offer and your preferred shipping rate.
              </p>

              {/* Carriers */}
              <p className="text-[13px] font-semibold text-secondary-black mb-2">
                Pick your carriers
              </p>

              <div className="flex flex-col gap-2 mb-5">
                {user?.shop_info?.shippo_carrier_accounts?.map(
                  (carrier: any) => {
                    const isAvailable = !!carrier.shippo_object_id;

                    return (
                      <div
                        key={carrier.id}
                        className={`flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 ${!isAvailable ? "opacity-50" : ""}`}
                      >
                        <div>
                          <p className="text-[14px] text-secondary-black">
                            {carrier.carrier_name}
                          </p>
                          {!isAvailable && (
                            <p className="text-xs text-red-500">
                              Not connected in Shippo
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={!isAvailable || isPickingCarrier}
                          onClick={() => handleCarrierToggle(carrier)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${carrier.active ? "bg-[#0B3C32]" : "bg-gray-300"} ${!isAvailable ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${carrier.active ? "translate-x-6" : "translate-x-1"}`}
                          />
                        </button>
                      </div>
                    );
                  },
                )}
              </div>

              {/* Label type */}
              <p className="text-[13px] font-semibold text-secondary-black mb-2.5">
                Choose label type
              </p>

              <div className="flex flex-col gap-3">
                {user?.shop_info?.shippo_rate_preferences?.map((rate: any) => (
                  <label
                    key={rate.id}
                    className="flex items-start gap-2.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="labelType"
                      checked={rate.active}
                      disabled={isChangingLabelType}
                      onChange={() => handleLabelTypeChange(rate)}
                      className="size-4 mt-0.5 accent-[#0B3C32] flex-shrink-0 cursor-pointer"
                    />

                    <div>
                      <p className="text-[13px] font-semibold text-secondary-black capitalize">
                        {rate.rate_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {rate.rate_type === "cheapest"
                          ? "Choose the lowest cost shipping rate available."
                          : "Choose the quickest delivery time available."}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Return Address */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-primary-green">Return address</p>
              <p className="text-xs text-gray-500 mt-0.5 mb-4">
                This address will be used as the return address on shipping
                labels.
              </p>

              <div className="flex flex-col gap-3 p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">
                    Name / Business name
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5">
                    <p className="text-[14px] text-secondary-black">
                      {user?.shop_info?.shop_name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Address</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5">
                    <p className="text-[14px] text-secondary-black leading-relaxed">
                      {user?.shop_info?.address?.address_line_1}
                      {user?.shop_info?.address?.address_line_2 && (
                        <>, {user?.shop_info?.address?.address_line_2}</>
                      )}
                      <br />
                      {user?.shop_info?.address?.city},{" "}
                      {user?.shop_info?.address?.state}{" "}
                      {user?.shop_info?.address?.postal_code}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="border-t border-gray-200 pt-4 flex gap-3 items-start justify-end">
            <button
              disabled={isDisconnecting}
              onClick={() =>
                disconnectShippo(undefined, {
                  onSuccess: (res: any) => {
                    if (res?.success) {
                      setOpenConnectFlatModal(false);
                    }
                  },
                })
              }
              className="flex items-center gap-1.5 bg-primary-red border border-primary-red text-white px-3 py-2 rounded-lg text-[14px] font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
            >
              <MdSync className="text-base" />
              Disconnect from Shippo
            </button>

            <div className="flex flex-col items-end gap-1">
              <button
                disabled={isSyncing}
                onClick={() => syncShippo()}
                className="flex items-center gap-2 bg-[#0B3C32] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#0a3329] transition"
              >
                <MdSync className="text-base" />
                Sync now
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-end mt-2">
            Sync your settings from Shippo
          </p>
        </div>
      ) : (
        <div>
          <Image src={shippoImg} alt="shippo" className="w-2/5 mx-auto" />

          <h3 className="text-[#3D3D3D] text-[18px] md:text-[24px] font-bold text-center">
            CONNECT TO SHIPPO
          </h3>

          <div className="px-6 pt-3 pb-6 space-y-5">
            <p className="font-semibold text-secondary-black">
              Flexible, powerful shipping starting at $0/month (billed directly
              by Shippo)
            </p>

            <ul className="list-disc list-inside space-y-1 text-secondary-black text-[15px]">
              <li>
                Sync your Sustainable Trades orders with Shippo in just a few
                clicks.
              </li>
              <li>
                Access deeply discounted shipping rates across major carriers.
              </li>
              <li>
                Manage and fulfill orders directly from the Shippo Web App.
              </li>
              <li>
                Automate label creation, returns, tracking updates, and more.
              </li>
            </ul>

            <p className="text-sm text-secondary-black leading-relaxed">
              Shippo is a leading web-based shipping platform designed for small
              and growing online sellers. By creating a Shippo account,
              Sustainable Trades members can import their orders, print shipping
              labels, and streamline fulfillment—all while keeping their data in
              sync with their Sustainable Trades shop.
            </p>

            <p>
              <span className="font-semibold text-secondary-black">
                Sustainable Trades customers are billed directly by Shippo.
              </span>
              <br />
              To learn more,{" "}
              <Link
                target="_blank"
                href="https://support.goshippo.com/hc/en-us/articles/360003855652-Shippo-Subscription-Plan-Overview#h_01HNGBRQ4NXCKXWMCYQSQHC666"
                className="text-blue-500 underline"
              >
                view Shippo’s pricing plans here
              </Link>
              .
            </p>

            <p className="text-primary-green">
              <span className="font-semibold"> Note:</span> Connecting to Shippo
              will allow you to pick from multiple carriers and label types.
            </p>
          </div>

          <div className="flex justify-end px-6 py-4">
            <button
              disabled={isConnecting}
              onClick={() => connectShippo()}
              className="bg-[#0B3C32] text-white px-6 py-2 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
            >
              Connect to Shippo
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShippoConfigModal;
