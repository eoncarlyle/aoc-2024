import { readFileSync } from "node:fs";

const getRawData = (isProd: boolean): string => {
  const slug = isProd ? "./prod.txt" : "./test.txt";
  return readFileSync(slug, { encoding: "utf8" });
};

type Equation = {
  goal: number;
  args: number[];
};

const getCleanData = (rawData: string) => {
  return rawData
    .split("\n")
    .filter((row) => row.length > 0)
    .map((row: string) => {
      const colonSplit = row.split(":");
      if (colonSplit.length !== 2) {
        console.error(colonSplit);
        throw new Error("This should never happen");
      }
      const goal = Number(colonSplit[0]);
      const args = colonSplit[1]
        .split(" ")
        .filter((row) => row.length > 0)
        .map((a) => Number(a));
      return { goal: goal, args: args };
    });
};

const getPart1 = (rows: Equation[]) => {
  const getProduct = (args: number[]) => args.reduce((a, b) => a * b, 1);
  const getSum = (args: number[]) => args.reduce((a, b) => a + b, 0);

  const recursiveSolver = (
    goal: number,
    args: number[],
    current: number,
    idx: number,
    operators: string[],
  ) => {
    if (idx === args.length) {
      return current === goal;
    } else {
      if (current > goal) {
        return false;
      } else {
        const addedSolution = recursiveSolver(
          goal,
          args,
          current + args[idx],
          idx + 1,
          operators.concat("+"),
        );
        const mulitipliedSolution = recursiveSolver(
          goal,
          args,
          current * args[idx],
          idx + 1,
          operators.concat("+"),
        );

        return addedSolution || mulitipliedSolution;
      }
    }
  };
  return rows
    .filter((equation) => {
      return recursiveSolver(
        equation.goal,
        equation.args,
        equation.args[0],
        1,
        [],
      );
    })
    .map((a) => a.goal)
    .reduce((a, b) => a + b, 0);
};

const getPart2 = (rows: Equation[]) => {
  const recursiveSolver = (
    goal: number,
    args: number[],
    current: number,
    idx: number,
    operators: string[],
  ) => {
    if (idx === args.length) {
      return current === goal;
    } else {
      if (current > goal) {
        return false;
      } else {
        const addedSolution = recursiveSolver(
          goal,
          args,
          current + args[idx],
          idx + 1,
          operators.concat("+"),
        );
        const mulitipliedSolution = recursiveSolver(
          goal,
          args,
          current * args[idx],
          idx + 1,
          operators.concat("*"),
        );
        const concattedSolution = recursiveSolver(
          goal,
          args,
          Number(String(current) + String(args[idx])),
          idx + 1,
          operators.concat("||"),
        );
        return addedSolution || mulitipliedSolution || concattedSolution;
      }
    }
  };
  return rows
    .filter((equation) => {
      return recursiveSolver(
        equation.goal,
        equation.args,
        equation.args[0],
        1,
        [],
      );
    })
    .map((a) => a.goal)
    .reduce((a, b) => a + b, 0);
};

const isProd = true;
console.log(getPart1(getCleanData(getRawData(isProd))));
console.log(getPart2(getCleanData(getRawData(isProd))));
