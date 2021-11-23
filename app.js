// Global variables
const darkModeBtn = document.querySelector(".dark-mode-btn");
const searchCountryByNameInput = document.getElementById("searchCountry");
const dropDownBtn = document.querySelector(".dropDown-region-btn");
const dropDownMenu = document.querySelector(".regions-menu");
const dropDownRegionsBtns = document.querySelectorAll(".region-btn");
const countriesListContainer = document.querySelector(".countries-list-container");
const countriesCardsContainer = document.querySelector(".countries-cards-container");
const singleCountryContainer = document.querySelector(".single-country-container");
const singleCountryElement = document.querySelector(".single-country-big-wrapper");
const backBtn = document.querySelector(".back-btn");
const homeBtn = document.querySelector(".home-btn");
const scrollToTopBtn = document.getElementById("back-top-btn");

// Manage State Array
let manageState = [];

// DropDown, search countries by region
dropDownBtn.addEventListener("click", () => {
  dropDownMenu.classList.toggle("display-dropDown");
});

// Search country by name
searchCountryByNameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
      getSingleCountryInfo(searchCountryByNameInput.value)
      manageState.push(searchCountryByNameInput.value);
      e.currentTarget.value = "";
  }
});

// Back btn functionality
backBtn.addEventListener("click", () => {
  manageState.pop();
  countriesListContainer.classList.remove("display-countries-list-container");
  singleCountryContainer.classList.remove("display-single-country-container");

  if (manageState.length > 1) {
      getSingleCountryInfo(manageState[manageState.length - 1]);
  } else  {
      singleCountryElement.innerHTML = "";
      singleCountryContainer.classList.remove("display-single-country-container");
      countriesListContainer.classList.add("display-countries-list-container");

      getListOfCountries(manageState[0]);
  }
});

// Home btn functionality
homeBtn.addEventListener("click", () => {
  singleCountryElement.innerHTML = "";
  singleCountryContainer.classList.remove("display-single-country-container");
  countriesListContainer.classList.add("display-countries-list-container");

  let temp = [manageState[0]];
  manageState = [];
  manageState.push(temp);
  getListOfCountries(manageState[0]);
});

// Back to top btn functionality
window.onscroll = () => {
  if (window.scrollY > 500) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
};

scrollToTopBtn.addEventListener("click", () => {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0;
});

// Single country helper
function singleCountryHelper(countryValue) {
  manageState.push(countryValue);
  getSingleCountryInfo(countryValue);
};

// Load list of countries on window load
window.addEventListener("DOMContentLoaded", () => {
  getListOfCountries("europe");
  manageState.push("europe");
  countriesListContainer.classList.add("display-countries-list-container");
  loadTheme(getCurrentTheme());
});

// Get the list of countries
function getListOfCountries(endPoint) {

  fetch(`https://restcountries.com/v3.1/region/${endPoint}`)
  .then(response => {
    if(response.ok){
      return response.json();
    }else{
      throw new Error;
    }
  })
  .then(data => {
    countriesCardsContainer.innerHTML = "";
    createCountriesListItems(data);
  })
  .catch(error => {
    console.error(error);
  })
};


// Create countries cards (for list of countries)
function createCountriesListItems(data) {
  data.forEach(function(d){
    countriesCardsContainer.innerHTML += `
          <div class="country-card" onclick="singleCountryHelper('${d.name.common}')">
              <img src="${d.flags.svg}" alt="Flag">
              <div class="country-details-sm">
                  <h4>${d.name.common}</h4>
                  <p class="special-info"><span class="card-detail-sm small-title">Population: </span>${d.population.toLocaleString("en-US")}</p>
                  <p class="special-info"><span class="card-detail-sm small-title">Region: </span>${d.region}</p>
                  <p class="special-info"><span class="card-detail-sm small-title">Capital: </span>${d.capital !== undefined ? d.capital[0] : ''}</p>
              </div>
          </div>`;
  })
};

// Display the list of countries by region
dropDownRegionsBtns.forEach(region => {
  region.addEventListener("click", () => {
      dropDownMenu.classList.remove("display-dropDown");
      getListOfCountries(region.dataset.region)
      manageState.splice(0, 1, region.dataset.region);
  });
});

// get single country info
function getSingleCountryInfo(countryValue) {

  countriesListContainer.classList.remove("display-countries-list-container");
  singleCountryContainer.classList.add("display-single-country-container");

  fetch(`https://restcountries.com/v3.1/name/${countryValue}`)
  .then(response => {
    if(response.ok){
      return response.json();
    }else{
      throw new Error;
    }
  })
  .then(data => {
    singleCountryElement.innerHTML = "";
    singleCountryElement.appendChild(createSingleCountryElement(data[0]));
  })
  .catch(error => {
    console.log(error);
  })
};

// Language array to string helper function
function languagesHelper(languagesArray) {
  return languagesArray.map(el => el).join(", ");
};


// Create Single Country Element 
function createSingleCountryElement(country) {

  let singleCountryWrapper = document.createElement("div");
  singleCountryWrapper.setAttribute("class", "single-country-wrapper");
  singleCountryWrapper.innerHTML = ``;


  let countryFlag = document.createElement("div");
  countryFlag.setAttribute("class", "country-flag");
  countryFlag.innerHTML = `<img src="${country.flags.svg}" alt="Flag">`;


  let countryDetails = document.createElement("div");
  countryDetails.setAttribute("class", "other-details-wrapper");
  countryDetails.innerHTML = `<h3>${country.name.common}</h3>`;


  let twoPanels = document.createElement("div");
  twoPanels.setAttribute("class", "two-panels");
  twoPanels.innerHTML = `
          <div class="first-panel">
              <p class="special-info"><span class="country-detail-sm small-title">Population: </span>${country.population.toLocaleString("en-US")}</p>
              <p class="special-info"><span class="country-detail-sm small-title">Native name: </span>${Object.values(country.name.nativeName)[0].common}</p>
              <p class="special-info"><span class="country-detail-sm small-title">Region: </span>${country.region}</p>
              <p class="special-info"><span class="country-detail-sm small-title">Sub Region: </span> ${country.subregion}</p>
              <p class="special-info"><span class="country-detail-sm small-title">Capital: </span>${country.capital !== undefined ? country.capital[0] : ''}</p>
          </div>
          <div class="second-panel">
              <p class="special-info"><span class="country-detail-sm small-title">Top Level Domain: </span>${(country.tld != undefined) ? country.tld[0] : 'No Domain Data'}</p>
              <p class="special-info"><span class="country-detail-sm small-title">Currencies: </span>${Object.values(country.currencies)[0].name}</p>
              <p class="special-info"><span class="country-detail-sm small-title">Languages: </span>${languagesHelper(Object.values(country.languages))}</p>
          </div>`;


  let bordersContainer = document.createElement("div");
  bordersContainer.setAttribute("class", "border-container");
  bordersContainer.innerHTML = "<h4>Border Countries:</h4>";
  bordersContainer.appendChild(createSingleCountryBorders(country.borders));

  countryDetails.appendChild(twoPanels);
  countryDetails.appendChild(bordersContainer);

  singleCountryWrapper.appendChild(countryFlag);
  singleCountryWrapper.appendChild(countryDetails);

  return singleCountryWrapper;
};


// Create Single Country Info 
function createSingleCountryBorders(countryBorder) {
  let bordersWrapper = document.createElement("div");
  bordersWrapper.setAttribute("class", "border-wrapper");

    if (countryBorder === undefined) {
        bordersWrapper.innerHTML += `<p class="neighbor">No border data</p>`
    } else {
        for (let border of countryBorder) {
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then(response => {
              if(response.ok){
                return response.json();
              }else{
                throw new Error;
              }
            })
            .then(data => {
              let theFullName = Object.values(data)[0].name.common;
              bordersWrapper.innerHTML += `<p class="neighbor" onclick="singleCountryHelper('${theFullName}')">${theFullName}</p>`;
            })
            .catch(error =>{
              console.log(error);
            })
        }
    }

   return  bordersWrapper;
};


// dark mode
function getCurrentTheme(){
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  localStorage.getItem('restCountries.theme') ? theme = localStorage.getItem('restCountries.theme') : null;
  return theme;
};

function loadTheme(theme){
  const root = document.querySelector(':root');
  if(theme === "light"){
    darkModeBtn.innerHTML = `<i class="far fa-moon"></i> Dark Mode`;
  } else {
    darkModeBtn.innerHTML = `<i class="fas fa-sun"></i> Light Mode`;
  }
  root.setAttribute('color-scheme', `${theme}`);
};


darkModeBtn.addEventListener('click', () => {
  let theme = getCurrentTheme();
  if(theme === 'dark'){
    theme = 'light';
  } else {
    theme = 'dark';
  }
  localStorage.setItem('restCountries.theme', `${theme}`);
  loadTheme(theme);
});