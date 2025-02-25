# 🎯 Mollky scoreboard

A simple web application for tracking Mölkky game scores. It supports multiple teams, enforces official game rules, and persists scores using local storage.

## ✨ Features

- Add and track scores for any number of teams
- Enforce Mölkky rules:
  -If a team exceeds 50 points, it drops back to 25
  - If a team scores zero 3 times in a row, they drop to 25 (if ≥25) or 0 (otherwise)
- Interactive number selection (1-12) with button-based input
- Real-time cumulative score updates
- Highlighting important events:
  - Green when reaching exactly 50 (winning condition)
  - Red when score resets to 25 or 0 due to penalties
- Local storage support to retain scores after page reload
- Reset button to clear all scores and start fresh
- CSV export for saving game history

## 🚀 Usage

1. Start the app
1. Select the number of teams and add their names
1. Click 1-12 to select a score for each team
1. Click "Add Score" to update the scoreboard
1. Keep playing until a team reaches 50! 🎉

## 📦 Local installation

```
# clone the repo
cd molkkky-scoreboard
npm install
npm start
```
