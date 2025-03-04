import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Background from "../../ui/BackgroundVideo/Background";
import Hero from "../../ui/Hero/Hero";
import Cards from "../../components/Card/Card";

const Home = () => {
  function getCookie(name: string) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return value;
      }
    }
    return null;
  }

  const token = getCookie("token");
  console.log(token);

  return (
    <>
      <Navbar />
      <Background />
      <Hero />
      <Cards />
    </>
  );
};

export default Home;
