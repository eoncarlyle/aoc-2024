import { readFileSync } from "node:fs";

interface CleanData {
  orderingRules: number[][];
  updates: number[][];
}

const getRawData = (isProd: boolean): string => {
  const slug = isProd ? "./prod.txt" : "./test.txt";
  return readFileSync(slug, { encoding: "utf8" });
};

const getCleanData = (rawData: string) => {
  const [a, b] = rawData.split("\n\n");

  const orderingRules = a
    .split("\n")
    .map((row) => row.split("|").map((elem) => Number(elem)));
  const updates = b
    .split("\n")
    .filter((row) => row.length > 0)
    .map((row) => row.split(",").map((elem) => Number(elem)));

  return { orderingRules: orderingRules, updates: updates };
};

const getPart1 = (cleanData: CleanData) => {
  const cleanRows: number[][] = [];
  for (const row of cleanData.updates) {
    let isCorrect = true;
    for (var pt1 = 0; pt1 < row.length && isCorrect; pt1++) {
      for (var pt2 = pt1 + 1; pt2 < row.length && isCorrect; pt2++) {
        // Pass-by-reference equality made issue using `includes`
        if (
          cleanData.orderingRules.filter(
            (elem) => row[pt1] === elem[0] && row[pt2] === elem[1],
          ).length > 0
        ) {
          continue;
        } else if (
          cleanData.orderingRules.filter(
            (elem) => row[pt1] === elem[1] && row[pt2] === elem[0],
          ).length > 0
        ) {
          isCorrect = false;
        } else {
          throw new Error("This should never happen");
        }
      }
    }
    if (isCorrect) {
      cleanRows.push(row);
    }
  }
  return cleanRows
    .map((row) => {
      const idx = Math.floor(row.length / 2);
      return row[idx];
    })
    .reduce((a, b) => a + b, 0);
};

const getPart2 = (cleanData: CleanData) => {
  const cleanRows: number[][] = [];
  for (const row of cleanData.updates) {
    let isModified = false;
    for (var pt0 = 0; pt0 < row.length; pt0++) {
      for (var pt1 = pt0 + 1; pt1 < row.length; pt1++) {
        // Pass-by-reference equality made issue using `includes`
        const goodRule = cleanData.orderingRules.filter(
          (elem) => row[pt0] === elem[0] && row[pt1] === elem[1],
        );
        const badRule = cleanData.orderingRules.filter(
          (elem) => row[pt0] === elem[1] && row[pt1] === elem[0],
        );

        if (goodRule.length > 0) {
          continue;
        } else if (badRule.length > 0) {
          const [a, b] = badRule[0];
          row[pt0] = a;
          row[pt1] = b;
          isModified = true;
        } else {
          throw new Error("This should never happen");
        }
      }
    }
    if (isModified) {
      cleanRows.push(row);
    }
  }
  return cleanRows
    .map((row) => {
      const idx = Math.floor(row.length / 2);
      return row[idx];
    })
    .reduce((a, b) => a + b, 0);
};

const isProd = true;

console.log(getPart2(getCleanData(getRawData(isProd))));
