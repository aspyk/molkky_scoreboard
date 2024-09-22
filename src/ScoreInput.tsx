import React, { useState, useEffect, useCallback } from "react";
import ScoreButtons from "./ScoreButtons";

interface ScoreInputProps {
  onAddScores: (points: number[]) => void;
  onScoreSelect: (points: number[]) => void;
  teams: string[];
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  onAddScores,
  onScoreSelect,
  teams,
}) => {
  const [points, setPoints] = useState<(number | null)[]>(
    Array(teams.length).fill(null)
  );
  const [reset, setReset] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const memoizedOnScoreSelect = useCallback(
    (selectedPoints: (number | null)[]) => {
      onScoreSelect(selectedPoints.map((p) => p ?? -1));
    },
    [onScoreSelect]
  );

  useEffect(() => {
    memoizedOnScoreSelect(points);
  }, [points, memoizedOnScoreSelect]);

  const handleAddScores = () => {
    if (points.some((p) => p === null)) {
      setErrorMessage(
        "Veuillez sélectionner un score pour toutes les équipes."
      );
      return;
    }

    onAddScores(points as number[]);
    setPoints(Array(teams.length).fill(null));
    setReset(true);
    setErrorMessage("");
  };

  const handleSelect = (score: number, teamIndex: number) => {
    const newPoints = [...points];
    newPoints[teamIndex] = score;
    setPoints(newPoints);
    setReset(false);
  };

  return (
    <div>
      <p>Sélectionner les points de ce tour :</p>
      {teams.map((team, index) => (
        <div key={index}>
          <p>{team} :</p>
          <ScoreButtons
            onSelect={(score) => handleSelect(score, index)}
            reset={reset}
          />
        </div>
      ))}
      <button onClick={handleAddScores}>Ajouter</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default ScoreInput;
