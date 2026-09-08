const getWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "City is required",
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.message || "Unable to fetch weather",
      });
    }

    res.status(200).json({
      city: data.name,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weather: data.weather[0].main,
      description: data.weather[0].description,
    });
  } catch (error) {
    console.error("Weather Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { getWeather };