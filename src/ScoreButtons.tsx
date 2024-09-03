import React, { useEffect, useState } from "react";

interface ScoreButtonsProps {
  onSelect: (score: number) => void;
  reset: boolean;
}

const ScoreButtons: React.FC<ScoreButtonsProps> = ({ onSelect, reset }) => {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const handleButtonClick = (score: number) => {
    setSelectedScore(score);
    onSelect(score);
  };

  useEffect(() => {
    if (reset) {
      setSelectedScore(null);
    }
  }, [reset]);

  return (
    <div>
      {Array.from({ length: 13 }, (_, i) => i).map((score) => (
        <button
          key={score}
          onClick={() => handleButtonClick(score)}
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: selectedScore === score ? "lightblue" : "white",
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          {score}
        </button>
      ))}
    </div>
  );
};

export default ScoreButtons;
