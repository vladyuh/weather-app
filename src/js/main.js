//Remove animations on load
window.onload = function () {
    document.querySelector('body').classList.remove('perf-no-animation');
}

//Check webp support
function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
    if (support === true) {
        document.querySelector('body').classList.add('webp');
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
});

//100vh hack
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", "".concat(vh, "px"));
window.addEventListener("resize", function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", "".concat(vh, "px"));
});

//Mobile menu init
function mobileMenu() {
    var toggle = document.querySelector('.header-burger .burger');
    var menu = document.querySelector('.mobileMenu');
    var body = document.querySelector('body');

    this.onOpen = function () {
        toggle.classList.add('open');
        menu.classList.add('opened');
        body.classList.add('mobile');
        return true;
    };

    this.onClose = function () {
        toggle.classList.remove('open');
        menu.classList.remove('opened');
        body.classList.remove('mobile');
    }
}

var mobileMenu = new mobileMenu();

document.querySelector('.header-burger .burger').addEventListener('click', function (e) {
    e.preventDefault();
    mobileMenu.onOpen();
});

document.querySelector('.mobileMenu-header__toggle .burger').addEventListener('click', function (e) {
    e.preventDefault();
    mobileMenu.onClose();
});

var navLinks = document.querySelectorAll('.mobileMenu-nav__ul li a');
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function () {
        mobileMenu.onClose();
    });
}

//Browser-level image lazy-loading
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    for (var i = 0; i < images.length; i++) {
        images[i].src = images[i].dataset.src;
    }
} else {
    const script = document.createElement('script');
    script.src = '/js/lazysizes.min.js';
    document.body.appendChild(script);
}

//form submit
var submit = document.querySelectorAll('input[type=submit], button[type="submit"]');
for (var i = 0; i < submit.length; i++) {
    submit[i].addEventListener('click', function (e) {
        this.closest('form').classList.add('submitted');
    });
}

function initMap(){
    ymaps.ready(init);
    function init() {
        var location = ymaps.geolocation;
        var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 8,
            controls: [],
        }, {
            searchControlProvider: 'yandex#search'
        });
        location.get()
            .then(
                function(result) {
                    myMap.geoObjects.add(result.geoObjects);
                    myMap.setCenter(result.geoObjects.position, 12, {
                        checkZoomRange: true
                    });
                    initWeather(result.geoObjects.position);
                },
                function(err) {
                    console.log('Ошибка: ' + err)
                }
            );
    }
}

initMap();

var weatherObject;

function initExtra(){

    var hourly = weatherObject.hourly;

    for(var i=1; i<6; i++){
        var item = document.createElement('div');
        item.classList.add('hour-item');

        var image = document.createElement('img');
        image.src = "//openweathermap.org/img/wn/" + hourly[i].weather[0].icon + "@4x.png";
        image.width = 36;
        image.height= 36;
        image.classList.add('lazy');
        image.loading = "lazy";

        var temp = document.createElement('div');
        temp.classList.add('temp');
        temp.textContent = Number(hourly[i].temp).toFixed() + " C°";

        var dt = hourly[i].dt;
        var data = new Date(dt * 1000);

        var date = document.createElement('div');
        date.classList.add('time');
        date.textContent = data.getHours().toString() + ":00";

        item.appendChild(date);
        item.appendChild(image);
        item.appendChild(temp);


        document.querySelector('.weather-block__extra .hourly').appendChild(item);
    }
}

function initWeather(arr){

    var lat = arr[0];
    var lon = arr[1];


    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(request.readyState === 4) {
            weatherObject = JSON.parse(request.responseText)
            console.log(weatherObject);
            var weat = weatherObject.current.weather[0].icon;
            var image = document.querySelector('.weather-block__icon img');
            image.src = "//openweathermap.org/img/wn/" + weat + "@4x.png";

            var degree = document.querySelector('.weather-block__degree');
            var degreeNumber = Number(weatherObject.current.temp).toFixed();
            degree.textContent = degreeNumber + " C°";

            var status = document.querySelector('.weather-block__status .state');
            status.textContent = weatherObject.current.weather[0].description;

            var feels = document.querySelector('.weather-block__status .feels');
            feels.textContent = "Ощущается как "+Number(weatherObject.current.feels_like).toFixed() + " C°";

            var morn = document.querySelector('.weather-block__datetime .morn span');
            morn.textContent = "Днем: " + Number(weatherObject.daily[0].temp.day).toFixed() + " C°";

            var night = document.querySelector('.weather-block__datetime .night span');
            night.textContent = "Ночью: " + Number(weatherObject.daily[0].temp.night).toFixed()  + " C°";

            var preloader = document.querySelector('.preloader.is-active');
            preloader.classList.remove('is-active');

            initExtra();

        }
    }
    request.open(
        'Get',
        'https://api.openweathermap.org/data/2.5/onecall' +
        '?lat=' + lat +
        '&lon=' + lon +
        '&appid=243c2bfa58ccc9584ed82f2d42d9973f' +
        '&units=metric' +
        '&lang=ru');
    request.send();
}

