import React, { useState, useEffect } from "react";
import BE from "/src/assets/BE.png";
import CS from "/src/assets/CS.png";
import DM from "/src/assets/DM.png";
import FE from "/src/assets/FE.png";
import FU from "/src/assets/FU.png";
import PL from "/src/assets/PL.png";
import SA from "/src/assets/SA.png";
import SL from "/src/assets/SL.png";
import WD from "/src/assets/WD.png";

import BAD1 from "/src/assets/BAD1.png";
import BAD2 from "/src/assets/BAD2.png";
import BAD3 from "/src/assets/BAD3.png";
import BAD4 from "/src/assets/BAD4.png";
import BAD5 from "/src/assets/BAD5.png";

const getRandomPosition = (containerSize, imageSize) => {
  const maxPosition = containerSize - imageSize;
  const randomX = Math.floor(Math.random() * maxPosition);
  const randomY = Math.floor(Math.random() * maxPosition);
  return { top: randomY, left: randomX };
};

function GameEngine({ onGameEnd }) {
  const correctFigures = [
    { name: "BE", src: BE },
    { name: "CS", src: CS },
    { name: "DM", src: DM },
    { name: "FE", src: FE },
    { name: "FU", src: FU },
    { name: "PL", src: PL },
    { name: "SA", src: SA },
    { name: "SL", src: SL },
    { name: "WD", src: WD },
  ];

  const wrongFigures = [
    { name: "BAD1", src: BAD1 },
    { name: "BAD2", src: BAD2 },
    { name: "BAD3", src: BAD3 },
    { name: "BAD4", src: BAD4 },
    { name: "BAD5", src: BAD5 },
  ];

  const [figures, setFigures] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [displayInterval, setDisplayInterval] = useState(2000);

  const generateFigures = () => {
    const figureSet = [];

    const correctFigure =
      correctFigures[Math.floor(Math.random() * correctFigures.length)];
    figureSet.push(correctFigure);

    while (figureSet.length < 4) {
      const wrongFigure =
        wrongFigures[Math.floor(Math.random() * wrongFigures.length)];
      figureSet.push(wrongFigure);
    }

    const shuffledFigures = figureSet.sort(() => Math.random() - 0.5);

    const index = shuffledFigures.findIndex(
      (figure) => figure === correctFigure
    );

    setCorrectIndex(index);
    setFigures(shuffledFigures);
  };

  const handleFigureClick = (index) => {
    if (index === correctIndex) {
      setScore(score + 100);
      setDisplayInterval((prevInterval) => Math.max(prevInterval - 50, 2000));
    } else {
      setScore(score - 50);
      setDisplayInterval((prevInterval) => prevInterval + 100);
    }

    generateFigures();
  };

  useEffect(() => {
    generateFigures();

    const interval = setInterval(() => {
      generateFigures();
    }, displayInterval);

    return () => clearInterval(interval);
  }, [displayInterval]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      onGameEnd(score);
    }
  }, [timeLeft, score, onGameEnd]);

  const containerSize = 800;
  const imageSize = 200;
  return (
    <div>
      <h2>Time Left: {timeLeft} seconds</h2>
      <h2>Score: {score}</h2>
      <h2>Click the correct figure!</h2>
      <div
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          position: "relative",
          border: "2px solid black",
          margin: "20px auto",
        }}
      >
        {figures.map((figure, index) => {
          const { top, left } = getRandomPosition(containerSize, imageSize);

          return (
            <div
              key={index}
              style={{
                width: `${imageSize}px`,
                height: `${imageSize}px`,
                position: "absolute",
                top: `${top}px`,
                left: `${left}px`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={figure.src}
                alt={figure.name}
                style={{
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => handleFigureClick(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameEngine;
