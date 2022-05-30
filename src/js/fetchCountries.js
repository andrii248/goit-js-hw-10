const fields = 'name,flags,capital,population,languages';

export function fetchCountry(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=${fields}`)
    .then(response => response.json())
    .catch(error => console.log(error));
}
