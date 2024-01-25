import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

function getGif(keyword, searchType) {
  console.log(keyword);
  let request = new XMLHttpRequest();
  let url = `http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${process.env.API_KEY}`;
  if (searchType === "trending") {
    url = `http://api.giphy.com/v1/gifs/trending?&api_key=${process.env.API_KEY}`;
  } else if (searchType === "random") {
    url = `http://api.giphy.com/v1/gifs/random?&api_key=${process.env.API_KEY}`;
  }

  request.addEventListener("loadend", function () {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, keyword);
    } else {
      printError(response, keyword);
    }
  });

  request.open("GET", url, true);
  request.send();
}

function printError(apiResponse, keyword) {
  document.querySelector("#showGifs").innerHTML = `There was an error accessing gifs for ${keyword}: ${apiResponse.meta.status} ${apiResponse.meta.msg}`;
}

function createImage(url) {
  let gifsDiv = document.querySelector("div#showGifs");
  let img = document.createElement("img");
  img.src = url;
  img.height = "300";
  img.width = "400";
  gifsDiv.append(img);
}

function printElements(apiResponse) {
  let gifsDiv = document.querySelector("div#showGifs")
  gifsDiv.innerHTML = null;
  if (Array.isArray(apiResponse.data)) {
    for (let index = 0; index < 12; index++) {
      createImage(apiResponse.data[index].images.original.url);
    }
  } else {
    createImage(apiResponse.data.images.original.url);
  }
}

function checkRadioButtons(event) {
  event.preventDefault();
  const radioButtonValue = document.querySelector("input[name='search']:checked").value;
  const keywordInput = document.getElementById("keywordInput");
  if (radioButtonValue === "byKeyword") {
    keywordInput.removeAttribute("class", "hidden");
  } else {
    keywordInput.setAttribute("class", "hidden");
  }
}

function handleFormSubmission(event) {
  event.preventDefault();
  const keyword = document.querySelector("#keyword").value;
  const trendingOrRandom = document.querySelector("input[name='search']:checked").value;
  if (trendingOrRandom !== "byKeyword") {
    console.log(trendingOrRandom);
    getGif(null, trendingOrRandom);
  } else if (trendingOrRandom === "byKeyword" && keyword !== "") {
    console.log("form submission: ", keyword);
    getGif(keyword);
  } else {
    document.querySelector("#showGifs").innerHTML = "Please enter a keyword!";
  }
}

window.addEventListener("load", function () {
  document.querySelectorAll(".radioButtons").forEach(button => {
    button.addEventListener("change", checkRadioButtons);
  });
  document.querySelector("form").addEventListener("submit", handleFormSubmission);
});