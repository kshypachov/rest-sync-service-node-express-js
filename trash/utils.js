// utils.js

// Function to generate a random number within a range
const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a random date of birth in dd-mm-yyyy format
exports.generateRandomDateOfBirth = () => {
  const day = getRandomNumberInRange(1, 31);
  const month = getRandomNumberInRange(1, 12);
  const year = getRandomNumberInRange(1900, 2022); // Adjust range as needed
  return `${day}-${month < 10 ? '0' + month : month}-${year}`;
};

// Function to generate a random RNOKPP
exports.generateRandomRNOKPP = () => {
  const birthDatePart = getRandomNumberInRange(0, 99999).toString().padStart(5, '0');
  const randomPart = getRandomNumberInRange(10000, 99999).toString();
  return birthDatePart + randomPart;
};

// Function to generate a random UNZR
exports.generateRandomUNZR = () => {
  const birthDatePart = this.generateRandomDateOfBirth().split('-').reverse().join('');
  const randomPart = getRandomNumberInRange(1000, 9999).toString();
  const controlDigit = getRandomNumberInRange(0, 9).toString();
  return birthDatePart + '-' + randomPart + controlDigit;
};
