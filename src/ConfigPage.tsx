import React, { useState } from "react";

interface ConfigPageProps {
  setNumTeams: (num: number) => void;
  setIsConfigured: (isConfigured: boolean) => void;
}

export const ConfigPage: React.FC<ConfigPageProps> = ({
  setNumTeams,
  setIsConfigured,
}) => {
  const [numTeams, setNumTeamsState] = useState(2);

  const handleStart = () => {
    setNumTeams(numTeams);
    setIsConfigured(true);
  };
  return (
    <div>
      <h1>Configuration du jeu</h1>
      <label>Nombre d'équipes : </label>
      <input
        type="number"
        value={numTeams}
        onChange={(e) => setNumTeamsState(Number(e.target.value))}
        min="2"
        max="10"
      />
      <button onClick={handleStart}>Démarrer</button>
    </div>
  );
};

export default ConfigPage;
