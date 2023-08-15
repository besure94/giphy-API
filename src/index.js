import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// add functionality for trending and random endpoints
// add a try...catch block

function getGif(keyword) {
  let request = new XMLHttpRequest();
  console.log(request);
  const url = `http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, keyword);
    } else {
      printError(this, keyword);
    }
  });

  request.open("GET", url, true);
  request.send();
}

function printError(request, keyword) {
  document.querySelector("#showGifs").innerHTML = `There was an error accessing gifs for ${keyword}: ${request.status} ${request.statusText}`;
}

function printElements(apiResponse) {
  let gifsDiv = document.querySelector("div#showGifs")
  gifsDiv.innerHTML = null;
  for (let index = 0; index < 10; index++) {
    let img = document.createElement("img");
    img.src = apiResponse.data[index].images.original.url;
    img.height = "300";
    img.width = "400";
    gifsDiv.append(img);
  }
}

function handleFormSubmission(event) {
  event.preventDefault();
  const keyword = document.querySelector("#keyword").value;
  getGif(keyword);
}

window.addEventListener("load", function() {
  document.querySelector("form").addEventListener("submit", handleFormSubmission);
});