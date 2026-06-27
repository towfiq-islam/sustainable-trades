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
        ""
      ) : (
        <div>
          <Image src={shippoImg} alt="shippo" className="w-2/5 mx-auto" />

          <h3 className="text-[#3D3D3D] text-[18px] md:text-[24px] font-bold text-center">
            {user?.shop_info?.shippo_connected
              ? "DISCONNECT FROM SHIPPO"
              : "CONNECT TO SHIPPO"}
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

            {!user?.shop_info?.shippo_connected && (
              <p className="text-primary-green">
                <span className="font-semibold"> Note:</span> Connecting to
                Shippo will allow you to pick from multiple carriers and label
                types.
              </p>
            )}

            {user?.shop_info?.shippo_connected && (
              <div className="space-y-5 border-t pt-5 border-gray-700">
                {/* Carrier */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-black mb-3">
                    Pick your carrier
                  </label>

                  <div className="space-y-3">
                    {user?.shop_info?.shippo_carrier_accounts?.map(
                      (carrierAccount: any) => {
                        const isAvailable = !!carrierAccount.shippo_object_id;

                        return (
                          <div
                            key={carrierAccount.id}
                            className={`flex items-center justify-between border rounded-lg p-3 ${
                              !isAvailable ? "opacity-50" : ""
                            }`}
                          >
                            <div>
                              <p className="font-medium">
                                {carrierAccount.carrier_name}
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
                              onClick={() =>
                                handleCarrierToggle(carrierAccount)
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                carrierAccount.active
                                  ? "bg-primary-green"
                                  : "bg-gray-300"
                              } ${
                                !isAvailable
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  carrierAccount.active
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Label Type */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-black mb-3">
                    Choose label type
                  </label>

                  <div className="space-y-2">
                    {user?.shop_info?.shippo_rate_preferences?.map(
                      (rate: any) => (
                        <label
                          key={rate.id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            disabled={isChangingLabelType}
                            name="labelType"
                            checked={rate.active}
                            onChange={() => handleLabelTypeChange(rate)}
                            className="h-4 w-4 accent-primary-green cursor-pointer"
                          />

                          <span className="capitalize">{rate.rate_type}</span>
                        </label>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end px-6 py-4">
            {user?.shop_info?.shippo_connected ? (
              <div className="flex gap-3 items-center">
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
                  className="bg-primary-red text-white px-6 py-2 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
                >
                  Disconnect from Shippo
                </button>

                <button
                  disabled={isSyncing}
                  onClick={() => syncShippo()}
                  className="bg-[#0B3C32] text-white px-6 py-2 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
                >
                  Sync now
                </button>
              </div>
            ) : (
              <button
                disabled={isConnecting}
                onClick={() => connectShippo()}
                className="bg-[#0B3C32] text-white px-6 py-2 rounded-md font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
              >
                Connect to Shippo
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShippoConfigModal;
