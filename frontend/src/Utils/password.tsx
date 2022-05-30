export const checkPassword = (password: string) => {
  // Regex from https://stackoverflow.com/questions/1559751/regex-to-make-sure-that-the-string-contains-at-least-one-lower-case-char-upper
  // Check if at least one lower case, upper case, digit, symbol, and at least 8 characters and no more than 30
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/g;
  const found = password.match(regex);
  return password.length >= 8 && password.length <= 30 && found;
};
