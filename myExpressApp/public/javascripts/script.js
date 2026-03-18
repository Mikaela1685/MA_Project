
document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("Location");
  const submitBtn = document.getElementById("submitBtn");
  const suggestionContainer = document.getElementById("suggestion-container");

  // Press Enter
  inputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendLocation(inputBox.value);
    }
  });

  // Click button
  submitBtn.addEventListener("click", () => {
    sendLocation(inputBox.value);
  });

  async function sendLocation(location) {
    if (!location) return;

    console.log("Location sent:", location);

    const response = await fetch(`/api/weather?loc=${encodeURIComponent(location)}`);
    const data = await response.json();
    
    if (!response.ok) {
      document.getElementById("error-message").textContent = data.error;

      document.getElementById("results").style.display = "none";
    } else {
       // remove error
      document.getElementById("error-message").textContent = "";

      // show results
      document.getElementById("results").style.display = "block";

      document.getElementById("local").textContent =
        `${data.name}, ${data.state}, ${data.country}`;

      // display weather
      document.getElementById("temp").textContent =
        `Min: ${data.tempMin}°C Max: ${data.tempMax}°C`;

      const rain = data.rain === "rain" ? "a" : "no";
      
      document.getElementById("rain").textContent =
        `There is ${rain} Chance of Rain`;
        
      /*document.getElementById("UV").textContent =
        `The UV Index is ${data.UV}`;*/

      // display images
      if (data.topImage) {
        document.getElementById("topImg").src = data.topImage;
      }
      if (data.pantImage) {
        document.getElementById("pantImg").src = data.pantImage;
      }
      if (data.rainImage) {
      document.getElementById("rainImg").src = data.rainImage;
      }

      /*if (data.UVImage) {
      document.getElementById("UVImg").src = data.UVImage;
      }*/

    console.log(data);
    }
    
  }
});