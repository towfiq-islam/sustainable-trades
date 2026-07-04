import Container from "@/Components/Common/Container";
import logo from "@/Assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import {
  FacebookSvg,
  InstagramSvg,
  LinkedinSvg,
  PinterestSvg,
} from "@/Components/Svg/SvgContainer";
import { getSiteSettings, getSocialLinks } from "@/Hooks/cms.api";

const helpUsLinks = [
  { id: 1, label: "How-To Tutorials", path: "/help/how-to-tutorials" },
  { id: 2, label: "FAQs", path: "/help/faqs" },
  { id: 3, label: "Contacts", path: "/help/contact" },
];

const Footer = async ({ dynamicPage }: any) => {
  const footer_title_class =
    "text-xl font-bold text-accent-white leading-[ 140%] tracking-[0.2px] mb-3";
  const socialLinks = await getSocialLinks();
  const siteSettings = await getSiteSettings();

  return (
    <footer className="bg-primary-green pt-10 pb-5">
      {/* Upper Part */}
      <Container>
        <div className="flex flex-wrap justify-between">
          {/* Left - Logo */}
          <div className="mb-7 md:mb-0">
            <figure className="size-24 md:size-40">
              <Image
                src={logo}
                unoptimized
                alt="logo"
                className="w-full h-full object-cover "
              />
            </figure>
          </div>

          {/* Right */}
          <div className="flex flex-wrap gap-5 xl:gap-24">
            {/* About */}
            <div>
              <h3 className={footer_title_class}>About</h3>
              <ul className="flex flex-col gap-3">
                {dynamicPage?.map((item: any) => (
                  <Link
                    key={item?.id}
                    href={`/about/${item?.page_slug}`}
                    className="text-accent-white text-sm md:text-base tracking-[0.16px]"
                  >
                    {item?.page_title}
                  </Link>
                ))}
              </ul>
            </div>

            {/* Follow Us */}
            <div className="block md:hidden">
              <h3 className={footer_title_class}>Follow Us</h3>
              <ul className="flex flex-col gap-3">
                {socialLinks?.data?.map((item: any) => (
                  <Link
                    key={item?.id}
                    href={item?.profile_link}
                    className="text-accent-white text-sm md:text-base tracking-[0.16px] flex gap-2 items-center"
                  >
                    {/* <span>{item?.logo}</span> */}
                    <span>{item?.social_media}</span>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className={footer_title_class}>Help</h3>
              <ul className="flex flex-col gap-3">
                {helpUsLinks?.map(item => (
                  <Link
                    key={item?.id}
                    href={item?.path}
                    className="text-accent-white text-sm md:text-base tracking-[0.16px]"
                  >
                    {item?.label}
                  </Link>
                ))}
              </ul>
            </div>

            {/* Follow Us */}
            <div className="hidden md:block">
              <h3 className={footer_title_class}>Follow Us</h3>
              <ul className="flex flex-col gap-3">
                {socialLinks?.data?.map((item: any) => (
                  <Link
                    key={item?.id}
                    href={item?.profile_link}
                    className="text-accent-white text-sm md:text-base tracking-[0.16px] flex gap-2 items-center"
                  >
                    {item?.social_media === "facebook" && <FacebookSvg />}
                    {item?.social_media === "instagram" && <InstagramSvg />}
                    {item?.social_media === "twitter" && <PinterestSvg />}
                    {item?.social_media === "linkedin" && <LinkedinSvg />}
                    <span>{item?.social_media}</span>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      <hr className="text-accent-white my-5" />

      {/* Lower Part */}
      <Container>
        <div className="flex flex-col md:flex-row w-full md:items-center justify-between text-accent-white tracking-[0.16px] mb-5">
          {/* Left - Copyright */}
          <p className="md:text-base text-xs text-center md:text-left mb-7 md:mb-0">
            {siteSettings?.data?.copyright_text}
          </p>

          {/* Right */}
          <div className="flex flex-col md:flex-row gap-2.5 sm:gap-4 md:gap-10 md:items-center md:text-base text-sm">
            {/* <Link href="/">Acceptable Use Policy</Link>
            <Link href="/">Privacy Policy</Link> */}
            <Link href="/help/terms-and-conditions">Terms and Conditions</Link>
          </div>
        </div>

        {/* <div className="flex gap-2 items-center justify-center md:justify-start">
          <GlobeSvg />
          <p className="text-accent-white tracking-[0.16px] cursor-pointer md:text-base text-sm">
            English (United States)
          </p>
        </div> */}
      </Container>
    </footer>
  );
};

export default Footer;
