import React, { useState } from "react";
import ScoreButtons from "./ScoreButtons";

interface ScoreInputProps {
  onAddScores: (pointsTeam1: number, pointsTeam2: number) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ onAddScores }) => {
  const [pointsTeam1, setPointsTeam1] = useState<number | null>(null);
  const [pointsTeam2, setPointsTeam2] = useState<number | null>(null);
  const [reset, setReset] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAddScores = () => {
    if (pointsTeam1 === null || pointsTeam2 === null) {
      setErrorMessage("Veuillez sélectionner un score pour les deux équipes.");
      return;
    }

    onAddScores(pointsTeam1, pointsTeam2);
    setPointsTeam1(null);
    setPointsTeam2(null);
    setReset(true);
    setErrorMessage("");
  };

  const handleSelectTeam1 = (score: number) => {
    setPointsTeam1(score);
    setReset(false);
  };

  const handleSelectTeam2 = (score: number) => {
    setPointsTeam2(score);
    setReset(false);
  };

  return (
    <div>
      <p>Sélectionner les points de ce tour :</p>
      <div>
        <p>Équipe 1 :</p>
        <ScoreButtons onSelect={handleSelectTeam1} reset={reset} />
      </div>
      <div>
        <p>Équipe 2 :</p>
        <ScoreButtons onSelect={handleSelectTeam2} reset={reset} />
      </div>
      <button onClick={handleAddScores}>Ajouter</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default ScoreInput;
