"use client";
import { useState } from "react";
import {
  FiMapPin,
  FiAlertTriangle,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import AddPickupLocationModal, {
  PickupLocationFormValues,
} from "./_components/AddPickupLocationModal";
import { IoIosWarning } from "react-icons/io";
import { FaLightbulb } from "react-icons/fa";
import Modal from "@/Components/Common/Modal";

export type PickupLocation = PickupLocationFormValues & {
  id: number;
  is_active: boolean;
};

const INITIAL_LOCATIONS: PickupLocation[] = [
  {
    id: 1,
    location_name: "Main Workshop",
    address: "123 Craft Lane",
    apt_suite: "",
    city: "Austin",
    state: "TX",
    zip: "78701",
    country: "United States",
    is_active: true,
  },
  {
    id: 2,
    location_name: "Northside Studio",
    address: "2500 Maple Ave",
    apt_suite: "",
    city: "Austin",
    state: "TX",
    zip: "78702",
    country: "United States",
    is_active: true,
  },
  {
    id: 3,
    location_name: "East Austin Workspace",
    address: "890 Oak Springs Dr",
    apt_suite: "",
    city: "Austin",
    state: "TX",
    zip: "78702",
    country: "United States",
    is_active: true,
  },
];

const LocalPickupPage = () => {
  const [locations, setLocations] =
    useState<PickupLocation[]>(INITIAL_LOCATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<PickupLocation | null>(
    null,
  );

  const openAddModal = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const openEditModal = (location: PickupLocation) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleSave = (values: PickupLocationFormValues) => {
    if (editingLocation) {
      // TODO: dispatch(updatePickupLocation({ id: editingLocation.id, ...values }))
      setLocations(prev =>
        prev.map(loc =>
          loc.id === editingLocation.id ? { ...loc, ...values } : loc,
        ),
      );
    } else {
      // TODO: dispatch(createPickupLocation(values))
      setLocations(prev => [
        ...prev,
        { ...values, id: Date.now(), is_active: true },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    // TODO: dispatch(deletePickupLocation(id))
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-secondary-black mb-2">
        Local Pickup Locations
      </h1>

      <p className="text-secondary-gray text-[15px]">
        Add the physical locations where buyers can pick up their orders.
      </p>

      <p className="text-secondary-gray text-[15px] mb-6">
        These locations will appear as options for shoppers during the Arrange
        Local Pickup checkout.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-7 items-start">
        <div>
          {/* How it works */}
          <div className="flex gap-3 border border-gray-200 bg-off-green/20 rounded-xl p-4 mb-4">
            <span className="size-8 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center shrink-0">
              <FaLightbulb className="text-primary-green text-lg" />
            </span>
            <div>
              <p className="font-semibold text-secondary-black mb-1">
                How it works
              </p>
              <p className="text-sm text-secondary-gray">
                Buyers will see the locations you add here as pickup options
                during checkout.
              </p>
              <p className="text-sm text-secondary-gray">
                After the order is placed, you can coordinate pickup details
                directly with the buyer via messages.
              </p>
            </div>
          </div>

          {/* Cash on delivery notice */}
          <div className="flex gap-3 border border-amber-200/90 bg-amber-50/50 rounded-xl p-4 mb-6">
            <span className="size-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              i
            </span>
            <div className="text-sm text-secondary-gray">
              <p className="font-semibold text-secondary-black mb-2">
                Important: Cash on Delivery for Local Pickup
              </p>

              <p>
                When a customer selects Arrange Local Pickup, they may choose
                Cash on Delivery at checkout. Payment will be due when you meet
                in person to hand over the order. You can check payment status
                in two places:
              </p>
              <ul className="list-disc ml-5 my-2">
                <li>Orders &gt; Payment Status (Paid or Pending)</li>
                <li>Payments &gt; Status</li>
              </ul>
              <p>
                If the status is Pending, please collect payment when the
                customer picks up their order.
              </p>
            </div>
          </div>

          {/* Locations table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg text-secondary-black">
                Your Local Pickup Locations
              </h2>
              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 bg-primary-green text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary-green/90 transition-colors cursor-pointer"
              >
                <FiPlus />
                Add Location
              </button>
            </div>

            {locations.length > 0 ? (
              <>
                <div className="hidden md:grid grid-cols-[1.2fr_1.6fr_0.8fr_0.8fr] gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wide text-secondary-gray border-b border-gray-100">
                  <span>Location Name</span>
                  <span>Address</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {locations.map(location => (
                    <div
                      key={location.id}
                      className="grid grid-cols-1 md:grid-cols-[1.2fr_1.6fr_0.8fr_0.8fr] gap-2 md:gap-4 px-5 py-4 items-start md:items-center hover:bg-off-green/20"
                    >
                      <span className="font-semibold text-primary-green text-[15px]">
                        {location.location_name}
                      </span>

                      <span className="text-sm text-secondary-gray leading-relaxed">
                        {location.address}
                        {location.apt_suite ? `, ${location.apt_suite}` : ""}
                        <br />
                        {location.city}, {location.state} {location.zip}
                        <br />
                        {location.country}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm">
                        <span
                          className={`size-2 rounded-full ${
                            location.is_active
                              ? "bg-primary-green"
                              : "bg-gray-300"
                          }`}
                        />
                        <span
                          className={
                            location.is_active
                              ? "text-primary-green font-medium"
                              : "text-secondary-gray"
                          }
                        >
                          {location.is_active ? "Active" : "Inactive"}
                        </span>
                      </span>
                      <span className="flex items-center gap-5">
                        <button
                          type="button"
                          onClick={() => openEditModal(location)}
                          aria-label={`Edit ${location.location_name}`}
                          className="text-secondary-gray hover:text-primary-green cursor-pointer"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(location.id)}
                          aria-label={`Delete ${location.location_name}`}
                          className="text-secondary-gray hover:text-red-600 cursor-pointer"
                        >
                          <FiTrash2 />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-secondary-gray text-sm py-12">
                You haven't added any pickup locations yet.
              </p>
            )}
          </div>

          <p className="text-sm text-secondary-gray mt-4">
            Need help? Visit our{" "}
            <a href="/help" className="text-primary-green underline">
              Help Center
            </a>{" "}
            to learn more about Local Pickup.
          </p>
        </div>

        {/* Sidebar */}
        <div className="space-y-7 p-6 rounded-xl border border-gray-200 shadow">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-6 rounded-full bg-primary-green text-white flex items-center justify-center">
                i
              </div>
              <p className="font-semibold text-secondary-black">
                About Local Pickup Locations
              </p>
            </div>

            <p className="text-[15px] text-secondary-gray leading-relaxed">
              These are the addresses where you offer Local Pickup. Shoppers
              will see these as selectable options during checkout.
            </p>
            <p className="text-[15px] text-secondary-gray leading-relaxed mt-2">
              Make sure each address is accurate and up to date so buyers can
              pick up their orders without any issues.
            </p>

            <hr className="my-4 border-gray-200" />

            <div className="flex items-center gap-2 mb-2">
              <IoIosWarning className="text-primary-green text-2xl shrink-0" />
              <p className="font-semibold text-secondary-black">
                Important Tax Note
              </p>
            </div>
            <p className="text-[15px] text-secondary-gray leading-relaxed">
              If you are using the Sustainable Trades Local Sales Tax setting
              from your dashboard, please ensure that the same sales tax rates
              apply to all of your local pickup locations.
            </p>
            <p className="text-[15px] text-secondary-gray leading-relaxed mt-2">
              If your locations have different tax rates, we recommend using
              ZipTax to automatically calculate the correct rate for the pickup
              location.
            </p>
          </div>

          <div className="border border-gray-200 bg-off-green/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaLightbulb className="text-primary-green text-lg shrink-0" />
              <p className="font-semibold text-secondary-black">Tip</p>
            </div>
            <p className="text-sm text-secondary-gray leading-relaxed">
              You can add as many pickup locations as you need. Buyers will
              choose the one most convenient for them during checkout.
            </p>
          </div>
        </div>

        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="max-w-lg !rounded-xl"
        >
          <AddPickupLocationModal
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
            defaultValues={editingLocation ?? undefined}
          />
        </Modal>
      </div>
    </>
  );
};

export default LocalPickupPage;
