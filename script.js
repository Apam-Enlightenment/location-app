'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const renderError = function(msg){
    countriesContainer.insertAdjacentText('beforeend', msg);
    // countriesContainer.style.opacity = 1;
}
const renderCountry = function(data, className = ''){
    const html = `
            <article class="country ${className}">
                <img class="country__img" src="${Object.values(data.flags)[0]}" />
                <div class="country__data">
                    <h3 class="country__name">${Object.values(data.name)[0]}</h3>
                    <h4 class="country__region">${data.region}</h4>
                    <p class="country__row"><span>👫</span>${(+data.population/ 1000000).toFixed(1)}</p>
                    <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]}</p>
                    <p class="country__row"><span>💰</span>${Object.values(Object.values(data.currencies)[0])[0]}</p>
                </div>
            </article>`;
            countriesContainer.insertAdjacentHTML('beforeend', html);
            // countriesContainer.style.opacity = 1;
}
const getPosition = function(){
    return new Promise(function(resolve, reject){
        navigator.geolocation.getCurrentPosition(resolve, reject);        
    });
}

const whereAmI = function(){
    getPosition().then(pos =>{
        const {latitude: lat, longitude: lng} = pos.coords
        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    })
    .then(response =>{
        btn.classList.add('btn-space');
        if(!response.ok)
            throw new Error(`Country not found. Error ${response.status}`)
        return response.json()
    })
    .then(data => {
        const country = data.country;
        const city = data.city;
        
    const getJSON = function(url, errorMsg = 'Something went wrong'){
        return fetch(url).then(function(response){
        
            if(!response.ok)
                throw new Error(`${errorMsg} ${response.status}`)
            return response.json();
        })
    }
    const getCountryData = function(country){
        // country 1

        getJSON(`https://restcountries.com/v3.1/name/${country}`,'Country not found' )
        .then(function(data){
            renderCountry(data[0]);
            console.log(data[0]);
            const neighbour = data[0].borders[0];

            if(!neighbour)
            throw new Error('No neighbour found!');


            // Country 2 - Neighbour

            return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'Country not found');

        }).then(function(data){
                renderCountry(data[0], 'neighbour') 
            })
            .catch(err => {
                console.error(`${err}`)
                renderError(`Something went wrong ${err.message} Try again!`)
            })
            .finally(() => {
                countriesContainer.style.opacity = 1; 
            })
    };
        getCountryData(country)
        console.log(`You are in ${city}, ${country}`);
    })
    .catch(err =>{
        console.log(`Something went wrong! ${err.message}`);
    })
};
btn.addEventListener('click', whereAmI);