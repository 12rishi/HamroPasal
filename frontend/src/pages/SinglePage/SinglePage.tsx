import React, { ChangeEvent, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useAppdispatch, useAppSelector } from "../../store/hooks";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchSingleProduct } from "../../store/productSlice";
import { setCart } from "../../store/cartSlice";
import { CartData } from "../../types";

const SinglePage = () => {
  const { id } = useParams();
  const { cartItem } = useAppSelector((store) => store.cart);
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useAppdispatch();
  const [cartData, setCartData] = useState({
    id: null,
    quantity: null,
  });
  const { singleProduct } = useAppSelector((store) => store.product);
  const [imgIndex, setImgIndex] = useState<number>(0);

  const handleIncrement = (e: ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
    console.log(quantity);
  };
  const handleAddTocart = () => {
    if (id) {
      const data: CartData = { productId: id, quantity };
      dispatch(setCart(data));
      console.log(cartItem);
    }
  };
  useEffect(() => {
    dispatch(fetchSingleProduct(Number(id)));
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-4">
            {/* Product Images */}
            <div className="w-full md:w-1/2 px-4 mb-8">
              <img
                src={singleProduct?.productImages[imgIndex]}
                alt="Product"
                className="w-full h-[90vh] object-cover rounded-lg shadow-md mb-4"
                id="mainImage"
              />
              <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                {singleProduct &&
                  singleProduct.productImages.map((img, index) => (
                    <img
                      src={img}
                      onClick={() => setImgIndex(index)}
                      className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                    />
                  ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-3xl font-bold mb-2">
                {singleProduct?.productName}
              </h2>
              <p className="text-gray-600 mb-4">SKU: WH1000XM4</p>
              <div className="mb-4">
                <span className="text-2xl font-bold mr-2">
                  ${singleProduct?.productPrice}
                </span>
                <span className="text-gray-500 line-through">$399.99</span>
              </div>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">4.5 (120 reviews)</span>
              </div>
              <p className="text-gray-700 mb-6">
                {singleProduct?.productDescription}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Color:</h3>
                <div className="flex space-x-2">
                  {singleProduct?.availableColor.map((color, index) => (
                    <button
                      style={{ backgroundColor: color }}
                      className={` btn w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  onChange={handleIncrement}
                  value={quantity}
                  className="w-12 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  max="100"
                />
              </div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleAddTocart}
                  className="bg-teal-600 flex gap-2  items-center text-white px-6 py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Industry-leading noise cancellation</li>
                  <li>30-hour battery life</li>
                  <li>Touch sensor controls</li>
                  <li>Speak-to-chat technology</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePage;
