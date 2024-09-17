import React, { useState } from "react";
import "./App.css";
import GameEngine from "./Engine";
import { supabase } from "./supabase";
import HighScores from "./Scores"; 

function App() {
  const [playerName, setPlayerName] = useState(""); // useState for player name
  const [startGame, setGameIsStarted] = useState(false); // useState for checking if game has started
  const [finalScore, setFinalScore] = useState(null); // Store the final score when game ends
  const [loading, setLoading] = useState(false);

  const handleStartGame = () => {
    if (playerName.trim()) {
      // Error handling for missing name input
      setGameIsStarted(true);
    } else {
      alert("Input your name before starting!");
    }
  };

  const saveScoreToSupabase = async (name, score) => {
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

  const handleGameEnd = async (score) => {
    setGameIsStarted(false);
    setFinalScore(score);

    if (playerName && score !== null) {
      await saveScoreToSupabase(playerName, score);
    }
  };

  return (
    <div>
      <h1>
        React<span>ato</span>
      </h1>
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
            <HighScores />
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <br />
            <button onClick={handleStartGame}>Start</button>
          </div>
        )
      ) : (
        <div>
          <h2>Hello, {playerName}!</h2>
          <GameEngine onGameEnd={handleGameEnd} />
        </div>
      )}
    </div>
  );
}

export default App;
