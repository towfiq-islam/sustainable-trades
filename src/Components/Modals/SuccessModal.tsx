import Link from "next/link";
import { BigMessageSvg } from "../Svg/SvgContainer";

const SuccessModal = () => {
  return (
    <div className="flex flex-col items-center text-center gap-6 p-5">
      <h3 className="text-4xl font-semibold text-primary-green">Success!</h3>
      <p className="size-22 rounded-full grid place-items-center bg-[#B0DEDB]">
        <BigMessageSvg />
      </p>

      <p className="text-2xl text-primary-green">Your message has been sent.</p>
      <p className="text-xl text-primary-green font-semibold max-w-[450px] mx-auto">
        Check your Messages to view the thread between you and the seller!
      </p>

      <p className="text-primary-green">You make the world more sustainable.</p>

      <Link href="/shop" className="primary_btn">
        Discover More Products
      </Link>
    </div>
  );
};

export default SuccessModal;
