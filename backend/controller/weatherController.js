import weatherModel from "../models/weatherSchema.js";
import locationModel from "../models/locationSchema.js";
import axios from "axios";

const weatherController = {
  getWeather: async (req, res) => {
    try {
      const weatherData = await weatherModel.findOne().sort({ timestamp: -1 });

      if (!weatherData) {
        return res.status(404).json({ error: "Weather data not found" });
      }

      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  },

  storeWeather: async (req, res) => {
    try {
      const locationData = await locationModel.findOne().sort({ createdAt: -1 });

      if (!locationData) {
        return res.status(400).json({
          msg: "Location not found, please enter your location",
        });
      }

      const { lat, lon } = locationData; // ✅ FIX

      const API_KEY = process.env.OPENWEATHER_API_KEY;

      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      const response = await axios.get(url);

      // 📊 Get daily rainfall (next 7 days)
      const daily = response.data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 7);

      // 💾 STORE each day in MongoDB
      const savedData = [];

      for (let item of daily) {
        const rainfall = item.rain?.["3h"] || 0;

        const saved = await weatherModel.create({
          rainfall,
        });

        savedData.push(saved);
      }

      res.json({
        message: "Weather data stored successfully",
        data: savedData,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to store weather data" });
    }
  },
};

export default weatherController;