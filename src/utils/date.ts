export const calculateAge = (ageValue: string) => {
  if (ageValue.includes('/')) {
    const [day, month, year] = ageValue.split('/').map(Number);
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    return today.getFullYear() - birthDate.getFullYear();
  } else return parseInt(ageValue);
};
