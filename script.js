function getCurrentPosition(fn) {
    let defaultPos = [50, 50]

    if (!navigator.geolocation) {
        alert("Браузер не поддерживает")
        fn(defaultPos)
        return
    }

    navigator.geolocation.getCurrentPosition(
        function (location) {
            fn([location.coords.latitude, location.coords.longitude])
        },
        function () {
            alert("Что-то пошло не так")
            fn(defaultPos)
        }
    )
}

function getWeatherJsonFromCoordinates(lat, lon, fn) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid=9c267e6baa6acb2b0131fb15ee8200bb").then(
        t => { t.json().then(b => fn(b)) }
    )
}

function getWeatherJsonFromName(name, fn) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+name+"&units=metric&appid=9c267e6baa6acb2b0131fb15ee8200bb").then(
        t => { t.json().then(b => fn(b)) }
    )
}

function createList(info) {
    return `
    <ul class="current_info">
        <li><span>Тип погоды</span> <span>`+info["weather"][0]["main"]+`</span></li>
        <li><span>Давление</span> <span>`+info["main"]["pressure"]+`</span></li>
        <li><span>Видимость</span> <span>`+info["visibility"]+`</span></li>
        <li><span>Облачность</span> <span>`+info["clouds"]["all"]+`</span></li>
        <li><span>Влажность</span> <span>`+info["main"]["humidity"]+`</span></li>
    </ul>
    `
}

function weatherIconUrl(info) {
    return "https://openweathermap.org/img/w/" + info["weather"][0]["icon"] + ".png"
}

function updateCurrentLocation() {
    getCurrentPosition(function (loc) {
        getWeatherJsonFromCoordinates(loc[0], loc[1], function (info) {
            document.getElementById("current_weather_info").innerHTML = `
        <div class="left">
            <h2>`+info['name']+`</h2>
            <div class="left_content">
                <div class="left_left">
                    <img src="`+weatherIconUrl(info)+`">
                </div>
                <div class="left_right">`+info["main"]["temp"]+`°C</div>
            </div>
        </div>
        <div class="right">
            `+createList(info)+`
        </div>
        `
        })
    })
}

updateCurrentLocation()
document.querySelector(".update_button button").addEventListener("click",function () {
    document.getElementById("current_weather_info").innerHTML = "загрузка"
    updateCurrentLocation()
})

function createCityInList(info) {
    return `
    <li>
        <div class="block_header">
            <h3>` + info["name"] + `</h3>
            <div class="degree">` + info["main"]["temp"] + `°C</div>
            <img src="` + weatherIconUrl(info) + `">
            <div>
                <button>x</button>
            </div>
        </div>
        ` + createList(info) + `
    </li>
    `
}

document.getElementById("new_city_form").onsubmit = function () {
    let city = document.getElementById("new_city_form_input").value

    if (city === "") {
        alert("Пустое поле ввода")
        return false
    }

    getWeatherJsonFromName(city, function (info) {
        document.getElementById("favorites_list").insertAdjacentHTML("afterbegin", createCityInList(info))
    })

    return false
}