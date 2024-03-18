import { Country, State, City } from 'country-state-city';

// ffetch country list
export const getAllCountries = async () => {
  const countryList = await Country.getAllCountries();
  console.log('countryList', countryList);
  return countryList;
};
