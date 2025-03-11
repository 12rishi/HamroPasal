import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import React, { Suspense, useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const Login = React.lazy(() => import("./pages/Auth/Login"));
import HigherOrder from "./components/HOC/HigherOrder";
const Home = React.lazy(() => import("./pages/Home/Home"));

import Intro from "./pages/Intro/Intro";
import { Provider } from "react-redux";
import store from "./store/store";
const SinglePage = React.lazy(() => import("./pages/SinglePage/SinglePage"));
const Register = React.lazy(() => import("./pages/Auth/Register"));
const About = React.lazy(() => import("./pages/About/About"));
import Footer from "./components/Footer/Footer";
const Contact = React.lazy(() => import("./pages/Contact/Contact"));
import Map from "./components/Map/Map";
import Spinner from "./ui/Spinner/Spinner";
import Navbar from "./components/Navbar/Navbar";

const AddToCart = React.lazy(() => import("./pages/AddToCart/AddToCart"));
export const socket = io("http://localhost:3000", {
  auth: { token: `${localStorage.getItem("token")}` },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 8000,
});
function App() {
  const [animated, setAnimated] = useState(true);
  function animate() {
    setAnimated(false);
  }
  useEffect(() => {
    if (sessionStorage.getItem("isAnimated") == "true") {
      setAnimated(false);
    }
  }, []);

  return (
    <>
      {!animated ? (
        <Provider store={store}>
          <Suspense
            fallback={
              <>
                <Spinner />
              </>
            }
          >
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/map" element={<Map />} />
                <Route
                  path="/cart"
                  element={
                    <HigherOrder>
                      <AddToCart />
                    </HigherOrder>
                  }
                />

                <Route
                  path="/"
                  element={
                    <HigherOrder>
                      <Home />
                      <Footer />
                    </HigherOrder>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <HigherOrder>
                      <SinglePage />
                      <Footer />
                    </HigherOrder>
                  }
                />
              </Routes>
            </BrowserRouter>
          </Suspense>
        </Provider>
      ) : (
        <>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Intro setAnimation={animate} />} />
            </Routes>
          </BrowserRouter>
        </>
      )}
    </>
  );
}

export default App;
