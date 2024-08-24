"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterateCities = exports.breakeArrayTowNColumn = exports.getCitiesOfCountry = exports.getCountryCodeByName = exports.getCountryByName = exports.getAllCountries = exports.getFilteredCoutryList = exports.getSelectedCoutryList = void 0;
const country_state_city_1 = require("country-state-city");
const string_1 = require("./string");
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
const getSelectedCoutryList = () => {
    return selectedCountries;
};
exports.getSelectedCoutryList = getSelectedCoutryList;
const getFilteredCoutryList = (countryCodes) => {
    const countryList = (0, exports.getAllCountries)();
    return countryList.filter((country) => {
        return countryCodes.some((countryCode) => {
            return (0, string_1.areEqaul)(countryCode, country.isoCode, true);
        });
    });
};
exports.getFilteredCoutryList = getFilteredCoutryList;
const getAllCountries = () => {
    const countryList = country_state_city_1.Country.getAllCountries();
    return countryList;
};
exports.getAllCountries = getAllCountries;
const getCountryByName = (countryName) => {
    const country = (0, exports.getAllCountries)().find((country) => country.name.toLocaleLowerCase() == countryName.toLocaleLowerCase());
    return country;
};
exports.getCountryByName = getCountryByName;
const getCountryCodeByName = (countryName) => {
    var _a;
    return (_a = (0, exports.getCountryByName)(countryName)) === null || _a === void 0 ? void 0 : _a.isoCode;
};
exports.getCountryCodeByName = getCountryCodeByName;
// fetch city list based on the selected country
const getCitiesOfCountry = (countryCode) => {
    const cityList = country_state_city_1.City.getCitiesOfCountry(countryCode);
    return cityList;
};
exports.getCitiesOfCountry = getCitiesOfCountry;
const breakeArrayTowNColumn = (array, ChunkSize) => {
    if (!array)
        return [];
    const result = [];
    for (let i = 0; i < array.length; i += ChunkSize) {
        result.push(array.slice(i, i + ChunkSize));
    }
    return result;
};
exports.breakeArrayTowNColumn = breakeArrayTowNColumn;
const iterateCities = (cityList, roundSize, currentRound) => {
    const lastRound = cityList.length / roundSize;
    if (Math.floor(lastRound) == currentRound)
        return { cityList: cityList.slice(currentRound * roundSize), lastRound: true };
    return { cityList: cityList.slice(currentRound * roundSize, (currentRound + 1) * roundSize), lastRound: false };
};
exports.iterateCities = iterateCities;
//# sourceMappingURL=country-list.js.map