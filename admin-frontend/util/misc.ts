export const stringToBool = (str: string) => {
  const strLower = str.toLowerCase();
  return str === "true" || str === "t" || str === "y" || str === "yes";
};
