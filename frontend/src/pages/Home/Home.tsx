import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Background from "../../ui/BackgroundVideo/Background";
import Hero from "../../ui/Hero/Hero";
import Cards from "../../components/Card/Card";

const Home = () => {
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
