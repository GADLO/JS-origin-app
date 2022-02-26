const inputPart = $(".input-part"),
  weatherPart = $(".weather-part"),
  infoTxt = $(".info-text"),
  inputField = $(".input-part").children("input");
locationBtn = $(".input-part").children("button");

let api;

inputPart.addClass("active");
$("header>img").on("click", (e) => {
  inputPart.addClass("active");
  weatherPart.removeClass("active");
});

inputField.on("keyup", (e) => {
  if (e.key == "Enter" && inputField.val() != "") {
    requestApi(inputField.val());
  }
});

locationBtn.on("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("该浏览器不支持获取位置信息");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=zh_cn&appid=3d226c5ad41b0bd07907099cfc67a138`;
  fetchData(api);
}

function onError(err) {
  infoTxt.text(err.message);
  infoTxt.addClass("error");
}

function requestApi(city) {
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=zh_cn&appid=3d226c5ad41b0bd07907099cfc67a138`;
  fetchData(api);
}

function fetchData(api) {
  infoTxt.text("正在获取天气信息...");
  infoTxt.addClass("pending");
  fetch(api)
    .then((res) => res.json())
    .then((res) => weatherDetails(res));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.removeClass("pending").addClass("error");
    infoTxt.text(`${inputField.val()}不是有效的地点名`);
  } else {
    infoTxt.removeClass("error").removeClass("pending");
    inputPart.removeClass("active");
    weatherPart.addClass("active");

    //获取天气信息
    const city = info.name;
    const country = info.sys.country;
    const { description, icon } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

   
    
    const wIcon = $('.weather-part>img')
    wIcon.attr('src',`./icons/${icon}.svg`) 
    console.log(wIcon.attr('src'),icon);
    
    //写入天气信息
    // console.log(feels_like,humidity,temp);

    $(".numb").text(temp);
    $(".location>span").text(`${country},${city}`);
    $(".numb-2").text(feels_like);
    $(".numb-3").text(humidity);
    $(".weather").text(description);
  }
}

function toCelsius(f) {
  return (5 / 9) * (f - 32);
}
