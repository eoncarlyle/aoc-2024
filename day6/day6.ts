import { readFileSync } from "node:fs";

const getRawData = (isProd: boolean) => {
  const slug = isProd ? "./prod.txt" : "./test.txt";
  return readFileSync(slug, { encoding: "utf8" });
};

const getGuardPosition = (board: string[][]) => {
  for (var row = 0; row < board.length; row++) {
    for (var col = 0; col < board[0].length; col++) {
      if (board[row][col] === "^") return [row, col];
    }
  }
  throw new Error("This should never happen");
};

enum Direction {
  "Up", //0
  "Down", //1
  "Left", //2
  "Right", //3
}

type Position = {
  row: number;
  col: number;
};

const getNextPosition = (position: Position, direction: Direction) => {
  if (direction === Direction.Up) {
    return { row: position.row - 1, col: position.col };
  } else if (direction === Direction.Down) {
    return { row: position.row + 1, col: position.col };
  } else if (direction === Direction.Left) {
    return { row: position.row, col: position.col - 1 };
  } else if (direction === Direction.Right) {
    return { row: position.row, col: position.col + 1 };
  } else {
    throw new Error("This should never happen");
  }
};

const getTurn = (direction: Direction) => {
  if (direction === Direction.Up) {
    return Direction.Right;
  } else if (direction === Direction.Down) {
    return Direction.Left;
  } else if (direction === Direction.Left) {
    return Direction.Up;
  } else {
    return Direction.Down;
  }
};

const isAtBoardEdge = (position: Position, rows: number, cols: number) => {
  return (
    position.col === cols - 1 ||
    position.row === rows - 1 ||
    position.col === 0 ||
    position.row === 0
  );
};

const getChar = (direction: Direction) => {
  if (direction === Direction.Up) {
    return "^";
  } else if (direction === Direction.Down) {
    return "v";
  } else if (direction === Direction.Left) {
    return "<";
  } else {
    return ">";
  }
};

const getPart1 = (rawData: string) => {
  const board = rawData
    .split("\n")
    .filter((row) => row.length > 0)
    .map((row) => row.split(""));

  const map = structuredClone(board);

  const [guardRow, guardCol] = getGuardPosition(board);
  var position = { row: guardRow, col: guardCol };
  var direction = Direction.Up;

  map[guardRow][guardCol] = "X";

  while (!isAtBoardEdge(position, rawData.length, rawData[0].length)) {
    var nextPosition = getNextPosition(position, direction);
    console.log(map.map((row) => row.join("")).join("\n"));
    console.log("\n\n\n");
    if (board[nextPosition.row][nextPosition.col] !== ".") {
      console.log(board[nextPosition.row][nextPosition.col]);
      console.log(nextPosition.row);
      console.log(nextPosition.col);
      direction = getTurn(direction);
    } else {
      map[position.row][position.col] = "X";
      position = nextPosition;
      map[position.row][position.col] = getChar(direction);
    }
  }
  console.log(position);
  console.log(map.map((row) => row.join("")).join("\n"));
  return -1;
};

const isProd = false;
console.log(getPart1(getRawData(isProd)));
