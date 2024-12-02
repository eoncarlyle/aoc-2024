import { readFileSync } from "node:fs";

const getRawData = (isProd: boolean) => {
  const slug = isProd ? "./prod.txt" : "./test.txt";
  return readFileSync(slug, { encoding: "utf8" });
};

const getCleanData = (rawData: String) => {
  return rawData
    .split("\n")
    .filter((row) => row.length > 0)
    .map((row: string) => row.split(" ").map((x) => Number(x)));
};

const getRange = (length: number) => {
  return Array.from({ length: length }, (x, i) => i);
};

const isPart1Safe = (cleanDataRow: number[]) => {
  const diffs = getRange(cleanDataRow.length - 1).map(
    (i) => cleanDataRow[i + 1] - cleanDataRow[i],
  );
  for (let i = 0; i < diffs.length; i++) {
    if (diffs[i] === 0 || diffs[i] / diffs[0] < 0 || Math.abs(diffs[i]) > 3) {
      return false;
    }
  }
  return true;
};

const getPart1 = (cleanData: number[][]) => {
  return cleanData.filter((row) => isPart1Safe(row)).length;
};

const isPart2Safe = (cleanDataRow: number[]) => {
  const diffs = getRange(cleanDataRow.length - 1).map(
    (i) => cleanDataRow[i + 1] - cleanDataRow[i],
  );
  if (isPart1Safe(cleanDataRow)) {
    return true;
  } else {
    for (let j = 0; j < cleanDataRow.length; j++) {
      const slice = cleanDataRow
        .slice(0, j)
        .concat(cleanDataRow.slice(j + 1, cleanDataRow.length));
      if (isPart1Safe(slice)) return true;
    }
    return false;
  }
  /* This branch was only ever done when we had more than one bad diff,
      that was probably the issue
  } else {
      for (let i = 0; i < diffs.length; i++) {
        if (
          diffs[i] === 0 ||
          diffs[i] / diffs[0] < 0 ||
          Math.abs(diffs[i]) > 3
        ) {


          const firstSlice = cleanDataRow
            .slice(0, i)
            .concat(cleanDataRow.slice(i + 1, cleanDataRow.length));

          const secondSlice = cleanDataRow
            .slice(0, i + 1)
            .concat(cleanDataRow.slice(i + 2, cleanDataRow.length));
          return isPart1Safe(firstSlice) || isPart1Safe(secondSlice);
        }
      }
      */
};

const getPart2 = (cleanData: number[][]) => {
  return cleanData.filter((row) => isPart2Safe(row)).length;
};

const isProd = true;
const part1 = getPart1(getCleanData(getRawData(isProd)));
console.log(`Part 1: ${part1}`);

const part2 = getPart2(getCleanData(getRawData(isProd)));
console.log(`Part 2: ${part2}`);
