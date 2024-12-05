import { readFileSync } from "node:fs";

const largerRegex = /mul\(\d+,\d+\)/g;
const allowRegex = /do\(\)/g;
const denyRegex = /don't\(\)/g;

const getRawData = (isProd: boolean): string => {
  const slug = isProd ? "./prod.txt" : "./test.txt";
  return readFileSync(slug, { encoding: "utf8" });
};

const getCleanData = (rawData: string) => {
  return rawData.split("\n").filter((row: string) => row.length > 0);
};

const getPart1 = (cleanData: string[]) => {
  const cols = cleanData[0].length;
  const rows = cleanData.length;

  const degreePattern0 = (xRowIdx: number, xColIdx: number) => {
    const out = ["X"];
    for (
      var rowIdx = xRowIdx - 1;
      rowIdx > xRowIdx - 4 && rowIdx >= 0;
      rowIdx--
    ) {
      out.push(cleanData[rowIdx][xColIdx]);
    }
    return out;
  };

  const degreePattern45 = (xRowIdx: number, xColIdx: number) => {
    const out = ["X"];
    let inc = 1;
    let rowIdx = xRowIdx - 1;
    let colIdx = xColIdx + 1;

    while (rowIdx >= 0 && colIdx < cols && inc < 4) {
      out.push(cleanData[rowIdx][colIdx]);
      inc++;
      rowIdx = xRowIdx - inc;
      colIdx = xColIdx + inc;
    }
    return out;
  };

  const degreePattern90 = (xRowIdx: number, xColIdx: number) => {
    const out = ["X"];
    for (
      var colIdx = xColIdx + 1;
      colIdx < xColIdx + 4 && colIdx < cols;
      colIdx++
    ) {
      out.push(cleanData[xRowIdx][colIdx]);
    }
    return out;
  };

  const degreePattern135 = (xRowIdx: number, xColIdx: number) => {
    const out = ["X"];
    let inc = 1;
    let rowIdx = xRowIdx + 1;
    let colIdx = xColIdx + 1;

    while (rowIdx < rows && colIdx < cols && inc < 4) {
      out.push(cleanData[rowIdx][colIdx]);
      inc++;
      rowIdx = xRowIdx + inc;
      colIdx = xColIdx + inc;
    }
    return out;
  };

  const degreePattern180 = (xRowIdx: number, xColIdx: number) => {
    const out = ["X"];
    for (
      var rowIdx = xRowIdx + 1;
      rowIdx < xRowIdx + 4 && rowIdx < rows;
      rowIdx++
    ) {
      out.push(cleanData[rowIdx][xColIdx]);
    }
    return out;
  };

  const degreePattern225 = (xRowIdx: number, xColIdx: number) => {
    const out = ["X"];
    let inc = 1;
    let rowIdx = xRowIdx + 1;
    let colIdx = xColIdx - 1;

    while (rowIdx < rows && colIdx >= 0 && inc < 4) {
      out.push(cleanData[rowIdx][colIdx]);
      inc++;
      rowIdx = xRowIdx + inc;
      colIdx = xColIdx - inc;
    }
    return out;
  };

  const degreePattern270 = (xRowIdx: number, xColIdx: number) => {
    const out = ["X"];
    for (
      var colIdx = xColIdx - 1;
      colIdx > xColIdx - 4 && colIdx >= 0;
      colIdx--
    ) {
      out.push(cleanData[xRowIdx][colIdx]);
    }
    return out;
  };

  const degreePattern315 = (xRowIdx: number, xColIdx: number) => {
    const out = ["X"];
    let inc = 1;
    let rowIdx = xRowIdx - 1;
    let colIdx = xColIdx - 1;

    while (rowIdx >= 0 && colIdx >= 0 && inc < 4) {
      out.push(cleanData[rowIdx][colIdx]);
      inc++;
      rowIdx = xRowIdx - inc;
      colIdx = xColIdx - inc;
    }
    return out;
  };

  var out = 0;
  for (var rowIdx = 0; rowIdx < cols; rowIdx++) {
    for (var colIdx = 0; colIdx < cols; colIdx++) {
      if (cleanData[rowIdx][colIdx] === "X") {
        const current: string[][] = [];
        current.push(degreePattern0(rowIdx, colIdx));
        current.push(degreePattern45(rowIdx, colIdx));
        current.push(degreePattern90(rowIdx, colIdx));
        current.push(degreePattern135(rowIdx, colIdx));
        current.push(degreePattern180(rowIdx, colIdx));
        current.push(degreePattern225(rowIdx, colIdx));
        current.push(degreePattern270(rowIdx, colIdx));
        current.push(degreePattern315(rowIdx, colIdx));

        out += current
          .map((row) => row.join(""))
          .filter((x) => x === "XMAS").length;
      }
    }
  }
  return out;
};

const getPart2 = (cleanData: string[]) => {
  const cols = cleanData[0].length;
  const rows = cleanData.length;

  var out = 0;
  for (var rowIdx = 1; rowIdx < cols - 1; rowIdx++) {
    for (var colIdx = 1; colIdx < cols - 1; colIdx++) {
      if (cleanData[rowIdx][colIdx] === "A") {
        const firstDiag =
          cleanData[rowIdx - 1][colIdx - 1] +
          cleanData[rowIdx][colIdx] +
          cleanData[rowIdx + 1][colIdx + 1];
        const secondDiag =
          cleanData[rowIdx + 1][colIdx - 1] +
          cleanData[rowIdx][colIdx] +
          cleanData[rowIdx - 1][colIdx + 1];

        if (
          (firstDiag === "MAS" || firstDiag === "SAM") &&
          (secondDiag === "MAS" || secondDiag === "SAM")
        ) {
          out += 1;
        }
      }
    }
  }
  return out;
};

const isProd = true;
console.log(getPart2(getCleanData(getRawData(isProd))));
