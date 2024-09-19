import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import ScoreInput from "./ScoreInput";

interface Score {
  points: number[];
  colors: string[];
}

const App: React.FC = () => {
  const [teamCount, setTeamCount] = useState<number>(() => {
    const savedTeamCount = localStorage.getItem("molkkyTeamCount");
    return savedTeamCount ? parseInt(savedTeamCount) : 2;
  });
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [scores, setScores] = useState<Score[]>(() => {
    const savedScores = localStorage.getItem("molkkyScores");
    return savedScores ? JSON.parse(savedScores) : [];
  });
  const [totals, setTotals] = useState<number[]>(() => {
    const savedTotals = localStorage.getItem("molkkyTotals");
    return savedTotals ? JSON.parse(savedTotals) : Array(teamCount).fill(0);
  });
  const [zeroCounts, setZeroCounts] = useState<number[]>(() => {
    const savedZeroCounts = localStorage.getItem("molkkyZeroCounts");
    return savedZeroCounts
      ? JSON.parse(savedZeroCounts)
      : Array(teamCount).fill(0);
  });
  const [winner, setWinner] = useState<string | null>(() => {
    const savedWinner = localStorage.getItem("winner");
    return savedWinner || null;
  });
  const [tempScores, setTempScores] = useState<number[]>(() =>
    Array(teamCount).fill(0)
  );
  const [displayTotals, setDisplayTotals] = useState<number[]>(totals);

  useEffect(() => {
    localStorage.setItem("molkkyTeamCount", teamCount.toString());
    localStorage.setItem("molkkyScores", JSON.stringify(scores));
    localStorage.setItem("molkkyTotals", JSON.stringify(totals));
    localStorage.setItem("molkkyZeroCounts", JSON.stringify(zeroCounts));
    if (winner) {
      localStorage.setItem("winner", winner);
    }
  }, [teamCount, scores, totals, zeroCounts, winner]);

  useEffect(() => {
    const newDisplayTotals = totals.map((total, index) => {
      const tempTotal = total + tempScores[index];
      if (tempTotal > 50) return 25;
      return tempTotal;
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
    setTempScores(Array(teamCount).fill(0)); // Reset temp scores

    const winningTeam = newTotals.findIndex((total) => total === 50);
    if (winningTeam !== -1) {
      setWinner(`Équipe ${winningTeam + 1}`);
    }

    setGameStarted(true);
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
        ...Array(teamCount)
          .fill(0)
          .map((_, i) => `Points Équipe ${i + 1}`),
        ...Array(teamCount)
          .fill(0)
          .map((_, i) => `Cumul Équipe ${i + 1}`),
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
    setScores([]);
    setTotals(Array(teamCount).fill(0));
    setZeroCounts(Array(teamCount).fill(0));
    setTempScores(Array(teamCount).fill(0));
    setWinner(null);
    setGameStarted(false);
    localStorage.clear();
  };

  const handleTeamCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTeamCount = parseInt(event.target.value);
    if (newTeamCount >= 2 && newTeamCount <= 10) {
      setTeamCount(newTeamCount);
      setTotals(Array(newTeamCount).fill(0));
      setZeroCounts(Array(newTeamCount).fill(0));
      setTempScores(Array(newTeamCount).fill(0));
    }
  };

  return (
    <div className="App">
      <h1>Compteur de points Mölkky</h1>

      <div style={{ marginBottom: "20px" }}>
        {!gameStarted && (
          <div>
            <label htmlFor="teamCount">Nombre d'équipes : </label>
            <input
              type="number"
              id="teamCount"
              min="2"
              max="10"
              value={teamCount}
              onChange={handleTeamCountChange}
            />
          </div>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Tour</th>
            {Array(teamCount)
              .fill(0)
              .map((_, i) => (
                <th key={i}>Points Équipe {i + 1}</th>
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
        teamCount={teamCount}
        onScoreSelect={handleScoreSelect}
      />

      <h2>Scores cumulés :</h2>
      {displayTotals.map((total, index) => (
        <p key={index}>
          Équipe {index + 1} : <span className="score">{total}</span>
          {tempScores[index] > 0 && (
            <span className="tempScore"> (+{tempScores[index]})</span>
          )}
        </p>
      ))}

      {winner && (
        <h2 style={{ color: "green" }}>
          Le jeu est terminé ! {winner} a gagné !
        </h2>
      )}

      <button onClick={exportCSV}>Exporter en CSV</button>
      <button onClick={resetGame} style={{ marginLeft: "10px" }}>
        Réinitialiser le jeu
      </button>
    </div>
  );
};

export default App;
