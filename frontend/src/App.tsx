import { BrowserRouter, Route, Router, Routes } from "react-router-dom";

import "./App.css";

import Login from "./pages/Auth/Login";
import HigherOrder from "./components/HOC/HigherOrder";
import Home from "./pages/Home/Home";
import { useEffect, useState } from "react";
import Intro from "./pages/Intro/Intro";
import { Provider } from "react-redux";
import store from "./store/store";
import SinglePage from "./pages/SinglePage/SinglePage";

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
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/"
                element={
                  <HigherOrder>
                    <Home />
                  </HigherOrder>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <HigherOrder>
                    <SinglePage />
                  </HigherOrder>
                }
              />
            </Routes>
          </BrowserRouter>
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
