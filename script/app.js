// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
let updateSun = function(percentage) {
	// We draaien de graden om zodat de zon ondergaat ipv opkomt.
	const sun = document.querySelector('.js-sun');
	sun.style.left = `${percentage}%`;
	sun.style.bottom = `${percentage}%`;

	const now = new Date();
	const currentHour = now.getHours();
	const currentMinutes = now.getMinutes();
	const resultString = `${currentHour}:${currentMinutes}`;
	sun.dataset.time = resultString;
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const sun = document.querySelector('.js-sun');
	const minutesLeft = document.querySelector('.js-time-left');

	// Bepaal het aantal minuten dat de zon al op is.
	const now = new Date();
	const minutesSunUp = (now.getHours() * 60 + now.getMinutes()) - (sunrise.getHours() * 60 + sunrise.getMinutes());
	console.log(`minutesSunUp: ${minutesSunUp}`);
	
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	const percentage = (minutesSunUp / totalMinutes) * 100;
	console.log(`percentage: ${percentage}`);

	if (percentage > 100) {
		percentage = 100;
		updateSun(100);
	} else if (percentage < 0) {
		percentage = 0;
		updateSun(0);
	} else {
		updateSun(percentage);
	}


	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	sunrise = new Date(queryResponse.city.sunrise * 1000);
	console.log(`sunries: ${sunrise.toLocaleTimeString("it-IT")}`);
	sunset = new Date(queryResponse.city.sunset * 1000);
	console.log(`sunset: ${sunset.toLocaleTimeString("it-IT")}`);
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.

	let totalMinutes = (sunset - sunrise) / 60000;
	console.log(`totalMinutes: ${totalMinutes.toFixed(2)}`);


	placeSunAndStartMoving(totalMinutes.toFixed(2), sunrise);
};

let sunrise;
let sunset;

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
	// Eerst bouwen we onze url op // Met de fetch API proberen we de data op te halen. // Als dat gelukt is, gaan we naar onze showResult functie.
	const weatherInfo = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=38bd5dec406e200a245606ea219f32cf&units=metric&lang=nl&cnt=1`, ).then((response) => response.json());

	console.log(weatherInfo);
	showResult(weatherInfo);
};

document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
	
});
