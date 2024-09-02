import React, { useState } from 'react';
import './App.css';

interface Score {
  pointsTeam1: number;
  pointsTeam2: number;
  colorTeam1: string;
  colorTeam2: string;
}

const App: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [totalTeam1, setTotalTeam1] = useState<number>(0);
  const [totalTeam2, setTotalTeam2] = useState<number>(0);
  const [zeroCountTeam1, setZeroCountTeam1] = useState<number>(0);
  const [zeroCountTeam2, setZeroCountTeam2] = useState<number>(0);
  const [winner, setWinner] = useState<string | null>(null);

  const addScores = (pointsTeam1: number, pointsTeam2: number) => {
    if (winner) return; // Si une équipe a déjà gagné, on ne permet pas d'ajouter de nouveaux scores.

    const { newTotal: newTotalTeam1, color: colorTeam1 } = calculateNewTotal(totalTeam1, pointsTeam1, 'Team1');
    const { newTotal: newTotalTeam2, color: colorTeam2 } = calculateNewTotal(totalTeam2, pointsTeam2, 'Team2');

    setTotalTeam1(newTotalTeam1);
    setTotalTeam2(newTotalTeam2);

    setScores([...scores, { pointsTeam1, pointsTeam2, colorTeam1, colorTeam2 }]);

    if (newTotalTeam1 === 50) {
      setWinner('Équipe 1');
    } else if (newTotalTeam2 === 50) {
      setWinner('Équipe 2');
    }
  };

  const calculateNewTotal = (total: number, points: number, team: 'Team1' | 'Team2') => {
    let zeroCount = team === 'Team1' ? zeroCountTeam1 : zeroCountTeam2;
    let color = '';

    if (points === 0) {
      zeroCount++;
    } else {
      zeroCount = 0;
    }

    let newTotal = total + points;

    // Vérification des règles supplémentaires
    if (newTotal > 50) {
      newTotal = 25;
      color = 'red';
    } else if (newTotal === 50) {
      color = 'green';
    }

    if (zeroCount >= 3) {
      newTotal = newTotal >= 25 ? 25 : 0;
      color = 'red';
      zeroCount = 0;
    }

    if (team === 'Team1') {
      setZeroCountTeam1(zeroCount);
    } else {
      setZeroCountTeam2(zeroCount);
    }

    return { newTotal, color };
  };

  const exportCSV = () => {
    const headers = "Tour,Points Équipe 1,Points Équipe 2\n";
    const rows = scores.map((score, index) => `${index + 1},${score.pointsTeam1},${score.pointsTeam2}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "molkky_scores.csv");
    document.body.appendChild(link); // Requis pour Firefox
    link.click();
  };

  return (
    <div className="App">
      <h1>Compteur de points Mölkky</h1>
      <table>
        <thead>
          <tr>
            <th>Tour</th>
            <th>Points Équipe 1</th>
            <th>Points Équipe 2</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td style={{ backgroundColor: score.colorTeam1 }}>{score.pointsTeam1}</td>
              <td style={{ backgroundColor: score.colorTeam2 }}>{score.pointsTeam2}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ScoreInput onAddScores={addScores} />

      <h2>Scores cumulés :</h2>
      <p>Équipe 1 : <span className="score">{totalTeam1}</span></p>
      <p>Équipe 2 : <span className="score">{totalTeam2}</span></p>

      {winner && <h2 style={{ color: 'green' }}>Le jeu est terminé ! {winner} a gagné !</h2>}

      <button onClick={exportCSV}>Exporter en CSV</button>
    </div>
  );
};

interface ScoreInputProps {
  onAddScores: (pointsTeam1: number, pointsTeam2: number) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ onAddScores }) => {
  const [pointsTeam1, setPointsTeam1] = useState<number>(0);
  const [pointsTeam2, setPointsTeam2] = useState<number>(0);

  const handleAddScores = () => {
    if (pointsTeam1 < 0 || pointsTeam1 > 12 || pointsTeam2 < 0 || pointsTeam2 > 12) {
      alert("Les points doivent être compris entre 0 et 12.");
      return;
    }
    onAddScores(pointsTeam1, pointsTeam2);
    setPointsTeam1(0);
    setPointsTeam2(0);
  };

  return (
    <div>
      <p>Ajouter les points de ce tour :</p>
      <input
        type="number"
        value={pointsTeam1}
        onChange={(e) => setPointsTeam1(Number(e.target.value))}
        placeholder="Équipe 1"
      />
      <input
        type="number"
        value={pointsTeam2}
        onChange={(e) => setPointsTeam2(Number(e.target.value))}
        placeholder="Équipe 2"
      />
      <button onClick={handleAddScores}>Ajouter</button>
    </div>
  );
};

export default App;
