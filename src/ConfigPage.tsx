import React, { useState } from "react";

interface ConfigPageProps {
  setTeams: (teams: string[]) => void;
  setIsConfigured: (isConfigured: boolean) => void;
}

export const ConfigPage: React.FC<ConfigPageProps> = ({
  setTeams,
  setIsConfigured,
}) => {
  const [numTeams, setNumTeams] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>([
    "Équipe 1",
    "Équipe 2",
  ]);

  const handleNumTeamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumTeams = Number(e.target.value);
    setNumTeams(newNumTeams);
    setTeamNames((prevNames) => {
      const newNames = [...prevNames];
      while (newNames.length < newNumTeams) {
        newNames.push(`Équipe ${newNames.length + 1}`);
      }
      return newNames.slice(0, newNumTeams);
    });
  };

  const handleTeamNameChange = (index: number, name: string) => {
    setTeamNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[index] = name;
      return newNames;
    });
  };

  const handleStart = () => {
    setTeams(teamNames);
    setIsConfigured(true);
  };

  return (
    <div>
      <h1>Configuration du jeu</h1>
      <label>Nombre d'équipes : </label>
      <input
        type="number"
        value={numTeams}
        onChange={handleNumTeamsChange}
        min="2"
        max="10"
      />
      {teamNames.map((name, index) => (
        <div key={index}>
          <label>Nom de l'équipe {index + 1} : </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleTeamNameChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleStart}>Démarrer</button>
    </div>
  );
};

export default ConfigPage;
