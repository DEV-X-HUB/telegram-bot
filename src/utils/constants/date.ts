export const calculateAge = (ageValue: string) => {
  if (ageValue.includes('/')) {
    const [day, month, year] = ageValue.split('/').map(Number);
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    return today.getFullYear() - birthDate.getFullYear();
  } else return parseInt(ageValue);
};

function formatDateFromIsoString(dateString: string): string {
  const currentDate = new Date();
  const inputDate = new Date(dateString);
  const diffInMilliseconds = currentDate.getTime() - inputDate.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (inputDate.getFullYear() === currentDate.getFullYear() && inputDate.getMonth() === currentDate.getMonth()) {
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
