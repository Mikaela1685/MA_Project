var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SkyWardrobe', message: "The Weather Based Wardrobe Suggestor!" });
});


router.get('/api/weather', async function(req, res, next) {

  const imageDb = {
    "rain": [],
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
  const apiKey = "741670324dd0884f5acf3a0f3e581c2a"

  const locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

  let lon, lat, country, state;

  try {
    const response = await fetch(locationURL);
    const data = await response.json();
    res.json(data);

    lon = data.lon; //i think i dont need the data[0]
    lat = data.lat;
    country = data.country;
    state = data.state;

    res.json({ lon, lat, country, state });

    } catch (error) {
      console.error(error);
      res.status(500).json({error: "Invalid City"});
    }

let temp, tempMax, tempMin, rain, UV, UVIndex;
const exclude = "hourly,current,minutely,alerts";
const units = "metric";
const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${apikey}`;

try {
  const response = await fetch(weatherURL);
  const data = await response.json();

  // access first day
  tempMax = data.daily[0].temp.max;
  tempMin = data.daily[0].temp.min;
  rain = data.daily[0].rain || 0;
  UV = data.daily[0].uvi;

  // convert values to categories
  UVIndex = UV >= 6 ? "high" : "low";

  temp = [];
  if (tempMax >= 27) {
    temp = ["short", "short"];
  } else if (tempMax >= 23) {
    temp = ["short", "long"];
  } else if (tempMax >= 19) {
    temp = ["long", "long"];
  } else {
    temp = ["extra", "long"];
  }

  rain = rain > 0 ? "rain" : "none";

  res.json({ tempMax, tempMin, temp, rain, UV });

} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Unable to Fetch Data :(" });
}

  console.log

  function getRandomImage(category, sub = null) {
    const options = sub ? imageDb[category][sub] : imageDb[category];

    return options[Math.floor(Math.random() * options.length)];
  }

  const top = getRandomImage("tops", temp[0])
  const pant = getRandomImage("pants", temp[1])



});

module.exports = router;
