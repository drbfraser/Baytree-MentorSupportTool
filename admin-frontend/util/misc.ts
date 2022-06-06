export const stringToBool = (str: string) => {
  const strLower = str.toLowerCase();
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
