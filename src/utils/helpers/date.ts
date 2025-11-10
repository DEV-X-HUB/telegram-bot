import config from '../../config/config';

export const calculateAge = (ageValue: string) => {
  if (ageValue.includes('/')) {
    const [day, month, year] = ageValue.split('/').map(Number);
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);

    let age = today.getFullYear() - birthDate.getFullYear();
    if (month <= config.monthThreshold) {
      age--;
    }
    return age;
  } else return parseInt(ageValue);
};

export function formatDateFromIsoString(dateString: string): string {
  const currentDate = new Date();
  const inputDate = new Date(dateString);
  const diffInMilliseconds = currentDate.getTime() - inputDate.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'today';
  } else if (diffInDays === 1) {
    return 'yesterday';
  } else if (inputDate.getFullYear() === currentDate.getFullYear() && inputDate.getMonth() === currentDate.getMonth()) {
    return `${diffInDays} days ago`;
  } else {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(inputDate);
    return formattedDate;
  }
}

export const parseDateString = (dateString: string) => {
  // Split the date string by '/'
  let date;
  const parts = dateString.split('/');

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Create a new Date object with extracted day, month, and year
  if (year) date = new Date(year, month - 1, day);
  date = new Date(month, day - 1, 1);

  return date;
};

export const formatPostDate = (createdAt: string, showDateString: boolean = false): string => {
  const now = new Date();
  const createdAtDate = new Date(createdAt);

  if (showDateString) {
    return createdAtDate.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const diffInSeconds = Math.floor((now.getTime() - new Date(createdAtDate).getTime()) / 1000);
  let dateString = ' ';
  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInWeek = 7 * secondsInDay;
  const secondsInMonth = 30 * secondsInDay;
  const secondsInYear = 365 * secondsInDay;

  if (diffInSeconds < secondsInMinute) {
    dateString = `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    dateString = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    dateString = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInWeek) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    dateString = `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInMonth) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    dateString = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInYear) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    dateString = `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / secondsInYear);
    dateString = `${years} year${years > 1 ? 's' : ''} ago`;
  }
  return dateString;
};
