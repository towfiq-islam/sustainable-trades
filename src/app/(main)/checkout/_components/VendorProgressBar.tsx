const VendorProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div className="mb-3">
    <div className="flex gap-1.5 mb-2">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`h-1.5 flex-1 rounded-full ${
            idx < current ? "bg-primary-green" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
    <p className="text-sm text-secondary-gray">
      Vendor {current} of {total}
    </p>
  </div>
);

export default VendorProgressBar;
