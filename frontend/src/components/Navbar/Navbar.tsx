import { useEffect, useState } from "react";
import { fetchProduct, setProduct } from "../../store/productSlice";
import { useAppdispatch, useAppSelector } from "../../store/hooks";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppdispatch();
  const { pageNumber } = useAppSelector((store) => store.product);
  const { cartItem } = useAppSelector((store) => store.cart);
  useEffect(() => {
    dispatch(fetchProduct(pageNumber));
  }, []);

  return (
    <nav className="px-5  flex justify-between md:justify-around items-center relative top-0  shadow pb-4 bg-[#e7bc3dda] text-white w-full z-50">
      <img
        className="w-[10%] h-[10%] object-cover"
        src="/logo.png"
        alt="Logo"
        loading="lazy"
      />

      <button
        onClick={() => setOpen(!open)}
        className="md:hidden focus:outline-none text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      <div className="hidden md:flex space-x-6">
        <Link className="hover:text-[#1a1a1a] hover:underline " to="/">
          Home
        </Link>

        <Link className="hover:text-[#1a1a1a] hover:underline" to="/contact">
          Contact Us
        </Link>
        <Link className="hover:text-[#1a1a1a] hover:underline" to="/about">
          About us
        </Link>
      </div>

      <div className="hidden md:flex space-x-4">
        <Link
          className="rounded-xl p-3 bg-teal-500 hover:bg-white hover:text-teal-500"
          to="/cart"
        >
          Cart<sub>{cartItem.length}</sub>
        </Link>
        <Link
          className="rounded-xl p-3 border-2 border-white hover:bg-white hover:text-black"
          to="/myOrders"
        >
          My Orders
        </Link>
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full bg-gray-800 lg:hidden flex flex-col items-center py-5 space-y-4">
          <Link className="hover:text-teal-400 hover:underline" to="/">
            Home
          </Link>

          <Link className="hover:text-teal-400 hover:underline" to="/contact">
            Contact
          </Link>
          <Link className="hover:text-teal-400 hover:underline" to="/about">
            About us
          </Link>
          <Link
            className="rounded-xl p-3 bg-teal-500 hover:bg-white hover:text-teal-500"
            to="/cart"
          >
            Cart<sub>{cartItem.length}</sub>
          </Link>
          <Link
            className="rounded-xl p-3 border-2 border-white hover:bg-white hover:text-black"
            to="/myOrders"
          >
            My Orders
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
