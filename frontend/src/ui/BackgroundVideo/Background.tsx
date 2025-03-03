import React from "react";
import Navbar from "../../components/Navbar/Navbar";

const Background = () => {
  return (
    <section className="relative h-[50vh]  flex flex-col items-center justify-center text-center text-white ">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <video
          className="min-w-full min-h-full absolute object-cover top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            background: `linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%)`,
          }}
          src="/video/shop.mp4"
          typeof="video/mp4"
          autoPlay
          muted
          loop
        />
      </div>
      <div className="space-y-2 z-10">
        <h1 className="font-bold text-6xl">HamroPasal</h1>
        <h3 className="font-light text-3xl">
          "Get More,👜👜 Spend Less! 💵💵"
        </h3>
      </div>
    </section>
  );
};

export default Background;
