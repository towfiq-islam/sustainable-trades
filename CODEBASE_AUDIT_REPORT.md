# Comprehensive Codebase Review & Audit Report
**Project:** Sustainable Trades (`melissabooth-123-next-js`)  
**Scope:** Bugs & Errors, Security Issues, Optimization Issues, Performance Issues, Responsive Issues, UI/UX Issues  
**Status:** In Progress (3 Critical Issues Resolved)

---

## 1. Bugs & Errors

1. **Broken Seller Messaging & Trade Offers (Uninitialized State)** — `[RESOLVED]`
   - **Files:** [ProductDescription.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/productDetails/ProductDescription.tsx), [TradeOfferModal.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/Modals/TradeOfferModal.tsx), [MessageToSellerModal.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/Modals/MessageToSellerModal.tsx)
   - **Original Issue:** `const [id] = useState(null)` and `const [productId] = useState(null)` were initialized to `null` and never updated. Both modal dialogs received `null` IDs, causing trade creation and messaging seller to fail with `{ receiver_id: null }`.
   - **Resolution:** Removed orphaned state variables, passed `data?.shop_info_id ?? data?.shop?.id` and `data?.id` directly to `TradeOfferModal`, passed seller user ID directly to `MessageToSellerModal`, added reactive `productId` effect in `TradeOfferModal`, guarded RTK query execution, and added submission validation guards.

2. **Relative Dashboard Navigation Breaks on Nested Routes** — `[OPEN]`
   - **File:** [CombinedNavbar.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Shared/CombinedNavbar.tsx#L102-L129)
   - **Issue:** In dashboard mode, `messagesHref`, `notificationHref`, and `favoritesHref` return relative paths (`"messages"`, `"notification"`, `"favorites"`) instead of absolute paths (e.g. `"/dashboard/pro/messages"`).
   - **Impact:** Clicking notifications or messages from a sub-route like `/dashboard/pro/orders/details/12` resolves to `/dashboard/pro/orders/details/messages`, resulting in a **404 Page Not Found**.

3. **Google Maps API Key Environment Variable Mismatch** — `[RESOLVED]`
   - **Files:** [ProductMap.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/shop/ProductMap.tsx#L93-L95), [ShopsMap.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/shop/ShopsMap.tsx#L84-L86), [StepFour.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/auth/create-shop/_components/StepFour.tsx#L31), [getLatLng.ts](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/lib/getLatLng.ts#L3), [.env](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/.env)
   - **Original Issue:** Inconsistent environment variable naming between `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` (singular) and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (plural).
   - **Resolution:** Standardized on `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` across all components, helpers, and `.env`.

4. **Chat Conversation Message Leaks Across Conversations** — `[OPEN]`
   - **File:** [MessagePage.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/messages/MessagePage.tsx#L198-L205)
   - **Issue:** The real-time listener `MessageSentEvent` only checks `e?.data?.receiver_id === +user.id`, but **does not verify `e?.data?.conversation_id === conversationId`**.
   - **Impact:** If user A has a chat window open with user B, and user C sends user A a message, user C's message is directly injected into the chat window with user B.

5. **`EmptyState` Never Rendered in Category and Nearby Shop Products** — `[OPEN]`
   - **File:** [shop/page.tsx:L181](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/(main)/shop/page.tsx#L181) & [L221](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/(main)/shop/page.tsx#L221)
   - **Issue:** Checks `categoryDetails?.data?.length === 0` and `nearbyProducts?.data?.length === 0`. However, `data` is an object (`{ category, products: { data: [...] } }`), so `.length` is always `undefined`.
   - **Impact:** When a category has zero products, the check fails and renders an empty grid with no user feedback instead of the `<EmptyState />` component.

6. **Automatic Sales Tax States Never Load into Form State** — `[RESOLVED]`
   - **File:** [taxes/page.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/dashboard/pro/taxes/page.tsx)
   - **Original Issue:** `states` initialized to `taxData?.data?.states || []`. Because `taxData` is initially undefined, `states` remained empty and never loaded on initial visit.
   - **Resolution:** Pre-populated form state with all 50 US states via `country-state-city`, merged backend saved state data via reactive `useEffect`, added API key sync and provider sync, and added skeleton loader states.

7. **Fragile URL Parsing for Pagination** — `[OPEN]`
   - **Files:** [LocalMagicMarker.tsx:L135](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/shop/LocalMagicMarker.tsx#L135) & [shop-location/[address]/page.tsx:L195](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/(main)/shop-location/%5Baddress%5D/page.tsx#L195)
   - **Issue:** `item.url.split("=")[1]` assumes `page` is the only query parameter. If the backend returns `?filter=x&page=2`, `.split("=")[1]` extracts `"x&page"`.
   - **Fix:** Use `new URL(item.url).searchParams.get("page")`.

8. **Unsafe Star Rating Calculations Causing Runtime `RangeError`** — `[OPEN]`
   - **File:** [ProductReviews.tsx:L41-L48](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/productDetails/ProductReviews.tsx#L41-L48)
   - **Issue:** `Array.from({ length: 5 - +item?.rating })`. If `item.rating` is invalid, float, or greater than 5, `Array.from` with negative length throws a fatal `RangeError: Invalid array length`.

---

## 2. Security Issues

1. **Stored Cross-Site Scripting (XSS) in Chat Messages** — `[CRITICAL]`
   - **File:** [MessagePage.tsx:L360-L367](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/messages/MessagePage.tsx#L360-L367) & [L401-L404](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/messages/MessagePage.tsx#L401-L404)
   - **Issue:** Raw user chat messages are passed directly into `<p dangerouslySetInnerHTML={{ __html: formattedMessage }} />` with only string replaces for newlines. There is **no HTML sanitization** (such as DOMPurify).
   - **Impact:** An attacker can send `<img src=x onerror="fetch('/api/users/data').then(...)">` or script payloads to compromise the recipient’s session.

2. **Unenforced Route Protection / Commented-Out Auth Guard** — `[HIGH]`
   - **File:** [proxy.ts:L8-L11](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/proxy.ts#L8-L11)
   - **Issue:** The Next.js middleware protection check is commented out:
     ```ts
     // if (!token && isProtectedRoute) {
     //   return NextResponse.redirect(new URL("/auth/login", request.url));
     // }
     ```
   - **Impact:** Any unauthenticated user can directly request `/dashboard/*` routes. Although backend APIs reject unauthorized calls, the frontend renders partially initialized layouts with empty sidebars and broken states. Also, `proxy.ts` is not recognized by Next.js as the active middleware file unless named `middleware.ts`.

3. **Wildcard Image Remote Patterns (SSRF & DoS Risk)** — `[MEDIUM]`
   - **File:** [next.config.ts:L3-L13](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/next.config.ts#L3-L13)
   - **Issue:** `hostname: "**"` wildcard allows Next.js Image Optimization endpoint (`/_next/image?url=...`) to request and process images from any server on the internet.
   - **Impact:** Exposes the server to cache exhaustion, denial-of-service, and server-side request forgery (SSRF).

4. **Open Redirect Vulnerability in Authentication** — `[MEDIUM]`
   - **File:** [login/page.tsx:L48-L51](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/auth/login/page.tsx#L48-L51)
   - **Issue:** `const redirectTo = searchParams.get("redirect");` followed by `router.push(redirectTo);` without verifying that `redirectTo` starts with a single `/` and not `//` or an external URL (`https://evil.com`).
   - **Impact:** Phishing vectors where users are redirected to malicious sites after successful login.

---

## 3. Optimization Issues

1. **Dynamic Rendering De-optimization on All Static/ISR CMS Routes** — `[RESOLVED]`
   - **File:** [serverFetch.ts:L17-L18](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/lib/serverFetch.ts#L17-L18)
   - **Original Issue:** `serverFetch` unconditionally called `const cookieStore = await cookies();` on **every single request**, even for `mode: "ISR"` or `mode: "SSG"` CMS endpoints.
   - **Resolution:** Gated `cookies()` access so it is only invoked when `mode === "SSR"`. All static and ISR routes (Terms, FAQs, How-To, Spotlight, Categories) now maintain full SSG generation and ISR caching without being de-optimized into request-time dynamic rendering.

2. **Missing `useCallback` in Core Hooks Causing Cascading Re-renders** — `[RESOLVED]`
   - **Files:** [useAuth.tsx:L30-L35](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Hooks/useAuth.tsx#L30-L35), [useAddToCart.tsx:L24-L46](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Hooks/useAddToCart.tsx#L24-L46), [useAddFavorite.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Hooks/useAddFavorite.tsx), [useFollowShop.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Hooks/useFollowShop.tsx), [useDownloadInvoice.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Hooks/useDownloadInvoice.tsx)
   - **Original Issue:** Action dispatchers (`setLatitude`, `setLongitude`, `handleAddToCart`) were defined as inline anonymous functions and returned as new object references on every render.
   - **Resolution:** Wrapped all action dispatchers and mutation triggers across core hooks in `useCallback` with stable dependency arrays, ensuring reference equality and preventing cascading re-renders in subscribing components.

3. **Duplicate Field Append in Form Submission**
   - **File:** [CreateListing.tsx:L138](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/createListing/CreateListing.tsx#L138) & [L156](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/createListing/CreateListing.tsx#L156)
   - **Issue:** `fd.append("cost", data.cost)` is executed twice in the same submission handler.

4. **Floating-Point Drift in Cart Totals**
   - **File:** [cartSlice.ts:L22](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/redux/slices/cartSlice.ts#L22)
   - **Issue:** `calculateTotalPrice` computes sums with IEEE 754 raw floating-point arithmetic (`productTotal + product.price * product.quantity`), leading to values like `$19.990000000000002`.

---

## 4. Performance Issues

1. **Geolocation Prompt on Initial Page Load & Potential Render Loop** — `[RESOLVED]`
   - **File:** [LocationProvider.tsx:L10-L31](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Provider/LocationProvider/LocationProvider.tsx#L10-L31)
   - **Original Issue:** `LocationProvider` called `navigator.geolocation.getCurrentPosition` unconditionally on root mount, causing aggressive permission prompts immediately on initial visit, potential re-render loops upon location updates, and heavy high-accuracy hardware polling.
   - **Resolution:** Added `hasRequested` ref guard, checked if Redux already contains persisted coordinates before requesting, switched to low-power network location with 5-minute cache (`maximumAge: 300000`, `enableHighAccuracy: false`), and queried the Permissions API to prevent redundant queries and avoid render loops.

2. **Memory Leak in Pusher WebSocket Subscriptions**
   - **File:** [ConversationList.tsx:L84-L95](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/messages/ConversationList.tsx#L84-L95)
   - **Issue:** `useEffect` listens to `ConversationEvent` on `echo.private(...)`, but **has no cleanup return function**.
   - **Impact:** Every time the user navigates to and from the inbox, a new listener is attached without detaching the old one, causing duplicate event dispatches and memory leaks.

3. **Object URL Memory Leaks in Image Previews**
   - **Files:** [ImageUpload.tsx:L27](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/createListing/ImageUpload.tsx#L27) & [MessagePage.tsx:L168-L172](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/messages/MessagePage.tsx#L168-L172)
   - **Issue:** `URL.createObjectURL` is called without cleaning up with `URL.revokeObjectURL` on image removal. In `MessagePage.tsx`, the cleanup in `useEffect([previewUrls])` revokes URLs prematurely when new attachments are added.

4. **All Swiper Banner Slides Marked with `priority` Preload** — `[RESOLVED]`
   - **File:** [BannerSlider.tsx:L65](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/(main)/_Components/BannerSlider.tsx#L65)
   - **Original Issue:** Every slide in the carousel had `priority={true}`, creating competing `<link rel="preload">` requests on initial page load instead of just preloading the first active slide.
   - **Resolution:** Updated the hero banner slide image to set `priority={idx === 0}` and `sizes="100vw"`, ensuring only the visible first slide is preloaded and subsequent slides load lazily.

---

## 5. Responsive Issues

1. **`max-h-screen` Causing Overflow Clipping on Auth Pages**
   - **Files:** [login/page.tsx:L74](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/auth/login/page.tsx#L74) & [register/page.tsx:L79](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/auth/register/page.tsx#L79)
   - **Issue:** Container has `<section className="min-h-screen max-h-screen flex">` without `overflow-y-auto`.
   - **Impact:** On laptop screens (< 800px vertical height), mobile devices in landscape, or when form error validation messages expand, bottom buttons (Submit, Social logins) get cut off and cannot be scrolled to.

2. **Breakpoint Mismatch Between Sidebar and Mobile Overlay**
   - **Files:** [DashboardSidebar.tsx:L52](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Shared/DashboardSidebar.tsx#L52) vs [DashboardLayoutClient.tsx:L60](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Shared/DashboardLayoutClient.tsx#L60)
   - **Issue:** The sidebar hides its mobile drawer state at `lg` (`lg:translate-x-0`), but the backdrop overlay in `DashboardLayoutClient` uses `2xl:hidden`.
   - **Impact:** On screen sizes between `1024px` (`lg`) and `1536px` (`2xl`), the overlay remains active or out of sync with the sidebar's responsive state.

3. **Invalid Tailwind Classes**
   - **File:** [dashboard/pro/orders/[id]/page.tsx:L313](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/dashboard/pro/orders/%5Bid%5D/page.tsx#L313)
   - **Issue:** Typo `className="min-w[220px] lg:min-w-[240px]..."` (missing hyphen in `min-w[220px]`).
   - **File:** [PaginationControl.tsx:L58](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/Common/PaginationControl.tsx#L58)
   - **Issue:** `text-gray/40` and `text-gray` are invalid color utilities in Tailwind CSS.

---

## 6. UI/UX Issues

1. **Catch-22: Filter Dropdown Disappears When Table is Empty** — `[RESOLVED]`
   - **File:** [AccountTable.tsx:L47-L66](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/Common/AccountTable.tsx#L47-L66)
   - **Original Issue:** Wrapped in `{data?.length > 0 && <select ... />}`. If a vendor had no orders in "Last 30 Days", the filter dropdown disappeared, preventing selection of "This Year" or "Custom Date Range".
   - **Resolution:** Removed the conditional wrapper so the filter dropdown is persistently visible, ensuring vendors can always change date ranges.

2. **CSV Export Only Exports Current Page (10 Orders)** — `[RESOLVED]`
   - **File:** [pro/orders/page.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/dashboard/pro/orders/page.tsx)
   - **Original Issue:** `csvData` was mapped only from `allOrders?.data` (`per_page: 10`).
   - **Resolution:** Implemented an asynchronous export mechanism using `useLazyGetVendorOrdersQuery` that requests all orders matching the current filter (iterating through all pagination pages in parallel if capped by backend) and triggers a direct, correctly formatted CSV Blob download with a loading spinner state.

3. **Hardcoded Fallback Year in Accounting** — `[RESOLVED]`
   - **Files:** [accounting/page.tsx:L27](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/dashboard/pro/accounting/page.tsx#L27), [pro/orders/page.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/dashboard/pro/orders/page.tsx), [AccountTable.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/Common/AccountTable.tsx)
   - **Original Issue:** `const [year, setYear] = useState(2024);` hardcoded 2024 instead of defaulting dynamically.
   - **Resolution:** Replaced with `useState(() => new Date().getFullYear())` and updated placeholders to reflect current year dynamically across accounting and orders pages.

4. **Non-functional Social Login Buttons**
   - **File:** [login/page.tsx:L212-L222](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/auth/login/page.tsx#L212-L222)
   - **Issue:** Google, Facebook, and Apple SVG buttons have no `onClick` handlers or `aria-label` attributes.

5. **Wrong Social Icon for Twitter**
   - **File:** [Footer.tsx:L110](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Shared/Footer.tsx#L110)
   - **Issue:** `{item?.social_media === "twitter" && <PinterestSvg />}` renders a Pinterest icon for Twitter links.

6. **Unstyled Raw String Suspense Fallbacks**
   - **File:** [app/(main)/page.tsx:L18-L38](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/(main)/page.tsx#L18-L38)
   - **Issue:** Multiple sections use `<Suspense fallback={"Loading...."}>`, displaying plain unformatted text on initial page render.

7. **Missing Redirect Persistence on Auth Walls**
   - **Files:** [Pricing.tsx:L221](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/(main)/_Components/Pricing.tsx#L221) & [useAddFavorite.tsx:L14](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Hooks/useAddFavorite.tsx#L14)
   - **Issue:** Redirects to `/auth/login` without appending the current URL as `?redirect=...`. Users lose their intended action after logging in.

---

## 7. Recommended Implementation Plan

1. **Security & Critical Fixes:**
   - Sanitize messages in [MessagePage.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/messages/MessagePage.tsx) with DOMPurify.
   - Enforce authentication guard in `middleware.ts`.
   - Prevent cross-conversation message injection in Pusher event listener.
2. **Navigation & Core UX Polish:**
   - Convert relative dashboard navbar links to absolute paths in [CombinedNavbar.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Shared/CombinedNavbar.tsx).
   - Fix filter dropdown persistence in [AccountTable.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/Common/AccountTable.tsx).
   - Prevent auth page overflow issues on small/laptop screens.
3. **Performance & Optimization:**
   - Remove unconditional `await cookies()` on public ISR routes in [serverFetch.ts](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/lib/serverFetch.ts).
   - Add WebSocket listener cleanup in [ConversationList.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/Components/messages/ConversationList.tsx).
   - Optimize Carousel slide preloading in [BannerSlider.tsx](file:///c:/Users/tofiq/OneDrive/Desktop/My%20Projects/melissabooth-123-next-js/src/app/(main)/_Components/BannerSlider.tsx).