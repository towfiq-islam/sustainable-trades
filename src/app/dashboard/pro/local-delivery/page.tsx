"use client";
import { useState } from "react";
import {
  FiInfo,
  FiAlertTriangle,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { AddRangeModal } from "./_components/AddRangeModalProps";
import { EditOriginModal } from "./_components/EditOriginModal";
import {
  ApiDeliveryOrigin,
  ApiDeliveryRange,
  formatFee,
  mapApiOriginToOrigin,
  mapApiRangeToRange,
} from "../../../../Types/LocalDelivery";
import Link from "next/link";
import { FaLightbulb } from "react-icons/fa";
import Modal from "@/Components/Common/Modal";
import toast from "react-hot-toast";
import {
  useDeleteDeliveryRangeMutation,
  useGetDeliveryOriginQuery,
  useGetDeliveryRangesQuery,
} from "@/redux/api/vendorApi";

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-900">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>

      <div className="mt-2 space-y-2 text-[14px] leading-relaxed text-neutral-600">
        {children}
      </div>
    </div>
  );
}

export default function LocalDeliverySettingsPage() {
  const { data: originRes, isLoading: isOriginLoading } =
    useGetDeliveryOriginQuery({});
  const { data: rangesRes, isLoading: isRangesLoading } =
    useGetDeliveryRangesQuery({});
  const [deleteDeliveryRange] = useDeleteDeliveryRangeMutation();
  const [isOriginModalOpen, setIsOriginModalOpen] = useState(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [editingRangeId, setEditingRangeId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const origin = originRes?.data
    ? mapApiOriginToOrigin(originRes.data as ApiDeliveryOrigin)
    : null;

  const ranges = ((rangesRes?.data as ApiDeliveryRange[]) ?? []).map(
    mapApiRangeToRange,
  );

  async function handleDeleteRange(id: number) {
    setDeletingId(id);
    try {
      const res = await deleteDeliveryRange(id).unwrap();
      toast.success(res?.message ?? "Delivery range removed");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Couldn't delete this range");
    } finally {
      setDeletingId(null);
    }
  }

  function openAddRange() {
    setEditingRangeId(null);
    setIsRangeModalOpen(true);
  }

  function openEditRange(id: number) {
    setEditingRangeId(id);
    setIsRangeModalOpen(true);
  }

  const editingRange = ranges.find(r => r.id === editingRangeId) ?? null;

  return (
    <>
      <h1 className="text-3xl font-semibold text-secondary-black mb-2.5">
        Local Delivery Settings
      </h1>

      <p className="text-secondary-gray text-[15px] mb-2.5">
        Set up custom local delivery fees based on the distance from your
        delivery origin. Shoppers will see the <br /> delivery fee during
        checkout based on their delivery address.
      </p>

      <p className="text-secondary-gray text-[15px] mb-6">
        Please note, local delivery is only available for shops with an online
        payment provider connected.
        <br />
        To connect a payment provider, go to payments -{" "}
        <Link
          href="/dashboard/pro/payment-method"
          className="font-medium text-emerald-800 underline underline-offset-2"
        >
          Payment Integration
        </Link>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-7 items-start">
        {/* Left */}
        <div className="space-y-4">
          {/* How it works */}
          <div className="flex gap-3 border border-gray-200 bg-off-green/20 rounded-xl p-4">
            <span className="size-8 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center shrink-0">
              <FaLightbulb className="text-primary-green text-lg" />
            </span>
            <div>
              <p className="font-semibold text-secondary-black mb-0.5">
                How it works
              </p>
              <p className="text-sm text-secondary-gray leading-6">
                Create as many distance ranges as you need and assign a delivery
                fee for each. <br /> The correct fee will be applied at checkout
                based on the distance from your delivery origin to the
                shopper&apos;s address.
              </p>
            </div>
          </div>

          {/* Delivery Origin */}
          <div className="rounded-xl border border-neutral-200 p-4.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-neutral-900">
                  Delivery Origin (Your Home Base)
                </h3>
                <p className="mt-1 text-[15px] text-neutral-600">
                  This address is the starting point (0 miles) for calculating
                  delivery distances.
                </p>
              </div>
              <button
                onClick={() => setIsOriginModalOpen(true)}
                className="shrink-0 rounded-lg border border-primary-green/70 px-4 py-2 text-sm font-semibold text-primary-green transition hover:bg-primary-green duration-300 cursor-pointer hover:text-white"
              >
                {origin ? "Edit Address" : "Add Address"}
              </button>
            </div>

            {isOriginLoading ? (
              <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-neutral-100" />
            ) : origin ? (
              <div className="mt-4 flex items-start gap-3">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-off-green/50 text-primary-green">
                  <FiMapPin className="h-4 w-4" />
                </span>

                <div className="text-sm leading-relaxed text-neutral-700">
                  {origin.street}
                  {origin.apartment ? `, ${origin.apartment}` : ""}
                  <br />
                  {origin.city}, {origin.state} {origin.zip}
                  <br />
                  {origin.country}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-neutral-500">
                No delivery origin set yet. Add your home base address to start
                calculating delivery fees.
              </p>
            )}
          </div>

          {/* Delivery Ranges */}
          <div className="rounded-xl border border-neutral-200">
            <div className="flex items-start justify-between gap-4 p-4 pb-0">
              <div>
                <h3 className="font-semibold text-neutral-900">
                  Your Local Delivery Ranges
                </h3>
                <p className="mt-1 text-[15px] text-neutral-600">
                  Add distance ranges and set a delivery fee for each.
                </p>
              </div>
              <button
                onClick={openAddRange}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-green cursor-pointer px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:scale-95"
              >
                <FiPlus className="h-4 w-4" />
                Add Range
              </button>
            </div>

            <div className="mt-4 overflow-hidden">
              <table className="w-full text-left text-[15px]">
                <thead>
                  <tr className="border-b border-neutral-200 bg-off-green/10 text-neutral-500">
                    <th className="px-4 py-3 font-medium">
                      Distance Range (miles)
                    </th>
                    <th className="px-4 py-3 font-medium">Delivery Fee</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isRangesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b border-neutral-100">
                        <td className="px-4 py-3.5" colSpan={3}>
                          <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                        </td>
                      </tr>
                    ))
                  ) : ranges.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-10 text-center text-neutral-500"
                      >
                        No delivery ranges yet. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    ranges.map((range, index) => (
                      <tr
                        key={range.id}
                        className={`hover:bg-off-green/20 ${
                          index !== ranges.length - 1
                            ? "border-b border-neutral-100"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 text-neutral-800">
                          {range.minMiles} to {range.maxMiles} miles
                        </td>
                        <td
                          className={
                            range.fee === 0
                              ? "px-4 py-3.5 font-medium text-emerald-700"
                              : "px-4 py-3.5 text-neutral-800"
                          }
                        >
                          {formatFee(range.fee)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-4">
                            <button
                              aria-label="Edit range"
                              onClick={() => openEditRange(range.id)}
                              disabled={deletingId === range.id}
                              className="text-neutral-400 transition hover:text-primary-green cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              aria-label="Delete range"
                              onClick={() => handleDeleteRange(range.id)}
                              disabled={deletingId === range.id}
                              className="text-neutral-400 transition hover:text-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 p-5 rounded-xl border border-gray-200">
          <InfoCard
            icon={<FiInfo className="h-4 w-4" />}
            title="About Local Delivery"
          >
            <p>
              Offer local delivery to make it easier for nearby customers to get
              their orders.
            </p>
            <p>
              Delivery fees you set here will be shown to shoppers at checkout
              based on their address.
            </p>
            <p>
              Distances are calculated in a straight line from your delivery
              origin to the shopper&apos;s address.
            </p>
          </InfoCard>

          <div className="border-t border-neutral-200 pt-4">
            <InfoCard
              icon={<FiAlertTriangle className="h-4 w-4" />}
              title="Important"
            >
              <p>
                Make sure your delivery origin address is accurate. All distance
                calculations are based on this location.
              </p>
              <p>
                You can update your ranges or fees at any time. Changes will
                apply to future orders.
              </p>
            </InfoCard>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <InfoCard
              icon={<FiAlertTriangle className="h-4 w-4" />}
              title="Important Tax Note"
            >
              <p>
                If you are using the Sustainable Trades Local Sales Tax setting
                from your dashboard, please ensure that the same sales tax rate
                applies throughout your local delivery area.
              </p>
              <p>
                If orders delivered to different areas may be subject to
                different tax rates, we recommend using ZipTax to automatically
                calculate the correct sales tax based on the delivery address.
              </p>
            </InfoCard>
          </div>

          <div className="border border-gray-200 bg-off-green/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaLightbulb className="text-primary-green text-lg shrink-0" />
              <p className="font-semibold text-secondary-black">Tip</p>
            </div>
            <p className="text-sm text-secondary-gray leading-relaxed">
              Want to offer free delivery nearby? Create a range like &quot;0 to
              10 miles&quot; and set the fee to $0.00. You can add as many
              ranges as needed to fit your delivery area and pricing.
            </p>
          </div>
        </aside>
      </div>

      {/* Modals */}
      <Modal
        open={isOriginModalOpen}
        onClose={() => setIsOriginModalOpen(false)}
        className="max-w-lg"
      >
        <EditOriginModal
          origin={origin}
          onClose={() => setIsOriginModalOpen(false)}
        />
      </Modal>

      <Modal
        open={isRangeModalOpen}
        onClose={() => setIsRangeModalOpen(false)}
        className="max-w-xl"
      >
        <AddRangeModal
          initialRange={editingRange}
          onClose={() => {
            setIsRangeModalOpen(false);
            setEditingRangeId(null);
          }}
        />
      </Modal>
    </>
  );
}
