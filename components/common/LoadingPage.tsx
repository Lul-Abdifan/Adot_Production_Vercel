import React from "react";
import Image from 'next/image'
import logo from '../../public/common/logo.png'

function LoadingPage() {
  return (
    <div className="flex z-100 items-center justify-between h-full w-full bg-gray-200 rounded-lg">
      <Image
            className="relative mx-auto opacity-100 mylogo"
            src={logo}
            alt="Adot Logo"
            width={100}
            height={100}
            priority
        />
    </div>
  );
}

export default LoadingPage;
