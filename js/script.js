// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=fb540407a1ee85b08bd6cdad1a666ed3
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=fb540407a1ee85b08bd6cdad1a666ed3

// Элементы страницы, задействованные в оформлении
const html = document.querySelector('html')
const body = document.querySelector('body')

// Элементы страницы, задействованные в геолокации
let ann = document.querySelector('.city') // Хранит название города, погоду которого отображает сайт
let inputed_city = document.getElementsByTagName('input')[3] // Поле пользовательского ввода
let enter_button = document.querySelector('.input_city_enter') // Кнопка Click
enter_button.addEventListener("click", click, false) // Событие нажатия для кнопки Click

// Изменяем цветовое оформление страницы 
// (--background_color_1 - фон header)
// Сведём возможные типы погоды к нескольким видам и будем вызывать соответствующие функции

// Набор функций меняющих оформление:
function Clear(){
    html.style.cssText = `
        --background_color_1: rgb(209 214 252 / 90%);
    `
    body.style.background = `0 0 / 100% repeat-X url(img/clear.jfif) rgb(96 161 217)`
}

function Clouds(){
    html.style.cssText = `
        --background_color_1: rgb(217 217 223 / 90%);
    `
    body.style.background = `0 0 / 50% repeat-X url(img/clouds.png) #babbbf`
}

function Rain(){
    html.style.cssText = `
        --background_color_1: rgb(217 217 223 / 90%);
    `
    body.style.background = `0px -120px / 50%  repeat-X url(img/rain.png) rgb(100 100 100)`
}

function Snow(){
    html.style.cssText = `
        --background_color_1: rgb(240 240 245 / 80%);
    `
    body.style.background = `-50px 0px / 150%  repeat-y url(img/snow.png) rgb(218 218 218)`
}

function Sand(){
    html.style.cssText = `
        --background_color_1: rgb(249 249 242 / 80%);
    `
    body.style.background = `-50px -300px / 100%  repeat-x url(img/sand.png) rgb(184 183 113)`
}

function Smoke(){
    html.style.cssText = `
        --background_color_1: rgb(251 251 251 / 90%);
    `
    body.style.background = `-50px 0px / 150%  repeat-y url(img/smoke.png) rgb(118 118 118)`
}

function Default(){
    html.style.cssText = `
    --background_color_1: white;
    --backgroung_color_2: #ededed;
    --backgroung_color_3: #ededed;
    `
    body.style.background = `linear-gradient(180deg, var(--backgroung_color_2), var(--backgroung_color_3))`
}

// _______________________________________
// _________get_city_coords_API___________
// _______________________________________

// Определяем координаты города и передаём их в функцию set_style
async function get_city_coords_API (city = "St.Petersburg"){ // Выставляем значение по умолчанию "на всякий случай"
    city = await get_ip_and_location() // определяем текущий город пользователя. Найдём его координаты при помощи API
    let city_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=fb540407a1ee85b08bd6cdad1a666ed3`
    let response = await fetch(city_url)
    let data = await response.json()
    let lat = data[0].lat
    let lon = data[0].lon
    ann.innerHTML = city
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=fb540407a1ee85b08bd6cdad1a666ed3`
    set_style(url)
}

// _______________________________________
// ________________click__________________
// _______________________________________

// Функция, вызываемая при нажатии на кнопку "Click". Вызывается через событие "click" для input.input_city_enter 
// Суть примерна та же, что и для get_city_coords_API()
async function click() {
    let city = inputed_city.value // Получаем значение, введённое пользователем
    let city_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=fb540407a1ee85b08bd6cdad1a666ed3`
    let response = await fetch(city_url)
    let data = await response.json()
    if(data != 0) { // В случае, если удалось определить город, используем его координаты для нахождения погоды, <...
        let lat = data[0].lat
        let lon = data[0].lon
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=fb540407a1ee85b08bd6cdad1a666ed3`
        set_style(url)
        ann.innerHTML = data[0].name
    } else { // ...> иначе выводим сообщение о проблеме
        ann.innerHTML = "City can`t be found"
    }
}

// Функция поиска внешнего IP пользователя (не понадобилась)
// async function get_user_ip () {
//     let response = await fetch(`https://api.ipify.org?format=json`)
//     let data = await response.json()
//     let ip = data.ip
//     console.log(data.ip)
//     ip_to_location(data.ip)
// }

// _______________________________________
// _________get_ip_and_location___________
// _______________________________________

// Внешний IP-адрес в местонахождения
async function get_ip_and_location () {
    let response = await fetch(`http://api.sypexgeo.net/`) // При помощи API получаем из нашего внешнего IP адреса через адресную книгу провайдера примерное местонахождение
    let data = await response.json()
    return data.city.name_en // Возвращаем название города
}

// _______________________________________
// ______________set_style________________
// _______________________________________

// Функция работающая определяющая тип погоды и вызывающая соответствующую функцию для изменения оформления страницы
async function set_style (url){ // передаём адрес с координатами нужного города
    let response = await fetch(url) // запрашиваем API
    let data = await response.json() // Преобразуем ответ в .json формат
    let name = data.weather[0].main // Тип погода (снег, дождь, туман ...)
    switch(name){
        case 'Snow': 
            Snow()
            break
        case 'Mist':
        case 'Haze':
        case 'Smoke':
            Smoke()
            break
        case 'Sand':
        case 'Dust':
            Sand()
            break
        case 'Clouds':
            Clouds()
            break
        case 'Thunderstorm':
        case 'Rain':
            Rain()
            break
        case 'Clear':
            Clear()
            break
        default: // Если тип погоды не определён возвращаем изначальное оформление
            Default()
    }
}

// Вызываем функцию определения координат города
get_city_coords_API()
