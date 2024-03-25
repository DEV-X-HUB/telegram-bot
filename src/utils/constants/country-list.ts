import { Country, State, City } from 'country-state-city';
import { areEqaul } from './string';

// ffetch country list

const selectedCountries = [
  {
    name: 'Ethiopia',
    isoCode: 'ET',
    flag: '🇪🇹',
    phonecode: '251',
    currency: 'ETB',
    latitude: '8.00000000',
    longitude: '38.00000000',
  },
];
export const getSelectedCoutryList = () => {
  return selectedCountries;
};
export const getFilteredCoutryList = async (countryCodes: string[]) => {
  const countryList = await getAllCountries();
  return countryList.filter((country) => {
    return countryCodes.some((countryCode) => {
      return areEqaul(countryCode, country.isoCode, true);
    });
  });
};

export const getAllCountries = async () => {
  const countryList = await Country.getAllCountries();
  return countryList;
};

// fetch city list based on the selected country
export const getCitiesOfCountry = async (countryCode: string) => {
  const cityList = await City.getCitiesOfCountry(countryCode);
  return cityList;
};

export const breakeArrayTowNColumn = (array: any[] | undefined, ChunkSize: number) => {
  if (!array) return [];

  const result = [];
  for (let i = 0; i < array.length; i += ChunkSize) {
    result.push(array.slice(i, i + ChunkSize));
  }
  return result;
};
