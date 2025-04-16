import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface MessageCardProps {
  img: string | StaticImageData;
  textColor: string;
  detail: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  img,
  textColor,
  detail,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rouned-3xl bg-black bg-opacity-50">
      <div className="bg-white w-[35%] mx-auto flex justify-center items-center flex-col rounded-2xl">
        <Image
          className="relative mt-6 mx-auto"
          src={img}
          alt="Adot Logo"
          width={100}
          height={100}
        />
        <div className="flex relative px-6 py-3 mx-auto">
          <p
            className={`my-4 ${textColor} w-full text-center text-lg leading-relaxed`}
          >
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
