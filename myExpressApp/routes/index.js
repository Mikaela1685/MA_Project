var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SkyWardrobe', message: "The Weather Based Wardrobe Suggestor!" });
});


router.get('/api/weather', async function(req, res, next) {

  const imageDb = {
    "rain": ["images/umbrella.png", "images/rain-jacket.png"], // add your rain images
    "tops": {
      "short": ["images/mens-short-sleeve-t-shirt.jpg", "images/9puo_bz5g_210608.jpg", "images/1c42c941-c711-4542-9564-20747abe63d4.jpg"],
      "long": ["images/vecteezy_black-jacket-with-zipper-on-the-back_65387474.png"],
      "extra": ["images/vecteezy_mint-sweatshirt-isolated-on-transparent-background_47242204.png"]
    },
    "pants": {
      "short": [],
      "long": [],
    },
    "high": []
  };

  const location = req.query.loc;
  const apiKey = "2adb6f0d8b98f55b13b32d85e20665ac";

  try {
    // Get coordinates
    const locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
    const locationRes = await fetch(locationURL);
    const locData = await locationRes.json();

    console.log("Geo API result:", locData);
    if (!locData || !locData[0]) {
       return res.status(404).json({ error: "City not found" });
    }

    const { lon, lat, name, country, state } = locData[0];

    // Get weather data
    //const exclude = "hourly,current,minutely,alerts";
    const units = "metric";
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();
    
    console.log("W API result:", weatherData);
    if (!weatherData) {
      return res.status(500).json({ error: "Weather API failed" });
    }

    const tempMax = weatherData.main.temp_max;
    const tempMin = weatherData.main.temp_min;
    const rainAmount = weatherData.weather[0].main.toLowerCase().includes('rain') ? "rain" : "none";
    //const UV = weatherData.current[0].uvi;
    //const UVIndex = UV >= 6 ? "high" : "low";

    // Determine temperature categories
    let tempCat;
    if (tempMax >= 27) {
      tempCat = ["short", "short"];
    } else if (tempMax >= 23) {
      tempCat = ["short", "long"];
    } else if (tempMax >= 19) {
      tempCat = ["long", "long"];
    } else {
      tempCat = ["extra", "long"];
    }

    const rain = rainAmount > 0 ? "rain" : "none";

    // Random image picker
    function getRandomImage(category, sub = null) {
      const options = sub ? imageDb[category][sub] : imageDb[category];

      if (!options || options.length === 0) return null;

      return options[Math.floor(Math.random() * options.length)];
    }

    // Select images
    const topImage = getRandomImage("tops", tempCat[0]);
    const pantImage = getRandomImage("pants", tempCat[1]);
    const rainImage = rain === "rain" ? getRandomImage("rain") : null;
    //const UVImage = UVIndex === "high" ? getRandomImage("high") : null;

    // Send final response
    const finalResponse = {
      name,
      state,
      country,
      tempMax,
      tempMin,
      rain,
      //UV,
      topImage,
      pantImage,
      rainImage,
      //UVImage
    };

    console.log("Final JSON to send:", finalResponse); // <-- logs it in Node console
    res.json(finalResponse);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch weather data" });
  }
});

module.exports = router;