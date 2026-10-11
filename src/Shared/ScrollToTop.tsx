"use client";
import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";

function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    // If the URL has an in-page hash anchor (e.g. #reviews), let the browser handle it
    if (window.location.hash) return;

    // Reset window scroll to the very top immediately on route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollManager />
    </Suspense>
  );
}
