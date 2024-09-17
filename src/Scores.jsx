import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighScores = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("players")
          .select("name, score")
          .order("score", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching high scores:", error);
        } else {
          setHighScores(data || []);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighScores();
  }, []);

  return (
    <div>
      <h2>High Scores</h2>
      {loading ? (
        <p>Loading high scores...</p>
      ) : (
        <ol>
          {highScores.map((score, index) => (
            <li key={index}>
              {score.name}: {score.score} points
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default HighScores;
