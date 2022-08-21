import './css/styles.css';
import  {fetchCountries} from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


function onSearch(e) {
    e.preventDefault()
    
  const searchQuery = e.target.value.trim();
  if (searchQuery === '') {
    countryInfo.innerHTML = '';
    countriesList.innerHTML = '';
    return
  }
    
  fetchCountries(searchQuery)
    .then(countries => {
      if ( countries.length > 10) {
        return Notify.info("Too many matches found. Please enter a more specific name.", { position: 'center-top' });
      }

      if (countries.length >= 2 || countries.length <= 10) {
        // marcupList = countries.map(country => renderCountryList(country)).join('')
        // countriesList.innerHTML = marcupList;
        renderCountryList(countries);
        countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        // marcupInfo = countries.map(country => renderCountryInfo(country)).join('')
        // countryInfo.innerHTML = marcupInfo;
        renderCountryInfo(countries);
        countriesList.innerHTML = '';
      }
    })
    .catch(onFetchError)
      
}

function renderCountryList(countries) {
 const marcupList = countries.map(({ name, flags, }) =>
    `<li><img src="${flags.svg}" alt="flag" width= 30></img><span> ${name.official}</span></li>`)
    .join('');
      countriesList.innerHTML = marcupList;
      
   
  
}

// function renderCountryList({
//   name,
//   flags,
// }) {
//   return `<li><img src="${flags.svg}" alt="flag" width= 30></img><span> ${name.official}</span></li>`
  
// }

function renderCountryInfo(countries) {
  const marcupInfo = countries.map(({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) => `<img src="${svg}" alt="flag" width= 30></img><span class="title"> ${official}</span>
  <ul class="countri-info_list">
  <li class="item">Capital: ${capital}</li>
  <li class="item">Population: ${population}</li>
  <li class="item">Languages: ${Object.values(languages)}</li>
  </ul>
  `)
    .join('')
  countryInfo.innerHTML = marcupInfo;
  
}

// function renderCountryInfo({
//   name: { official },
//   capital,
//   population,
//   flags: { svg },
//   languages,
// }) {
//   return `<img src="${svg}" alt="flag" width= 30></img><span class="title"> ${official}</span>
//   <ul class="countri-info_list">
//   <li class="item">Capital: ${capital}</li>
//   <li class="item">Population: ${population}</li>
//   <li class="item">Languages: ${Object.values(languages)}</li>
//   </ul>
//   `
  
// }

function onFetchError(error) {
   Notify.failure("Oops, there is no country with that name", { position: 'center-top' });
      countryInfo.innerHTML = '';
      countriesList.innerHTML = '';
      return error;
}