import React, { useState } from "react";
import "./styles/styles.css";

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
      <div style={{ marginBottom: "8px" }}>
        <label style={{ marginRight: "0px" }}>Nombre d'équipes : </label>

        <button
          onClick={() =>
            handleNumTeamsChange({
              target: { value: String(Math.max(2, numTeams - 1)) },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          style={{
            padding: "5px",
            margin: "0",
            borderRadius: "4px 0px 0px 4px",
            border: "1px solid #ccc",
            width: "25px",
            fontWeight: "bold",
          }}
        >
          -
        </button>

        <input
          type="number"
          value={numTeams}
          onChange={handleNumTeamsChange}
          min="2"
          max="10"
          style={{
            // fontSize: '1.5em',
            // padding: '5px',
            // width: '60px',
            textAlign: "center",
            margin: "0",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={() =>
            handleNumTeamsChange({
              target: { value: String(Math.min(10, numTeams + 1)) },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          style={{
            padding: "5px",
            margin: "0",
            borderRadius: "0 4px 4px 0",
            border: "1px solid #ccc",
            width: "25px",
            fontWeight: "bold",
          }}
        >
          +
        </button>
      </div>

      {teamNames.map((name, index) => (
        <div key={index} style={{ marginBottom: "8px" }}>
          <label>Nom de l'équipe {index + 1} : </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleTeamNameChange(index, e.target.value)}
            onFocus={(event) => event.target.select()}
          />
        </div>
      ))}
      <button onClick={handleStart}>Démarrer</button>
    </div>
  );
};

export default ConfigPage;
