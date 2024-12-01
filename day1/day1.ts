import { readFileSync } from "node:fs";

const colRegex = /(\d+)\s+(\d+)/;

interface CleanData {
  firstCol: number[];
  secondCol: number[];
  length: number;
}

const getRawData = (isProd: boolean) => {
  const slug = isProd ? "./prod.txt" : "./test.txt";
  return readFileSync(slug, { encoding: "utf8" });
};

const getCleanData = (rawData: String) => {
  const firstCol: number[] = [];
  const secondCol: number[] = [];
  for (const row of rawData.split("\n")) {
    if (row.length === 0) {
      continue;
    }
    const match = row.match(colRegex);
    if (!match) {
      throw new Error(`Bad row: ${row}`);
    } else {
      firstCol.push(Number(match[1]));
      secondCol.push(Number(match[2]));
    }
  }
  if (firstCol.length !== secondCol.length) {
    throw new Error("Bad data: `firstCol`, `secondCol` unequal lengths");
  }
  firstCol.sort();
  secondCol.sort();
  return { firstCol: firstCol, secondCol: secondCol, length: firstCol.length };
};

const getPart1 = (cleanData: CleanData) => {
  return Array.from({ length: cleanData.length }, (x, i) => i)
    .map((idx) => Math.abs(cleanData.firstCol[idx] - cleanData.secondCol[idx]))
    .reduce((a, b) => a + b, 0);
};

const getPart2 = (cleanData: CleanData) => {
  return cleanData.firstCol
    .map((a) => a * cleanData.secondCol.filter((b) => b === a).length)
    .reduce((a, b) => a + b, 0);
};

const isProd = true;
const part1 = getPart1(getCleanData(getRawData(isProd)));
console.log(`Part 2: ${part1}`);
const part2 = getPart2(getCleanData(getRawData(isProd)));
console.log(`Part 2: ${part2}`);
