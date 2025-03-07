import React from "react";

const Spinner = () => {
  return (
    <div className="relative flex justify-center items-center w-screen h-screen bg-teal-100">
      <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-teal-600" />
      <img
        src="https://images.all-free-download.com/images/graphicwebp/ecommerce_background_shop_smartphone_card_bags_icons_6837952.webp"
        className="rounded-full h-28 w-28"
      />
    </div>
  );
};

export default Spinner;
