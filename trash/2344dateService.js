// services/dateService.js
const getFormattedDateTime = () => {
  const currentDate = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayOfWeek = days[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  const formattedDateTime = `${dayOfWeek}, ${dayOfMonth} ${month}. ${hours}.${minutes}`;

  return formattedDateTime;
};

module.exports = {
  getFormattedDateTime,
};

//Service: Encapsulates the application's business logic. Services handle tasks such as data validation, manipulation, and interaction with external services or databases.