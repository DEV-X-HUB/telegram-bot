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
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  // Create a new Date object with extracted day, month, and year
  if (year) date = new Date(year, month, day);
  date = new Date(month, day, 1);

  return date;
};
