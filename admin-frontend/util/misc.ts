export const stringToBool = (str: string) => {
  return str === "true" || str === "t" || str === "y" || str === "yes";
};

export const tryParseInt = (strNum: string, defaultVal: number) => {
  const parsed = parseInt(strNum);
  if (!isNaN(parsed)) {
    return parsed;
  } else {
    return defaultVal;
  }
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const padLeftString = (padChar: string, width: number, str: string) => {
  const padding = Array(1 + width - str.length).join(padChar);
  return padding + str;
};

// Doesn't work for nested arrays, objects, shallow equality is used
// Side effect: sorts the arrays
export const arraysEqual = (a1: Array<any>, a2: Array<any>) => {
  if (a1 === a2) {
    return true;
  } else if (a1.length === a2.length) {
    a1.sort();
    a2.sort();
    return a1.every((val, i) => val === a2[i]);
  } else {
    return false;
  }
};

export const objectsToCsv = (
  objects: Record<string, any>[],
  fieldsToKeep: { title: string; field: string }[]
) => {
  let firstCsvRow = "";
  fieldsToKeep.forEach((fieldToKeep) => {
    firstCsvRow = firstCsvRow + fieldToKeep.title + ",";
  });
  firstCsvRow += "\r\n";

  let csvContents = firstCsvRow;
  objects.forEach((object) => {
    fieldsToKeep.forEach((fieldToKeep) => {
      csvContents = csvContents + object[fieldToKeep.field] + ",";
    });
    csvContents += "\r\n";
  });

  return csvContents;
};

/** Download contents as a file
 * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
 */
export const downloadBlob = (
  content: string,
  filename: string,
  contentType: string
) => {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement("a");
  pom.href = url;
  pom.setAttribute("download", filename);
  pom.click();
};

/** Filename is without extension */
export const downloadCsv = (content: string, fileName: string) => {
  downloadBlob(content, `${fileName}.csv`, "text/csv;charset=utf-8;");
};
