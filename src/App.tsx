import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import ScoreInput from "./ScoreInput";
import { ConfigPage } from "./ConfigPage";

interface Score {
  points: number[];
  colors: string[];
}

const App: React.FC = () => {
  const [teams, setTeams] = useState<string[]>(() => {
    const savedTeams = localStorage.getItem("molkkyTeams");
    return savedTeams ? JSON.parse(savedTeams) : ["Équipe 1", "Équipe 2"];
  });
  const [scores, setScores] = useState<Score[]>(() => {
    const savedScores = localStorage.getItem("molkkyScores");
    return savedScores ? JSON.parse(savedScores) : [];
  });
  const [totals, setTotals] = useState<number[]>(() => {
    const savedTotals = localStorage.getItem("molkkyTotals");
    return savedTotals ? JSON.parse(savedTotals) : Array(teams.length).fill(0);
  });
  const [zeroCounts, setZeroCounts] = useState<number[]>(() => {
    const savedZeroCounts = localStorage.getItem("molkkyZeroCounts");
    return savedZeroCounts
      ? JSON.parse(savedZeroCounts)
      : Array(teams.length).fill(0);
  });
  const [winner, setWinner] = useState<string | null>(() => {
    const savedWinner = localStorage.getItem("winner");
    return savedWinner || null;
  });
  const [tempScores, setTempScores] = useState<number[]>(() =>
    Array(teams.length).fill(-1)
  );
  const [displayTotals, setDisplayTotals] = useState<number[]>(totals);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    localStorage.setItem("molkkyTeams", JSON.stringify(teams));
    localStorage.setItem("molkkyScores", JSON.stringify(scores));
    localStorage.setItem("molkkyTotals", JSON.stringify(totals));
    localStorage.setItem("molkkyZeroCounts", JSON.stringify(zeroCounts));
    if (winner) {
      localStorage.setItem("winner", winner);
    }
  }, [teams, scores, totals, zeroCounts, winner]);

  useEffect(() => {
    setTotals(Array(teams.length).fill(0));
    setZeroCounts(Array(teams.length).fill(0));
    setTempScores(Array(teams.length).fill(-1));
    setDisplayTotals(Array(teams.length).fill(0));
  }, [teams]);

  useEffect(() => {
    const newDisplayTotals = totals.map((total, index) => {
      if (tempScores[index] === -1) return total;
      else {
        const tempTotal = total + tempScores[index];
        if (tempTotal > 50) return 25;
        return tempTotal;
      }
    });
    setDisplayTotals(newDisplayTotals);
  }, [tempScores, totals]);

  const handleScoreSelect = useCallback((scores: number[]) => {
    setTempScores(scores);
  }, []);

  const addScores = (points: number[]) => {
    if (winner) return;

    const newTotals = [...totals];
    const newColors: string[] = [];
    const newZeroCounts = [...zeroCounts];

    points.forEach((point, index) => {
      const { newTotal, color, newZeroCount } = calculateNewTotal(
        newTotals[index],
        point,
        newZeroCounts[index]
      );
      newTotals[index] = newTotal;
      newColors[index] = color;
      newZeroCounts[index] = newZeroCount;
    });

    setTotals(newTotals);
    setZeroCounts(newZeroCounts);
    setScores([...scores, { points, colors: newColors }]);
    setTempScores(Array(teams.length).fill(-1)); // Reset temp scores

    const winningTeamIndex = newTotals.findIndex((total) => total === 50);
    if (winningTeamIndex !== -1) {
      setWinner(teams[winningTeamIndex]);
    }
  };

  const calculateNewTotal = (
    total: number,
    points: number,
    zeroCount: number
  ) => {
    let newZeroCount = zeroCount;
    let color = "";

    if (points === 0) {
      newZeroCount++;
    } else {
      newZeroCount = 0;
    }

    let newTotal = total + points;

    if (newTotal > 50) {
      newTotal = 25;
      color = "red";
    } else if (newTotal === 50) {
      color = "green";
    }

    if (newZeroCount >= 3) {
      newTotal = newTotal >= 25 ? 25 : 0;
      color = "red";
      newZeroCount = 0;
    }

    return { newTotal, color, newZeroCount };
  };

  const exportCSV = () => {
    const headers =
      [
        "Tour",
        ...teams.map((team) => `Points ${team}`),
        ...teams.map((team) => `Cumul ${team}`),
      ].join(",") + "\n";

    const rows = scores
      .map((score, index) => {
        const cumulatives = totals.map((_, teamIndex) => {
          return scores
            .slice(0, index + 1)
            .reduce((sum, s) => sum + s.points[teamIndex], 0);
        });

        return [index + 1, ...score.points, ...cumulatives].join(",");
      })
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "molkky_scores.csv");
    document.body.appendChild(link);
    link.click();
  };

  const resetGame = () => {
    setTeams(["Équipe 1", "Équipe 2"]);
    setIsConfigured(false);
    setScores([]);
    setTotals(Array(2).fill(0));
    setZeroCounts(Array(2).fill(0));
    setTempScores(Array(2).fill(-1));
    setWinner(null);
    localStorage.clear();
  };

  return (
    <div className="App">
      <h1>Compteur de points Mölkky</h1>

      {!isConfigured ? (
        <ConfigPage setTeams={setTeams} setIsConfigured={setIsConfigured} />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Tour</th>
                {teams.map((team, i) => (
                  <th key={i}>Points {team}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {score.points.map((points, teamIndex) => (
                    <td
                      key={teamIndex}
                      style={{ backgroundColor: score.colors[teamIndex] }}
                    >
                      {points}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <ScoreInput
            onAddScores={addScores}
            teams={teams}
            onScoreSelect={handleScoreSelect}
          />

          <h2>Scores cumulés :</h2>
          {displayTotals.map((total, index) => (
            <p key={index}>
              {teams[index]} : <span className="score">{total}</span>
              {tempScores[index] >= 0 && (
                <span className="tempScore"> (+{tempScores[index]})</span>
              )}
            </p>
          ))}

          {winner && (
            <h2 style={{ color: "green" }}>
              Le jeu est terminé ! Victoire de {winner} !
            </h2>
          )}

          <button onClick={exportCSV}>Exporter en CSV</button>
          <button onClick={resetGame} style={{ marginLeft: "10px" }}>
            Réinitialiser le jeu
          </button>
        </>
      )}
    </div>
  );
};

export default App;
