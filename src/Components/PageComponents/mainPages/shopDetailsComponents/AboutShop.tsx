"use client";
import React, { useState } from "react";
import Image from "next/image";
import Container from "@/Components/Common/Container";
import { FBSvg, ISSvg } from "@/Components/Svg/SvgContainer";
import Link from "next/link";

interface AboutProps {
  data: {
    shop_name: string;
    social_links: {
      facebook_url: string;
      instagram_url: string;
      website_url: string;
    };
    about: {
      about_image: string;
      tagline: string;
      statement: string;
      our_story: string;
    };
  };
}

const AboutShop = ({ data }: AboutProps) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <section id="About" className="mt-4 md:mt-8 xl:mt-16">
      <Container>
        <h2 className="section_sub_title">About us</h2>

        <div className="flex flex-col lg:flex-row gap-5 xl:gap-10 lg:items-center">
          <div className="flex flex-col sm:flex-row gap-5 md:gap-10 grow">
            {/* Left - Shop Image */}
            <figure className="size-auto xs:size-[220px] md:size-[280px] lg:size-[350px] shrink-0 border border-gray-50 rounded-xl relative">
              <div className="absolute inset-0 bg-black/20 rounded-xl" />
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.about?.about_image}`}
                fill
                alt="about image"
                unoptimized
                className="size-full object-cover rounded-xl"
              />
            </figure>

            <div>
              <h3 className="mb-2.5 md:mb-5 text-secondary-black text-sm sm:text-base xl:text-lg 2xl:text-2xl font-semibold">
                {data?.shop_name}
              </h3>

              <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-secondary-black mb-2.5 md:mb-5">
                {data?.about?.tagline}
              </h4>

              <p className="text-secondary-gray sm:text-[15px] xl:text-base">
                {data?.about?.statement}
              </p>

              <h4 className="text-sm sm:text-base xl:text-lg font-semibold text-primary-green my-3 xl:my-5">
                Our Story
              </h4>

              <p className="text-secondary-gray sm:text-[15px] xl:text-base">
                {showMore
                  ? data?.about?.our_story
                  : data?.about?.our_story?.slice(0, 400)}

                {data?.about?.our_story?.length > 400 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-primary-green font-semibold cursor-pointer pl-2"
                  >
                    {showMore ? "read less" : "read more...."}
                  </button>
                )}
              </p>

              <div className="flex gap-5 items-center mt-5">
                {data?.social_links?.website_url && (
                  <Link
                    target="_blank"
                    href={data?.social_links?.website_url}
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold"
                  >
                    {data?.social_links?.website_url}
                  </Link>
                )}

                <div className="flex gap-3 items-center">
                  {data?.social_links?.facebook_url && (
                    <Link
                      target="_blank"
                      href={data?.social_links?.facebook_url}
                      className="size-9 rounded-full bg-primary-green grid place-items-center"
                    >
                      <FBSvg />
                    </Link>
                  )}

                  {data?.social_links?.instagram_url && (
                    <Link
                      target="_blank"
                      href={data?.social_links?.instagram_url}
                      className="size-9 rounded-full bg-primary-green grid place-items-center"
                    >
                      <ISSvg />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Meet the seller */}
          <div className="shrink-0">
            {/* <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-secondary-black mb-4 md:mb-7">
              Meet the Sellers
            </h4>

            <div className="flex gap-4 items-center">
              <Image
                src={author}
                alt="author"
                className="size-8 md:size-14 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
                  Jimmy
                </h3>
                <p className="text-secondary-gray">Organic Bath Soaps</p>
              </div>
            </div>

            <div className="flex gap-4 items-center mt-5">
              <Image
                src={author}
                alt="author"
                className="size-8 md:size-14 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
                  Jimmy
                </h3>
                <p className="text-secondary-gray text-xs sm:text-sm md:text-base">
                  Organic Bath Soaps
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-center mt-5">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                orgbathsoap.com
              </h3>
            </div> */}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutShop;
