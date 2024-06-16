import { Country, State, City } from 'country-state-city';
import as from 'country-state-city';
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

export const getFilteredCoutryList = (countryCodes: string[]) => {
  const countryList = getAllCountries();
  return countryList.filter((country) => {
    return countryCodes.some((countryCode) => {
      return areEqaul(countryCode, country.isoCode, true);
    });
  });
};

export const getAllCountries = () => {
  const countryList = Country.getAllCountries();
  return countryList;
};
export const getCountryByName = (countryName: string) => {
  const country = getAllCountries().find(
    (country) => country.name.toLocaleLowerCase() == countryName.toLocaleLowerCase(),
  );

  return country;
};
export const getCountryCodeByName = (countryName: string) => {
  return getCountryByName(countryName)?.isoCode;
};

// fetch city list based on the selected country
export const getCitiesOfCountry = (countryCode: string) => {
  const cityList = City.getCitiesOfCountry(countryCode);
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

export const iterateCities = (cityList: any[], roundSize: number, currentRound: number) => {
  const lastRound = cityList.length / roundSize;
  if (Math.floor(lastRound) == currentRound)
    return { cityList: cityList.slice(currentRound * roundSize), lastRound: true };
  return { cityList: cityList.slice(currentRound * roundSize, (currentRound + 1) * roundSize), lastRound: false };
};
