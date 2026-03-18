
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

    const response = await fetch('/api/weather?loc=${encodeURIComponent(location)}');
    const data = await response.json();
    
    console.log(data);
    }
    
    //fetch the location api. determine if a postcode or city name was entered
    //if neither was found, say error try again
    //if succesful fetch the weather one.
 
});