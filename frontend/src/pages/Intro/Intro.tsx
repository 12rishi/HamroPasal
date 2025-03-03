import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Intro: React.FC<{ setAnimation: Function }> = ({ setAnimation }) => {
  const svgElement = useRef<SVGTextElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const completed = () => {
    sessionStorage.setItem("isAnimated", "true");
    setAnimation();
  };

  useGSAP(() => {
    if (svgElement.current) {
      gsap.fromTo(
        svgElement.current,
        {
          fill: "transparent",
          stroke: "#e7bc3dda",
          strokeWidth: 3,
          strokeOpacity: 0.5,
          strokeDashoffset: "25%",
          strokeDasharray: "0 32%",
          autoAlpha: 0.7,
        },
        {
          fill: "#e7bc3dda",
          stroke: "transparent",
          strokeWidth: 0,
          strokeDashoffset: "-25%",
          strokeDasharray: "32% 0",
          autoAlpha: 1,
          ease: "power1.in",
          duration: 9,
          strokeOpacity: 0.9,
          onComplete: completed,
        }
      );
    }
  }, []);

  useEffect(() => {
    const playMusic = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((err: Error) => {
          console.log("Autoplay failed due to browser restrictions:", err);
        });
      }
    };

    window.addEventListener("click", playMusic); // Trigger on click

    return () => {
      window.removeEventListener("click", playMusic);
    };
  }, []);

  return (
    <>
      <div className="w-full h-screen bg-[#111111] flex items-center justify-center">
        <svg width="100%" height="50vh" viewBox="0 0 500 100">
          <text
            x="50%"
            y="50%"
            fill="pink"
            stroke="blue"
            fontSize="40"
            textAnchor="middle"
            dominantBaseline="middle"
            ref={svgElement}
          >
            HAMROPASAL
          </text>
        </svg>
      </div>
      <audio ref={audioRef} autoPlay src="/music/bg.mp3" />
    </>
  );
};

export default Intro;
