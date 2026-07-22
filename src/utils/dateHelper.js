/**
 * Utility helper to convert local date and time inputs under a specific user timezone
 * into a standard UTC ISO 8601 string.
 * 
 * @param {string} dateStr - Local date input (e.g. "2026-07-22")
 * @param {string} timeStr - Local time input (e.g. "10:00")
 * @param {string} tzName - User's registered timezone (e.g. "Asia/Seoul")
 * @returns {string} - UTC ISO string
 */
export const getUtcDateInTimezone = (dateStr, timeStr, tzName = 'Asia/Seoul') => {
  const offsets = {
    'Asia/Seoul': 9,
    'Asia/Tokyo': 9,
    'Asia/Kolkata': 5.5,
    'Asia/Shanghai': 8,
    'Europe/London': 1,
    'America/New_York': -4,
    'America/Los_Angeles': -7
  };
  const offsetHours = offsets[tzName] !== undefined ? offsets[tzName] : 9;
  
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hr, min] = timeStr.split(':').map(Number);
  
  // Create Date at UTC midnight/time specified
  const dateUtc = new Date(Date.UTC(y, m - 1, d, hr, min, 0));
  // Subtract offset hours to shift it to standard UTC timezone
  dateUtc.setTime(dateUtc.getTime() - (offsetHours * 60 * 60 * 1000));
  return dateUtc.toISOString();
};

/**
 * Utility helper to format a UTC ISO date string (or old space-separated local date)
 * into a localized YYYY-MM-DD HH:MM string corresponding to the user's registered timezone.
 * 
 * @param {string} dateStr - UTC ISO string (e.g. "2026-07-22T01:00:00.000Z") or older format ("2026-07-21 19:37")
 * @param {string} userTimezone - Registered user timezone (e.g. "Asia/Seoul")
 * @returns {string} - Formatted local date-time string in target timezone
 */
export const formatUnlockDate = (dateStr, userTimezone = 'Asia/Seoul') => {
  if (!dateStr) return '';
  
  const parsedStr = dateStr.includes(' ') && !dateStr.includes('T') && !dateStr.includes('Z')
    ? dateStr.replace(' ', 'T')
    : dateStr;
    
  const dateObj = new Date(parsedStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  
  const offsets = {
    'Asia/Seoul': 9,
    'Asia/Tokyo': 9,
    'Asia/Kolkata': 5.5,
    'Asia/Shanghai': 8,
    'Europe/London': 1,
    'America/New_York': -4,
    'America/Los_Angeles': -7
  };
  const offsetHours = offsets[userTimezone] !== undefined ? offsets[userTimezone] : 9;
  
  // Shift standard UTC date to local offset time
  const targetTime = new Date(dateObj.getTime() + (offsetHours * 60 * 60 * 1000));
  
  const year = targetTime.getUTCFullYear();
  const month = String(targetTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(targetTime.getUTCDate()).padStart(2, '0');
  const hours = String(targetTime.getUTCHours()).padStart(2, '0');
  const minutes = String(targetTime.getUTCMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
