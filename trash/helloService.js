const { getFormattedDateTime } = require('../services/dateService');

const welcomeMessage = () => {
  const formattedDateTime = getFormattedDateTime();
  const message = `Welcome to the API homepage. It's ${formattedDateTime}. Have a good day!`;
  return message
};

module.exports = {
  welcomeMessage,
};