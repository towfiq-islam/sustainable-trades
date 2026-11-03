import Link from "next/link";
import { FiHome, FiShoppingBag } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <p className="text-8xl md:text-9xl font-black text-primary-green tracking-tight select-none">
          404
        </p>

        {/* Title */}
        <h1 className="mt-4 text-2xl md:text-3xl font-bold text-secondary-black">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-2 text-sm md:text-base text-muted-gray leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-green hover:bg-forest-green text-white font-medium text-sm px-6 py-3 rounded-full transition shadow-sm"
          >
            <FiHome className="text-base" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-warm-beige text-primary-green border border-border-stone font-medium text-sm px-6 py-3 rounded-full transition shadow-sm"
          >
            <FiShoppingBag className="text-base" />
            <span>Browse Shops</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
