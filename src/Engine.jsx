import React, { useState, useEffect, useRef } from "react";
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

function GameEngine({ playerName, onGameEnd }) {
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

  const [figures, setFigures] = useState([]); // useState to create array for images
  const [correctIndex, setCorrectIndex] = useState(null); // useState for correct clicks
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Game Timer useState
  const [displayInterval, setDisplayInterval] = useState(2000); // Click timer useState
  const [reactionTime, setReactionTime] = useState(2); // Reaction timer in seconds

  const intervalRef = useRef(null);
  const reactionTimerRef = useRef(null);
  const gameTimerRef = useRef(null);
  const scoreRef = useRef(score); 

  useEffect(() => {
    scoreRef.current = score; // Keeping track of score 
  }, [score]);

  
  const generateFigures = () => { // Filling array with images and shuffling 
    const figureSet = [];

    const correctFigure =
      correctFigures[Math.floor(Math.random() * correctFigures.length)];
    figureSet.push(correctFigure);
    while (figureSet.length < 16) {
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
    setReactionTime(2); // When a new set loads, reference previous state to ensure a consistent timer.
  };

  const resetReactionInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      generateFigures();
    }, displayInterval);
  };

  const resetReactionTimer = () => {
    if (reactionTimerRef.current) {
      clearInterval(reactionTimerRef.current);
    }

    reactionTimerRef.current = setInterval(() => {
      setReactionTime((prevTime) => Math.max(prevTime - 0.1, 0)); 
    }, 100); 
  };

  const handleFigureClick = (index) => {
    if (index === correctIndex) {
      // Calculate score based on reaction time
      const pointsAwarded = Math.floor((reactionTime / 2) * 100); // Points awarded at max 100, decreasing with scoreRef
      setScore((prevScore) => prevScore + pointsAwarded);

      setDisplayInterval((prevInterval) => Math.max(prevInterval - 50, 500)); // Decreasing reaction time based on correct clicks.
    } else {
      setScore((prevScore) => prevScore - 50); // Subtract points for incorrect clicks
      setDisplayInterval((prevInterval) => prevInterval + 100); // Increase reaction time for incorrect clicks
    }

    generateFigures(); 
    resetReactionInterval(); 
    resetReactionTimer(); // Restart reaction timer for new figure
  };

 
  useEffect(() => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current); 
    }

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(gameTimerRef.current);
          onGameEnd(scoreRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); 

    return () => clearInterval(gameTimerRef.current);
  }, [onGameEnd]); 

 
  useEffect(() => {
    generateFigures(); 
    resetReactionInterval(); 
    resetReactionTimer(); 

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (reactionTimerRef.current) {
        clearInterval(reactionTimerRef.current);
      }
    };
  }, [displayInterval]); 

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr 1fr",
    width: "35rem",
    height: "35rem",
    margin: "20px auto",
    border: "2px solid green",
    borderRadius: "1rem",
  };

  const boxStyle = {
    width: "100%",
    height: "100%",
    position: "relative", 
  };

  return (
    <div>
      <div className="score-timer-wrapper">
      <h2>Time Left: {timeLeft} seconds</h2>
      <h2>Score: {score}</h2>
      </div>
      <div style={gridContainerStyle}>
        {Array(16)
          .fill(0)
          .map((_, index) => (
            <div key={index} style={boxStyle}>
              {figures[index] && (
                <img
                  src={figures[index].src}
                  alt={figures[index].name}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    position: "absolute",
                    backgroundColor: "#242424",
                    top: 0,
                    left: 0,
                  }}
                  onClick={() => handleFigureClick(index)}
                />
              )}
            </div>
          ))}
      </div>
      <div className="bottom-text-wrapper">
      <h2>Good luck, whoever {playerName} is!</h2>
      </div>
    </div>
  );
}

export default GameEngine;