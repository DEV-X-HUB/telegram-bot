import { Country, State, City } from 'country-state-city';

// ffetch country list
export const getAllCountries = async () => {
  const countryList = await Country.getAllCountries();
  return countryList;
};

// fetch city list based on the selected country
export const getCitiesOfCountry = async (countryCode: string) => {
  const cityList = await City.getCitiesOfCountry(countryCode);
  return cityList;
};
