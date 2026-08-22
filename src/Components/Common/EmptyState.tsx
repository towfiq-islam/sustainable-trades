export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="flex flex-col justify-center items-center gap-4 text-center py-12 md:py-20 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/60">
    <div className="size-16 md:size-20 rounded-full bg-primary-green/10 grid place-items-center text-primary-green text-2xl md:text-4xl">
      {icon}
    </div>
    <div className="space-y-1.5">
      <p className="text-secondary-black text-base md:text-lg font-semibold">
        {title}
      </p>
      <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
        {description}
      </p>
    </div>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-2 px-5 py-2.5 rounded-full bg-primary-green text-white text-sm font-medium hover:opacity-90 transition cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
