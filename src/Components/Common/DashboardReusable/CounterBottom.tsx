import Image from "next/image";
import React, { useState } from "react";
import DetailsImage from "../../../Assets/e1.jpg";
import { LocationSvg1, Reload } from "@/Components/Svg/SvgContainer";
import {
  FaAngleDown,
  FaMicrophone,
  FaPaperPlane,
  FaPlus,
  FaRegStar,
} from "react-icons/fa";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

const CounterBottom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! I was interested in getting some of your soap!",
      timestamp: "11:36 AM",
      isOwn: false,
    },
    {
      id: 2,
      text: "Yes of course. I would be interested in trading if you have something you'd like to trade?",
      timestamp: "12:26 PM",
      isOwn: true,
    },
    {
      id: 3,
      text: "I currently can only offer services, would you be interested in some yard clean up?",
      timestamp: "3:18 PM",
      isOwn: false,
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-10 border-b border-[#BFBEBE] md:pb-8 ">
      <div className="w-full lg:w-1/2 border border-[#BFBEBE]  rounded-lg shadow-sm flex flex-col bg-white mt-10">
        {/* Header */}
        <div className="bg-[#D4E2CB] px-4 py-3 border-b border-[#BFBEBE] flex items-center gap-3 rounded-t-lg">
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="Linda Anderson"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-primary-green">Chat With</h4>
            <p className="text-sm text-gray-600">Linda Anderson</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[400px] max-h-[500px]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-sm ${
                  msg.isOwn
                    ? "bg-[#D4E2CB] text-gray-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
                <span className="block text-xs text-gray-500 mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-[#BFBEBE] px-3 py-3 flex items-center gap-2 mt-20">
          <button className="text-gray-400 hover:text-gray-600 p-2">
            <FaPlus size={16} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full border border-[#BFBEBE] rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FaMicrophone size={14} />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            className="bg-primary-green text-white p-2 rounded-md hover:bg-[#1e3a32] transition-colors"
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 ">
        <div className="flex gap-x-2.5 md:gap-x-5 items-center">
          <h3 className="text-[16px] text-primary-green font-semibold">
            Trade Details
          </h3>
          <h4 className="text-[16px] text-accent-gray font-semibold">
            11/28/2023
          </h4>
          <h5 className="text-[16px] text-accent-gray font-semibold">
            Inquiry <span># 378</span>
          </h5>
        </div>
        <div className=" my-10">
          <div className="flex flex-col sm:flex-row gap-5 2xl:gap-x-20 items-center">
            <Image
              src={DetailsImage}
              alt="DetailsImage"
              height={100}
              width={100}
              className="h-[100px] w-[100px] rounded-lg"
            />
            <div className="flex flex-col gap-y-1">
              <h3 className="text-[18px] lg:text-[20px] font-semibold text-secondary-black">
                8oz Watermelon Sustainable Bar Soap
              </h3>
              <h4 className="text-[18px] lg:text-[20px] font-normal text-secondary-gray flex gap-x-5 items-center">
                The Soap Shop
                <span className="text-[12px] lg:text-[14px] underline cursor-pointer text-accent-gray font-lato">
                  View Shop
                </span>
              </h4>
              <div className="flex gap-x-[2px]">
                <FaRegStar className="fill-green-950" />
                <FaRegStar className="fill-green-950" />
                <FaRegStar className="fill-green-950" />
                <FaRegStar className="fill-green-950" />
                <FaRegStar className="fill-green-950" />
              </div>
              <div className="flex gap-x-2 items-center">
                <LocationSvg1 />
                <h5 className="text-[14px] underline cursor-pointer text-accent-gray font-lato">
                  13 mi. away -
                </h5>
                <h5 className="text-[14px] underline cursor-pointer text-accent-gray font-lato">
                  Denver, CO
                </h5>
              </div>
              <ul className="flex flex-col gap-y-2">
                <li className="flex gap-x-2 te4xt-[16px] font-normal text-secondary-gray items-center">
                  Qty: <span className="font-bold">3 Bars </span>
                </li>
                <li className="flex gap-x-2 te4xt-[16px] font-normal text-secondary-gray items-center">
                  Item Price: <span className="font-bold">$10</span>
                </li>
                <li className="flex gap-x-2 te4xt-[16px] font-normal text-secondary-gray items-center">
                  Total amount: <span className="font-bold">$30 </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-x-5 items-center mt-5">
            <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
            <div className="inline-block">
              <Reload
                className={`cursor-pointer transform transition-transform hover:rotate-180 duration-500 ease-in-out`}
              />
            </div>
            <div className="bg-[#BFBEBE] w-full h-[1px]"></div>
          </div>
          <div className="">
            <h4 className="text-[18px] lg:text-[20px] font-semibold text-primary-green">
              Organic Bath Soaps
            </h4>
            <h3 className="text-[22px] lg:text-[32px] font-semibold text-secondary-black py-3">
              Coconut Bar Soap
            </h3>
            <ul>
              <li className="text-[18px] lg:text-[20px] font-semibold text-primary-green">
                Product Description
              </li>
              <li className="text-[14px] lg:text-[16px] font-semibold text-secondary-black list-disc ml-5">
                Made with 100% organic coconut oil, ensuring a natural and
                chemical-free cleansing experience.
              </li>
              <li className="text-[14px] lg:text-[16px] font-semibold text-secondary-black list-disc ml-5">
                Free from synthetic additives, parabens, and harsh chemicals for
                a gentle and nourishing bath.
              </li>
            </ul>
            <div className="flex gap-x-2 mt-4 items-center">
              <h4 className="text-[14px] font-bold text-secondary-black underline">
                Organic Bath Soaps
              </h4>
              <div className="flex gap-x-[2px]">
                <FaRegStar className="fill-green-950" />
                <FaRegStar className="fill-green-950" />
                <FaRegStar className="fill-green-950" />
                <FaRegStar className="fill-green-950" />
                <FaRegStar className="fill-green-950" />
              </div>
            </div>
            <div className="flex gap-x-2 items-center mt-1">
              <LocationSvg1 />
              <h5 className="text-[14px] underline cursor-pointer text-secondary-black font-lato">
                13 mi. away -
              </h5>
              <h5 className="text-[14px] underline cursor-pointer text-secondary-black font-lato">
                Denver, CO
              </h5>
            </div>
            <div className="border-b border-[#BFBEBE]">
              {/* Header */}
              <div
                className="flex justify-between py-4 cursor-pointer items-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                <h5 className="text-[20px] font-normal text-primary-green">
                  Shop FAQ
                </h5>
                <FaAngleDown
                  className={`transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {/* Content with smooth transition */}
              <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                  isOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="pb-4 text-gray-600">
                  You can shop from our store anytime. Orders are usually
                  processed within 24 hours. Shipping times vary based on your
                  location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterBottom;
