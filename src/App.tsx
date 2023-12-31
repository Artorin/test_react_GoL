import "bulma/css/bulma.min.css";
import { FC, useState, useRef, useCallback } from "react";
import "./App.css";
import useInterval from "./useInterval";

const numRows = 50;
const numCols = 50;

// Directions: N, S, E, W, NE, NW, SE, SW
const operations = [
  [0, 1], // right
  [0, -1], // left
  [1, -1], // top left
  [-1, 1], // top right
  [1, 1], // top
  [-1, -1], // bottom
  [1, 0], // bottom right
  [-1, 0], // bottom left
];

const generateEmptyGrid = (): number[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const randomTiles = (): number[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

const App: FC = () => {
  const [grid, setGrid] = useState(() => {
    return randomTiles();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback((grid) => {
    if (!runningRef.current) {
      return;
    }

    let gridCopy = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;

        operations.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }

    setGrid(gridCopy);
  }, []);

  //render speed
  useInterval(() => {
    runSimulation(grid);
  }, 150);

  return (
    <div className="container has-text-centered py-5">
      <h1 className="title is-uppercase">Game of Life</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                // Deep clone grid
                let newGrid = JSON.parse(JSON.stringify(grid));
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "1px solid #595959",
              }}
            ></div>
          ))
        )}
      </div>

      <div className="buttons is-centered pt-5">
        <button
          className="button start-game mx-2"
          onClick={() => {
            setRunning(true);
            if (running === false) {
              runningRef.current = true;
            }
          }}
        >
          <span>{"Start"}</span>
        </button>

        <button
          className="button start-game mx-2"
          onClick={() => {
            setRunning(false);
            if (running === true) {
              runningRef.current = false;
            }
          }}
        >
          <span>{"Stop" }</span>
        </button>

        <button
          className="button mx-2"
          onClick={() => {
            setGrid(randomTiles());
          }}
        >
          <span>Random</span>
        </button>

        <button
          className="button mx-2"
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

export default App;
