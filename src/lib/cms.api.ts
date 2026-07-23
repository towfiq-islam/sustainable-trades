import { serverFetch } from "@/lib/serverFetch";

// Membership Spotlight
export async function getSpotlightData() {
  return serverFetch({
    endpoint: "/api/spotlight-applications",
    mode: "SSR",
  });
}

// Site Settings
export async function getSiteSettings() {
  return serverFetch({
    endpoint: "/api/site-settings",
    mode: "ISR",
    revalidate: 86400,
  });
}

// Get Social Links
export async function getSocialLinks() {
  return serverFetch({
    endpoint: "/api/social-links",
    mode: "ISR",
    revalidate: 86400,
  });
}

// Get Banner
export async function getBannerData() {
  return serverFetch({
    endpoint: "/api/banners",
    mode: "ISR",
    revalidate: 3600,
  });
}

// Get Contact
export async function getContactData() {
  return serverFetch({
    endpoint: "/api/contact",
    mode: "ISR",
    revalidate: 3600,
  });
}

// Get Terms
export async function getTermsData() {
  return serverFetch({
    endpoint: "/api/terms-and-conditions",
    mode: "ISR",
    revalidate: 3600,
  });
}

// Get Infringement
export async function getInfringementData() {
  return serverFetch({
    endpoint: "/api/infringement-report",
    mode: "ISR",
    revalidate: 3600,
  });
}

// How It Works
export async function getHowItWorksData() {
  return serverFetch({
    endpoint: "/api/how-it-works",
    mode: "ISR",
    revalidate: 3600,
  });
}

// Product Categories
export async function getProductCategories() {
  return serverFetch({
    endpoint: "/api/categories",
    mode: "SSR",
  });
}

// All Shops
export async function getAllShops() {
  return serverFetch({
    endpoint: "/api/shops",
    mode: "SSR",
  });
}

// Get Mission Data
export async function getMissionData() {
  return serverFetch({
    endpoint: "/api/our-mission",
    mode: "ISR",
    revalidate: 3600,
  });
}

// Dynamic Pages
export async function getDynamicPages() {
  return serverFetch({
    endpoint: "/api/dynamic-pages",
    mode: "ISR",
    revalidate: 3600,
  });
}

// Single Dynamic page
export async function getSingleDynamicPage(slug: string) {
  return serverFetch({
    endpoint: `/api/dynamic-pages/single/${slug}`,
    mode: "ISR",
    revalidate: 3600,
  });
}

// Blogs
export async function getBlogs() {
  return serverFetch({
    endpoint: "/api/blogs",
    revalidate: 3600,
    mode: "ISR",
  });
}

// Single Blog
export async function getSingleBlog(id: number) {
  return serverFetch({
    endpoint: `/api/blog/${id}`,
    mode: "ISR",
    revalidate: 3600,
  });
}

// Get FAQ
export const getFAQ = () => {
  return serverFetch({
    endpoint: "/api/faq/all",
    mode: "ISR",
    revalidate: 3600,
  });
};
