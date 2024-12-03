import { readFileSync } from "node:fs";

const largerRegex = /mul\(\d+,\d+\)/g;
const allowRegex = /do\(\)/g;
const denyRegex = /don't\(\)/g;

const getRawData = (isProd: boolean) => {
  const slug = isProd ? "./prod.txt" : "./test.txt";
  return readFileSync(slug, { encoding: "utf8" });
};

const getMatches = (rawData: string) => {
  const largerMatches = rawData.match(largerRegex);

  return (
    largerMatches &&
    largerMatches
      .map((match) => {
        const [a, b] = match.slice(4, -1).split(",");
        return Number(a) * Number(b);
      })
      .reduce((a, b) => a + b, 0)
  );
};

const getPart2AllowedMap = (rawData: string) => {
  //return rawData.match(allowRegex);
  const allowIndicies = Array.from(rawData.matchAll(allowRegex), (m) => m).map(
    (a) => a.index,
  );
  const denyIndicies = Array.from(rawData.matchAll(denyRegex), (m) => m).map(
    (a) => a.index,
  );
  return { allowIndicies: allowIndicies, denyIndicies: denyIndicies };
};

const getPart2 = (rawData: string) => {
  const allowedMap = getPart2AllowedMap(rawData);
  const matchMap = Array.from(rawData.matchAll(largerRegex), (m) => m);
  const allMatchIndicies = matchMap.map((a) => a.index);

  let allowPointer = -1;
  let denyPointer = -1;
  let sum = 0;
  // Match, allow, and deny pointers are all mutually exclusive
  for (let i = 0; i < rawData.length; i++) {
    if (allMatchIndicies.includes(i)) {
      if (allowPointer >= denyPointer) {
        const match = matchMap.filter((a) => a.index === i)[0][0];

        const [a, b] = match.slice(4, -1).split(",");
        sum = sum + Number(a) * Number(b);
      }
    } else if (allowedMap.allowIndicies.includes(i)) {
      allowPointer = i;
    } else if (allowedMap.denyIndicies.includes(i)) {
      denyPointer = i;
    }
  }
  return sum;
};

const isProd = true;
console.log(getPart2(getRawData(isProd)));
