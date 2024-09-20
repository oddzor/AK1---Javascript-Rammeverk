import React, { useState } from "react";
import "./App.css";
import GameEngine from "./Engine";
import { supabase } from "./supabase";
import HighScores from "./Scores"; 
import Frontend from "./assets/FE.png"

function App() {
  const [playerName, setPlayerName] = useState(""); // useState for player name
  const [startGame, setGameIsStarted] = useState(false); // useState for checking if game has started
  const [finalScore, setFinalScore] = useState(null); // useState to store the final score when game ends
  const [loading, setLoading] = useState(false); 
  const [showHighScores, setShowHighScores] = useState(false); // Toggle high score visibility

  const handleStartGame = () => {
    if (playerName.trim()) {
      // Error handling for missing name input
      setGameIsStarted(true);
    } else {
      alert("Input your name before starting!");
    }
  };

  const saveScoreToSupabase = async (name, score) => { // Inserting scores and error handling for Supabase
    setLoading(true);
    try {
      const { error } = await supabase
        .from("players")
        .insert([{ name, score }]);

      if (error) {
        console.error("Error saving score:", error);
        alert("There was an error saving your score.");
      } else {
        console.log("Score saved successfully");
      }
    } catch (error) {
      console.error("Error during Supabase request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameEnd = async (score) => {  // Game end triggered by 60 second timer, score saving.
    setGameIsStarted(false);
    setFinalScore(score);

    if (playerName && score !== null) {
      await saveScoreToSupabase(playerName, score);
    }
  };

  return (  // Ternary operators depending on state, will display relevant elements and buttons
    <div className="main-wrapper"> 
      <div className="header-wrapper">
      <h1>
        React<span>ato</span>
      </h1> <img src={Frontend} style={{ width: "10rem", height: "10rem" }} alt="Frontend" />
      </div>
      {!startGame ? (
        finalScore !== null ? (
          <div>
            <h2>
              Game Over! {playerName}, your final score is: {finalScore}
            </h2>
            {loading ? (
              <p>Saving your score...</p>
            ) : (
              <button onClick={() => setFinalScore(null)}>Retry</button>
            )}
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={{
                width: "100%",
                height: "2rem",
                marginBottom: "1rem",
                borderRadius: "0.25rem",
                textAlign: "center"
                            }}
            />
            <br />
            <div className="button-wrapper">
            {!showHighScores && (
              <button onClick={handleStartGame}>Start</button>
            )}
            <button onClick={() => setShowHighScores(!showHighScores)}>
              {showHighScores ? "Hide Highscores" : "Show Highscores"}
            </button>
            </div>
          </div>
        )
      ) : (
        <GameEngine playerName={playerName} onGameEnd={handleGameEnd} />
      )}

      {showHighScores && <HighScores />}
    </div>
  );
}

export default App;