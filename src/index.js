import './css/styles.css';
import { fetchCountry } from './js/fetchCountries';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput() {
  const country = refs.searchBox.value.trim();
  clearMarkup();

  if (country) {
    fetchCountry(country)
      .then(countries => {
        if (countries.length === 1) {
          refs.list.insertAdjacentHTML(
            'beforeend',
            renderCountryList(countries)
          );
          refs.info.insertAdjacentHTML(
            'beforeend',
            renderCountryInfo(countries)
          );
        } else if (countries.length >= 10) {
          alertTooManyMatches();
        } else {
          refs.list.insertAdjacentHTML(
            'beforeend',
            renderCountryList(countries)
          );
        }
      })
      .catch(alertWrongName);
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="countries-info__item">
          <img class="countries-info__flag" src="${flags.svg}" alt="Flag of ${name.official}" width='40' height='30'>
          <h2 class="countries-info__name">${name.official}</h2>
        </li>`;
    })
    .join('');
  return markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class = "country-info_list">
            <li class = "country-info_item"><p><b>Capital: </b>${capital}</p></li>
            <li class = "country-info_item"><p><b>Population: </b>${population}</p></li>
            <li class = "country-info_item"><p><b>languages: </b>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join();
  return markup;
}

function clearMarkup() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
