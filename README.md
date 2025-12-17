# Project Name : Sustainable Trades

## 1. Description:

**Multi-Vendor E-Commerce Platform** is a fully dynamic, production-ready, and SEO-friendly marketplace built with Next.js v15, TypeScript, and a modern tech stack.

It’s designed for real-world e-commerce operations, supporting five user roles — Admin, Basic Vendor, Pro Vendor, Customer, and Guest — each with their own tailored dashboards and permissions.

The platform enables multiple vendors to manage their shops, products, trades, and subscriptions, while customers can explore nearby shops, chat in real time, follow stores, and purchase products seamlessly.

Developed using the latest Next.js features, TypeScript for type safety, and TanStack Query for optimized data fetching, this application ensures performance, maintainability, and scalability across all devices.

---

## 2. Used Technologies:

- Next.js v15 – Leveraging SSR, CSR, SSG, and ISR for optimized performance and SEO.
- TypeScript – For robust, type-safe, and maintainable code.
- Tailwind CSS v4 – To craft a modern, responsive, and clean UI.
- TanStack Query – For powerful, cache-optimized API data fetching.
- Pusher.js + Laravel Echo – For real-time chat and notification features.
- Axios – For API communication.
- React Hook Form – For form handling and validation.
- Moment.js – For date and time formatting.
- Google Maps API – For location tracking and nearby shop discovery.

---

## 3. Main Features:

#### Multi-Role System:
- Admin, Basic Vendor, Pro Vendor, Customer, and Guest – each with their own dashboard and permissions.
- Dynamic Role Management – Role-specific functionalities and UI are rendered conditionally.

#### Vendor & Product Management:
- Vendors can add products, which are published only after admin approval.
- Vendors can upgrade subscriptions between Basic and Pro plans.
- Vendors can edit profiles, manage listings, discounts, and trades.

#### Real-Time Chat:
- Real-time user-to-vendor messaging system powered by Pusher.js and Laravel Echo.
- Instant updates, typing indicators, and unread message notifications.

#### Smart Location System:
- Integrated Google Map API for finding shops.
- The platform captures user’s latitude and longitude and displays nearby shops.
- Interactive split view: left side shop list, right side live map view.
- On hover, the shop’s name and photo appear live on the map.

#### Customer Features:
- Browse and filter products by category, subcategory, price, or popularity.
- Add to Cart, Add to Favorites, and Follow/Unfollow Shops.
- Write product reviews and view average ratings.
- Real-time chat with vendors.
- View shop locations and details.

#### Dashboard Functionalities:

##### Customer Features:
- Orders, Favorites, Cart, Messages, Reviews, Settings

##### Basic Vendor Dashboard::
- Listings, Trades, Memberships, Favorites, Membership Spotlights, Notifications, Messages, Settings

##### Pro Vendor Dashboard:
- Orders, Trades, Listings, Payments, Accounting, Discounts, Shipping, Favorites, Membership Spotlights, Notifications, Messages, Settings

##### Admin Dashboard:
- Manage users, shops, products, reviews, CMS content, and platform settings

#### Performance & Design:
- Modern, beautiful, and lightweight UI.
- Fully responsive on all screen sizes (mobile, tablet, and desktop).
- SEO optimized for better visibility.
- Production ready and scalable architecture.

---

## 4. Dependencies:

```json
"dependencies": {
  "@react-google-maps/api": "^2.20.7",
  "@tanstack/react-query": "^5.80.2",
  "aos": "^2.3.4",
  "axios": "^1.9.0",
  "clsx": "^2.1.1",
  "laravel-echo": "^2.2.4",
  "lottie-react": "^2.4.1",
  "lucide-react": "^0.544.0",
  "moment": "^2.30.1",
  "next": "^15.4.6",
  "postcss": "^8.5.4",
  "pusher-js": "^8.4.0",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-hook-form": "^7.62.0",
  "react-hot-toast": "^2.5.2",
  "react-icons": "^5.5.0",
  "react-scroll-to-top": "^3.1.0",
  "react-spinners": "^0.17.0",
  "swiper": "^11.2.10",
  "tailwind-merge": "^3.3.1"
}
```

---

## 5. devDependencies:

```json
"devDependencies": {
  "@tailwindcss/postcss": "^4.1.8",
  "@types/aos": "^3.0.7",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@types/react-redux": "^7.1.34",
  "@types/redux-persist": "^4.0.0",
  "autoprefixer": "^10.4.21",
  "tailwindcss": "^4.1.8",
  "typescript": "^5"
}
```

---

## 6. Installation:

```bash
# Clone the repository
git clone https://github.com/towfiqislambd/sustainable-trades

# Navigate into the project
cd sustainable-trades

# Add an env.local file in root
.env.local = Add secret credentials

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 7. Usage:

Run `npm run dev` to start the project locally. The app will run on
**http://localhost:3000**

---
