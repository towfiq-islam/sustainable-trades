"use client";
import type React from "react";
import Image from "next/image";
import { useState } from "react";
import DetailsImage from "../../../Assets/e1.jpg";
import { FaPaperPlane, FaMicrophone, FaPlus } from "react-icons/fa";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

const TradeDetailsBottom = () => {
  const [message, setMessage] = useState("");
  const [visibleTrades, setVisibleTrades] = useState(5);

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

  const trades = [
    {
      title: "8oz Watermelon Sustainable Soap",
      company: "The Soap Shop",
      qty: "20 Bars",
      date: "11/28/23",
      status: "Pending",
      image: DetailsImage,
    },
    {
      title: "Citrus Island Hand Soap",
      company: "Holistic",
      qty: "10 Jars",
      date: "11/28/23",
      status: "Sent",
      image: DetailsImage,
    },
    {
      title: "Organic Herbal Bath",
      company: "BodyTech",
      qty: "4 Baskets",
      date: "11/28/23",
      status: "Pending",
      image: DetailsImage,
    },
    {
      title: "Organic Musk Bath",
      company: "BodyTech",
      qty: "4 Baskets",
      date: "11/28/23",
      status: "Pending",
      image: DetailsImage,
    },
    {
      title: "Organic Honey Bar Soap",
      company: "BodyTech",
      qty: "4 Baskets",
      date: "11/28/23",
      status: "Pending",
      image: DetailsImage,
    },
  ];

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

  const handleSeeMore = () => {
    setVisibleTrades(prev => Math.min(prev + 5, trades.length));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-accent-red text-[#fff]";
      case "Sent":
        return "bg-primary-green text-[#fff]";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="flex gap-x-10 max-w-full">
      {/* Chat Section */}
      <div className="w-1/2 border border-[#BFBEBE]  rounded-lg shadow-sm flex flex-col bg-white">
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
                    : "bg-gray-50 text-gray-800"
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

      {/* Trade List Section */}
      <div className="w-1/2">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[16px] text-accent-gray">
            Showing {visibleTrades} of {trades.length}
          </p>
          {visibleTrades < trades.length && (
            <button
              onClick={handleSeeMore}
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              See More
            </button>
          )}
        </div>

        <div className="space-y-4">
          {trades.slice(0, visibleTrades).map((trade, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start border-b border-[#BFBEBE] pb-4 hover:bg-gray-50 p-2 
             transition-colors"
            >
              <div className="flex items-start gap-3">
                <Image
                  src={trade.image}
                  alt={trade.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h5 className="text-[#000] font-semibold underline mb-1 text-[16px]">
                    {trade.title}
                  </h5>
                  <p className="text-[14px] font-normal text-secondary-black">
                    {trade.company}
                  </p>
                  <p className="text-[14px] font-normal text-secondary-black">
                    Qty: {trade.qty}
                  </p>
                  <p className="text-[14px] font-normal text-[#828282]">
                    # 379
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 min-w-[80px]">
                <span
                  className={`px-3 py-1 rounded-full text-lg font-medium w-full text-center ${getStatusColor(
                    trade.status,
                  )}`}
                >
                  {trade.status}
                </span>
                <p className="text-[14px] font-normal text-secondary-gray">
                  Offer Date:
                </p>
                <p className="text-[14px] font-normal text-secondary-gray">
                  {trade.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeDetailsBottom;
