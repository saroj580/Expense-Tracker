// Convert UTC date to Nepal Time (UTC+5:45)
const convertToNepalTime = (date) => {
  const utcDate = new Date(date);
  
  // Nepal is UTC+5:45 (5 hours and 45 minutes ahead of UTC)
  const offsetHours = 5;
  const offsetMinutes = 45;
  
  utcDate.setHours(utcDate.getHours() + offsetHours);
  utcDate.setMinutes(utcDate.getMinutes() + offsetMinutes);
  
  return utcDate;
};

// Format date for logs in Nepal Time
const formatNepalTime = (date) => {
  const nepalDate = convertToNepalTime(date);
  return nepalDate.toISOString().replace('Z', '+05:45');
};

// Get current time in Nepal Time
const getCurrentNepalTime = () => {
  return convertToNepalTime(new Date());
};

module.exports = {
  convertToNepalTime,
  formatNepalTime,
  getCurrentNepalTime
}; 