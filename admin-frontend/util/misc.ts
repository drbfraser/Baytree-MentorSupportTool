export const stringToBool = (str: string) => {
  const strLower = str.toLowerCase();
  return str === "true" || str === "t" || str === "y" || str === "yes";
};

export const tryParseInt = (strNum: string, defaultVal: number) => {
  try {
    const parsed = parseInt(strNum);
    return parsed;
  } catch (error) {
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
