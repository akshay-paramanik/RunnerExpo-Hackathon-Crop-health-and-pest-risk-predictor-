import SensorModel from "../models/sensorSchema.js";
import WeatherModel from "../models/weatherSchema.js";
import PestModel from "../models/pestSchema.js";
import NdviModel from "../models/ndviSchema.js";

export const get24SetData = async () => {
  const sensorData = await SensorModel.find()
    .sort({ createdAt: -1 })
    .limit(24)
    .sort({ createdAt: 1 });

  if (sensorData.length < 24) throw new Error("Not enough sensor data");

  const startTime = sensorData[0].createdAt;
  const endTime = sensorData[23].createdAt;

  // WEATHER
  const weatherData = await WeatherModel.find({
    createdAt: { $gte: startTime, $lte: endTime }
  }).sort({ createdAt: 1 });

  let rainArray = new Array(24).fill(0);

  if (weatherData.length === 1) {
    rainArray.fill(weatherData[0].rain);
  } else if (weatherData.length > 1) {
    const chunk = Math.floor(24 / weatherData.length);

    weatherData.forEach((w, i) => {
      const start = i * chunk;
      const end = (i === weatherData.length - 1) ? 24 : (i + 1) * chunk;

      for (let j = start; j < end; j++) {
        rainArray[j] = w.rain;
      }
    });
  } else {
    const lastWeather = await WeatherModel.findOne().sort({ createdAt: -1 });
    rainArray.fill(lastWeather?.rain || 0);
  }

  // PEST
  const pestEvents = await PestModel.find({
    createdAt: { $gte: startTime, $lte: endTime }
  });

  let pestValue = pestEvents.length > 0 ? 1 : 0;

  if (!pestEvents.length) {
    const last = await PestModel.findOne().sort({ createdAt: -1 });
    pestValue = last?.pestDetected ? 1 : 0;
  }

  const pestArray = new Array(24).fill(pestValue);

  // NDVI
  const ndviData = await NdviModel.findOne().sort({ createdAt: -1 });
  const ndviArray = new Array(24).fill(ndviData?.ndvi || 0);

  // FINAL
  return sensorData.map((s, i) => [
    s.temperature,
    s.humidity,
    s.soilMoisture,
    rainArray[i],
    ndviArray[i],
    pestArray[i]
  ]);
};