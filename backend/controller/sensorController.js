import SensorData from "../models/sensorSchema.js";

// 🔥 Add sensor data (ESP32 will hit this)
export const addSensorData = async (req, res) => {
  try {
    const { soilMoisture, temperature, humidity } = req.body;

    const data = await SensorData.create({
      soilMoisture,
      temperature,
      humidity,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 Get latest sensor data
export const getSensorData = async (req, res) => {
  try {
    const data = await SensorData.find()
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};