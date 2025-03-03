import { useAppSelector } from "../../store/hooks";

import { Link } from "react-router-dom";

const Cards = () => {
  const { products } = useAppSelector((store) => store.product);

  return (
    <div className="p-1 flex flex-wrap items-center justify-center">
      {products &&
        products.map((product, index) => (
          <Link
            to={`product/${product.productId}`}
            key={index}
            className={`flex-shrink-0 m-6 relative overflow-hidden bg-orange-500 rounded-lg max-w-xs shadow-lg group`}
          >
            <svg
              className="absolute bottom-0 left-0 mb-8 scale-150 group-hover:scale-[1.65] transition-transform"
              viewBox="0 0 375 283"
              fill="none"
              style={{ opacity: 0.1 }}
            >
              <rect
                x="159.52"
                y="175"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 159.52 175)"
                fill="white"
              />
              <rect
                y="107.48"
                width="152"
                height="152"
                rx="8"
                transform="rotate(-45 0 107.48)"
                fill="white"
              />
            </svg>
            <div className="relative pt-10 px-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div
                className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                style={{
                  background: "radial-gradient(black, transparent 60%)",
                  transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
                  opacity: 0.2,
                }}
              ></div>
              <img
                className="relative w-40 h-40 object-cover"
                src={product.productImages[0]}
                alt={product.productName}
              />
            </div>
            <div className="relative text-white px-6 pb-6 mt-6">
              <span className="block opacity-75 -mb-1">{product.category}</span>
              <div className="flex justify-between">
                <span className="block font-semibold text-xl">
                  {product.productName}
                </span>
                <span
                  className={`block ml-4 bg-white rounded-full text-teal-500  text-xs font-bold px-3 py-2 leading-none flex items-center`}
                >
                  {product.productPrice}
                </span>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default Cards;
