export const calculateAge = (ageValue: string) => {
  if (ageValue.includes('/')) {
    const [day, month, year] = ageValue.split('/').map(Number);
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    return today.getFullYear() - birthDate.getFullYear();
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
  const parts = dateString.split('/');

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  // Create a new Date object with extracted day, month, and year
  const date = new Date(year, month, day);
  return date;
};

// Example usage:
const dateString = '12/12/21';
const date = parseDateString(dateString);
if (date !== null) {
  console.log(date); // Output: Sun Dec 12 2021 00:00:00 GMT+0000 (Coordinated Universal Time)
} else {
  console.log('Invalid date string');
}
