import { ReactNode } from "react";
import { IconType } from "react-icons";

interface EmptyStateProps {
  icon?: IconType | ReactNode;
  title: string;
  description: string;
  iconColor?: string;
  iconBg?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Reusable empty state component.
 * Deduplicates the repeated empty state pattern used in
 * ReuseableFavorite, ReuseableNotification, and other list views.
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  iconColor = "text-accent-red",
  iconBg = "bg-accent-red/10",
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-16">
      {Icon && (
        <div className={`size-14 rounded-full ${iconBg} grid place-items-center mb-5`}>
          {typeof Icon === "function" ? (
            <Icon className={`${iconColor} text-2xl`} />
          ) : (
            Icon
          )}
        </div>
      )}
      <h6 className="text-secondary-black font-semibold">{title}</h6>
      <p className="text-sm text-gray-500 font-normal mt-2 max-w-xs">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-5 py-2 rounded-lg bg-primary-green text-white font-semibold hover:bg-transparent hover:text-primary-green border-2 border-primary-green transition-all duration-500 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export { EmptyState };
export default EmptyState;
