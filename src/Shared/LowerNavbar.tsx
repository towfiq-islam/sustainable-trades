"use client";
import { useRouter } from "next/navigation";
import Container from "@/Components/Common/Container";
import { SearchSvg } from "@/Components/Svg/SvgContainer";
import useAuth from "@/Hooks/useAuth";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

const LowerNavbar = () => {
  const { search, setSearch } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push("/product-location");
    }
  };

  return (
    <div className="bg-white py-3 drop-shadow">
      <Container>
        <div className="flex md:gap-5 justify-between items-center">
          <Link
            href="/"
            className={`text-base xl:text-lg text-primary-green font-semibold `}
          >
            Home
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex gap-2 items-center border border-off-green px-2 md:px-3 py-1.5 md:py-2 rounded-lg w-full lg:w-[450px] 2xl:w-[528px] transition-shadow duration-200"
          >
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by product....."
              aria-label="Search by product"
              className="w-full border-none outline-none"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="shrink-0 size-7 rounded-full grid place-items-center bg-primary-green text-accent-white text-sm font-medium hover:bg-transparent hover:text-primary-green border border-transparent hover:border-primary-green transition-all duration-200 cursor-pointer"
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default LowerNavbar;
