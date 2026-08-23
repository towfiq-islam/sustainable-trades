import Link from "next/link";
import { BigMessageSvg } from "../Svg/SvgContainer";
interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal = ({ onClose }: SuccessModalProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-5 p-4">
      <p className="size-18 rounded-full grid place-items-center bg-accent-blue">
        <BigMessageSvg />
      </p>

      <p className="text-xl text-primary-green font-medium">
        Your message has been sent.
      </p>
      <p className="text-gray-500 max-w-[450px] mx-auto">
        Check your Messages to view the thread between you and the seller!
      </p>

      <Link href="/shop" onClick={() => onClose()} className="primary_btn">
        Discover More Products
      </Link>
    </div>
  );
};

export default SuccessModal;
