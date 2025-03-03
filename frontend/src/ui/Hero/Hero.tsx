import React from "react";

const Hero = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row mt-2 gap-2 w-full justify-center">
        <div className="flex w-[20%]  ">
          <input
            type="text"
            placeholder="Search for the Product"
            className="w-full md:w-80 px-3 h-10 rounded-l border-2 border-teal-500 focus:outline-none focus:borderteal-500"
          />
          <button className="bg-teal-500 text-white rounded-r px-2 md:px-3 py-0 md:py-1">
            Search
          </button>
        </div>
        <select
          id="pricingType"
          name="pricingType"
          className="w-[10%]   h-10 border-2 border-teal-500 focus:outline-none focus:border-teal-500 text-teal-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
        >
          <option value="All" selected>
            All
          </option>
          <option value="Freemium">Product</option>
          <option value="Free">Discount</option>
          <option value="Paid">Price</option>
        </select>
      </div>
    </>
  );
};

export default Hero;
