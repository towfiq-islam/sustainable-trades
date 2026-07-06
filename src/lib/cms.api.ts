import { fetchServerData } from "@/lib/fetchServerData";

// Membership Spotlight
export async function getSpotlightData() {
  return fetchServerData({
    endpoint: "/api/spotlight-applications",
    ssr: true,
  });
}

// Site Settings
export async function getSiteSettings() {
  return fetchServerData({
    endpoint: "/api/site-settings",
    revalidate: 86400,
  });
}

// Get Social Links
export async function getSocialLinks() {
  return fetchServerData({
    endpoint: "/api/social-links",
    revalidate: 86400,
  });
}

// Get Banner
export async function getBannerData() {
  return fetchServerData({
    endpoint: "/api/banners",
    revalidate: 3600,
  });
}

// Get Contact
export async function getContactData() {
  return fetchServerData({
    endpoint: "/api/contact",
    revalidate: 3600,
  });
}

// Get Terms
export async function getTermsData() {
  return fetchServerData({
    endpoint: "/api/terms-and-conditions",
    revalidate: 3600,
  });
}

// Get Infringement
export async function getInfringementData() {
  return fetchServerData({
    endpoint: "/api/infringement-report",
    revalidate: 3600,
  });
}

// How It Works
export async function getHowItWorksData() {
  return fetchServerData({
    endpoint: "/api/how-it-works",
    revalidate: 3600,
  });
}

// Product Categories
export async function getProductCategories() {
  return fetchServerData({
    endpoint: "/api/categories",
    ssr: true,
  });
}

// All Shops
export async function getAllShops() {
  return fetchServerData({
    endpoint: "/api/shops",
    ssr: true,
  });
}

// Get Mission Data
export async function getMissionData() {
  return fetchServerData({
    endpoint: "/api/our-mission",
    revalidate: 3600,
  });
}

// Dynamic Pages
export async function getDynamicPages() {
  return fetchServerData({
    endpoint: "/api/dynamic-pages",
    revalidate: 3600,
  });
}

// Single Dynamic page
export async function getSingleDynamicPage(slug: string) {
  return fetchServerData({
    endpoint: `/api/dynamic-pages/single/${slug}`,
    revalidate: 3600,
  });
}

// Blogs
export async function getBlogs() {
  return fetchServerData({
    endpoint: "/api/blogs",
    revalidate: 3600,
  });
}

// Single Blog
export async function getSingleBlog(id: number) {
  return fetchServerData({
    endpoint: `/api/blog/${id}`,
    revalidate: 3600,
  });
}

// Get FAQ
export const getFAQ = () => {
  return fetchServerData({
    endpoint: "/api/faq/all",
    revalidate: 3600,
  });
};
